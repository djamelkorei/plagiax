"use server";

import crypto from "node:crypto";
import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { getServerUser } from "@/lib/auth.service";
import { AddSubmissionFormSchema } from "@/lib/form.service";
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

export async function submissionAddAction(
  formData: FormData,
): Promise<{ hasError: boolean; message: string }> {
  const authUser = await getServerUser();
  if (!authUser) {
    return { hasError: true, message: "Unauthorized" };
  }

  if (!authUser.is_membership_active) {
    return {
      hasError: true,
      message:
        "You consume all your daily quota for today, come back tomorrow or upgrade your plan",
    };
  }

  const settings = await prisma.settings.findFirst();
  if (settings?.submission_action === "MANUAL") {
    const pendingCount = await prisma.submissions.count({
      where: {
        user_id: authUser.id,
        status: "PENDING",
      },
    });

    if (pendingCount >= 1) {
      return {
        hasError: true,
        message:
          "The maximum number of pending submissions is 1. Please wait until the pending submissions are processed.",
      };
    }
  } else {
    if (authUser.submission_day_count + 1 > authUser.daily_quota) {
      return {
        hasError: true,
        message:
          "You consume all your daily quota for today, come back tomorrow or upgrade your plan.",
      };
    }
  }

  const body = Object.fromEntries(formData);
  const parsed = AddSubmissionFormSchema.safeParse({
    ...body,
    exclusion_value: Number(body.exclusion_value),
    exclusion_small_sources: body.exclusion_small_sources === "true",
    exclusion_bibliographic: body.exclusion_bibliographic === "true",
    exclusion_quoted: body.exclusion_quoted === "true",
  });

  if (!parsed.success) return { hasError: true, message: "Invalid input" };

  let result = false;

  try {
    const originalFileName = parsed.data.file.name;
    const s3Path = randomFileName(originalFileName);
    const arrayBuffer = await parsed.data.file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const command = new PutObjectCommand({
      Bucket: process.env.AWS_BUCKET,
      Key: s3Path,
      Body: buffer,
      StorageClass: "GLACIER_IR",
    });

    await s3Client.send(command);

    const now = new Date();

    await prisma.submissions.create({
      data: {
        title: parsed.data.title ?? "",
        status: "PENDING",
        user_id: authUser.id,
        posted_at: new Date(),
        is_quick_submission: true,
        exclusion_bibliographic: parsed.data.exclusion_bibliographic,
        exclusion_quoted: parsed.data.exclusion_quoted,
        exclusion_small_sources: parsed.data.exclusion_small_sources,
        exclusion_type: parsed.data.exclusion_type,
        exclusion_value: parsed.data.exclusion_value,
        original_filename: originalFileName,
        file_link: s3Path,
        created_at: now,
        updated_at: now,
      },
    });

    result = true;
  } catch (error) {
    console.error(`Exception in writeFile() with error`, error);
  } finally {
    console.debug(`Exit: writeFile() with result = [${result}]`);
  }

  return {
    hasError: false,
    message: "success",
  };
}

const randomFileName = (originalName: string) => {
  const ext = originalName.split(".").pop(); // pdf, docx, etc.
  const random = crypto.randomBytes(24).toString("base64url"); // URL-safe
  return `submissions/${random}.${ext}`;
};
