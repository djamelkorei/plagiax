import * as fs from "node:fs";
import path from "node:path";
import { GetObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { type NextRequest, NextResponse } from "next/server";
import { PDFDocument, rgb } from "pdf-lib";
import { getServerUser } from "@/lib/auth.service";
import { prisma } from "@/prisma";

// S3 config
const s3Client = new S3Client({
  region: process.env.AWS_DEFAULT_REGION ?? "",
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID ?? "",
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY ?? "",
  },
  bucketEndpoint: true,
  forcePathStyle: process.env.AWS_S3_USE_PATH_STYLE_ENDPOINT === "true",
});

export async function GET(req: NextRequest) {
  const submissionId = Number(
    req.nextUrl.searchParams.get("submissionId") ?? 0,
  );
  const submissionType: "file" | "report" | "ai" | string =
    req.nextUrl.searchParams.get("submissionType") ?? "";

  const auth = await getServerUser();
  if (!auth)
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

  // Load submission
  const submission = await prisma.submissions.findFirst({
    where: { id: Number(submissionId) },
  });

  if (!submission || submission.status === "DELETED" || submission.deleted_at) {
    return NextResponse.json({ message: "Not Found" }, { status: 404 });
  }

  const submissionUser = await prisma.users.findFirst({
    where: { id: Number(submission.user_id) },
  });

  if (
    !submissionUser ||
    (Number(submissionUser.id) !== auth.id &&
      Number(submissionUser.instructor_id) !== auth.id)
  ) {
    return NextResponse.json({ message: "Not Found" }, { status: 404 });
  }

  // Pick correct link
  let downloadLink: string | null;
  let suffix = "";
  let filename: string | null = null;

  if (submissionType === "file") {
    downloadLink = submission.file_link;
  } else if (submissionType === "report") {
    downloadLink = submission.report_link;
    suffix = "_report";
  } else {
    downloadLink = submission.ai_link;
    suffix = "_ai_report";
  }

  if (!downloadLink) {
    return NextResponse.json({ message: "No file available" }, { status: 404 });
  }

  // Filename logic (same as Laravel)
  if (submission.original_filename) {
    if (submissionType === "file") {
      filename = submission.original_filename;
    } else {
      const base = submission.original_filename.replace(/\.[^/.]+$/, "");
      filename = `${base}${suffix}.pdf`;
    }
  }

  const command = new GetObjectCommand({
    Bucket: process.env.AWS_BUCKET ?? "",
    Key: downloadLink,
  });

  const s3Response = await s3Client.send(command);

  const headers = new Headers();
  headers.set(
    "Content-Type",
    s3Response.ContentType || "application/octet-stream",
  );
  headers.set(
    "Content-Disposition",
    `attachment; filename="${encodeURIComponent(filename ?? "")}"`,
  );
  headers.set("x-file-name", encodeURIComponent(filename ?? ""));

  const chunks: Uint8Array[] = [];
  // @ts-expect-error
  for await (const chunk of s3Response.Body) {
    chunks.push(chunk);
  }
  let fileBuffer = Buffer.concat(chunks);

  if (submissionType !== "file") {
    fileBuffer = await customizePDFHeader(fileBuffer.buffer, submissionType);
  }

  // Stream the S3 file to the browser
  return new NextResponse(fileBuffer, {
    headers,
  });
}

const customizePDFHeader = async (
  fileBuffer: ArrayBuffer,
  submissionType: string | "report" | "ai",
) => {
  const pdfDoc = await PDFDocument.load(fileBuffer);

  const pages = pdfDoc.getPages();

  const headerHeight = 51;

  const isAI = submissionType === "ai";

  // 🔹 Load & embed image (logo)
  const logoPath = path.join(process.cwd(), "public", "logo.png");
  const logoBytes = fs.readFileSync(logoPath);
  const logoImage = await pdfDoc.embedPng(logoBytes);

  pdfDoc.removePage(0);
  if (submissionType === "ai") {
    pdfDoc.removePage(0);
  }

  for (const page of pages) {
    const { width, height } = page.getSize();
    page.translateContent(0, isAI ? 0 : -headerHeight);

    // Optional: background bar for header
    page.drawRectangle({
      x: 0,
      y: height - (isAI ? headerHeight : 0),
      width,
      height: headerHeight,
      color: rgb(0.95, 0.95, 0.95),
    });

    if (isAI) {
      page.drawRectangle({
        x: 0,
        y: 0,
        width,
        height: headerHeight,
        color: rgb(1, 1, 1),
      });
    }

    // 🔹 Draw logo in the header (scaled)
    const logoScale = 0.2;
    const logoDims = logoImage.scale(logoScale);

    const logoX = 15;
    const logoY =
      height - (isAI ? headerHeight : 0) + (headerHeight - logoDims.height) / 2; // vertically centered in header

    page.drawImage(logoImage, {
      x: logoX,
      y: logoY,
      width: logoDims.width,
      height: logoDims.height,
    });
  }

  const modifiedBytes = await pdfDoc.save();
  return Buffer.from(modifiedBytes);
};
