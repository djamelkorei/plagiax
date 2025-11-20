"use client";

import {
  Avatar,
  Badge,
  Box,
  Button,
  ButtonGroup,
  type ButtonProps,
  CloseButton,
  Dialog,
  Flex,
  HStack,
  IconButton,
  Pagination,
  Portal,
  Spinner,
  Table,
  Text,
} from "@chakra-ui/react";
import axios from "axios";
import moment from "moment";
import { type ReactNode, useEffect, useState } from "react";
import {
  AiOutlineDelete,
  AiOutlineFile,
  AiOutlinePercentage,
} from "react-icons/ai";
import {
  IoAddOutline,
  IoAlertCircleOutline,
  IoWarningOutline,
} from "react-icons/io5";
import { LuChevronLeft, LuChevronRight } from "react-icons/lu";
import { PiFilePdf } from "react-icons/pi";
import { submissionDeleteAction } from "@/app/actions/submission-delete.action";
import { Authorize } from "@/components/authorize";
import { DashboardContainer } from "@/components/dashboard-container";
import { AddSubmissionModal } from "@/components/modals/add-submission-modal";
import { SearchFilter } from "@/components/search-filter";
import { toaster } from "@/components/ui/toaster";
import { Tooltip } from "@/components/ui/tooltip";
import type { Pageable } from "@/dto/pageable.dto";
import type { SubmissionDto } from "@/dto/submission.dto";
import { FormHelper } from "@/helpers/form.helper";
import { useFetch } from "@/hooks/use-fetch";

const dateToFullDateTimeString = (date: string | Date): string => {
  return moment(date).utcOffset(0).format("MMM DD, YYYY, HH:mm");
};

export default function DashboardSubmissions() {
  const [page, setPage] = useState<number>(1);
  const [textFilter, setTextFilter] = useState<string>("");
  const {
    data: pageable,
    loading,
    refetch,
  } = useFetch<Pageable<SubmissionDto>>("/api/submissions", {
    page,
    q: textFilter,
  });
  const [selectedSubmission, setSelectedSubmission] =
    useState<SubmissionDto | null>(null);

  const [deleteLoading, setDeleteLoading] = useState<boolean>(false);
  const [modelOpen, setModelOpen] = useState(false);
  const [modelAddOpen, setModelAddOpen] = useState(false);

  const onDeleteModalOpen = (item: SubmissionDto) => {
    setSelectedSubmission(item);
    setSelectedSubmission((prev) => {
      setModelOpen(true);
      return prev;
    });
  };

  const deleteHandler = (id: number | null) => {
    if (id) {
      setDeleteLoading(true);
      submissionDeleteAction(FormHelper.toFormData({ submissionId: id }))
        .then((res) => {
          if (res) {
            refetch();
          }
        })
        .finally(() => {
          setDeleteLoading(false);
          setModelOpen(false);
          setSelectedSubmission(null);
        });
    }
  };

  useEffect(() => {
    if (!modelOpen) {
      setSelectedSubmission(null);
    }
  }, [modelOpen]);

  return (
    <DashboardContainer
      title={"Submissions"}
      breadcrumbs={["dashboard", "submissions"]}
    >
      <Flex flexDirection={"column"} gap={6}>
        <Flex
          gap={6}
          alignItems={"center"}
          flexDirection={{ base: "column", md: "row" }}
        >
          <Button
            w={"fit-content"}
            onClick={() => {
              setModelAddOpen(true);
            }}
          >
            New Submission
            <IoAddOutline />
          </Button>

          <SearchFilter
            loading={loading}
            callback={(text) => {
              setTextFilter(text ?? "");
            }}
            placeholder={"Search by title, student name | email"}
            marginStart={"auto"}
            w={{ base: "full", md: "350px" }}
          />
        </Flex>

        <Box
          minHeight={"568px"}
          bg={"#fcfcfc"}
          border={"1px solid"}
          borderColor={"border"}
          borderRadius={"sm"}
          overflow={"hidden"}
        >
          <Table.Root variant="outline" size={"sm"}>
            <Table.Header>
              <Table.Row>
                <Table.ColumnHeader w={"400px"}>Document</Table.ColumnHeader>
                <Authorize roles={["instructor"]}>
                  <Table.ColumnHeader w={"270px"}>Student</Table.ColumnHeader>
                </Authorize>
                <Table.ColumnHeader w={"110px"}>Status</Table.ColumnHeader>
                <Table.ColumnHeader w={"100px"}>
                  <Flex gap={1} alignItems={"center"}>
                    Similarity <AiOutlinePercentage />
                  </Flex>
                </Table.ColumnHeader>
                <Table.ColumnHeader w={"160px"}>
                  <Flex gap={1} alignItems={"center"}>
                    AI Similarity
                    <AiOutlinePercentage />
                  </Flex>
                </Table.ColumnHeader>
                <Table.ColumnHeader w={"100px"}></Table.ColumnHeader>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {!loading &&
                pageable?.data &&
                pageable.data.map((item, index) => (
                  <Table.Row
                    key={item.id}
                    cursor={"pointer"}
                    bg={item.status === "DELETED" ? "red.50" : "white"}
                    borderBottomWidth={
                      pageable.data.length - 1 === index ? 0 : 1
                    }
                  >
                    <Table.Cell w={"400px"}>
                      <HStack gap={4}>
                        <DownloadLink
                          submissionId={item.id}
                          submissionType={"file"}
                          size={"xs"}
                          variant={"surface"}
                          colorPalette={"blue"}
                        >
                          <AiOutlineFile />
                        </DownloadLink>
                        <Tooltip content={item.original_filename}>
                          <Box maxW="280px">
                            <Text truncate>{item.title}</Text>
                            <Text textStyle={"xs"} color={"gray.500"}>
                              {dateToFullDateTimeString(item.posted_at)}
                            </Text>
                          </Box>
                        </Tooltip>
                      </HStack>
                    </Table.Cell>
                    <Authorize roles={["instructor"]}>
                      <Table.Cell w={"270px"}>
                        <HStack alignItems={"center"} gap={2}>
                          <Avatar.Root size={"xs"}>
                            <Avatar.Fallback name={item.user_name} />
                          </Avatar.Root>
                          <Tooltip content={item.user_email}>
                            <Box maxW={"240px"}>
                              <Text>{item.user_name}</Text>
                              <Text
                                truncate
                                textStyle={"xs"}
                                color={"gray.500"}
                              >
                                {item.user_email}
                              </Text>
                            </Box>
                          </Tooltip>
                        </HStack>
                      </Table.Cell>
                    </Authorize>
                    <Table.Cell w="110px">
                      {item.status === "PROCESSING" && (
                        <Badge
                          colorScheme="orange"
                          display="flex"
                          alignItems="center"
                          gap={1}
                        >
                          <Spinner size="sm" />
                          Processing...
                        </Badge>
                      )}
                      {item.status === "COMPLETED" && (
                        <Badge colorPalette="teal">Completed</Badge>
                      )}
                      {item.status === "IGNORED" && (
                        <Tooltip
                          content={
                            item.error_message ??
                            "Error processing the document"
                          }
                        >
                          <Badge colorPalette="red">Failed</Badge>
                        </Tooltip>
                      )}
                      {item.status === "DELETED" && (
                        <Badge variant={"subtle"} colorPalette="red">
                          Deleted
                        </Badge>
                      )}
                      {item.status === "PENDING" && (
                        <Badge variant={"subtle"} colorPalette="gray">
                          Pending
                        </Badge>
                      )}
                    </Table.Cell>
                    <Table.Cell w={"100px"}>
                      <ReportStatus submission={item}>
                        <Flex gap={3} alignItems={"center"}>
                          <Flex gap={1} alignItems={"center"}>
                            <Text as={"span"} w={"5"} textAlign={"right"}>
                              {item.similarity}
                            </Text>
                            <Text textStyle={"xs"}>
                              <AiOutlinePercentage />
                            </Text>
                          </Flex>
                          <DownloadLink
                            submissionId={item.id}
                            submissionType={"report"}
                            variant={"surface"}
                            size={"xs"}
                            px={1}
                            colorPalette={"green"}
                          >
                            <PiFilePdf />
                          </DownloadLink>
                        </Flex>
                      </ReportStatus>
                    </Table.Cell>
                    <Table.Cell w={"160px"}>
                      <ReportStatus submission={item}>
                        <Flex>
                          {/* COMPLETE */}
                          {item.ai_state === "COMPLETE" && (
                            // AI Similarity Badge
                            <Flex gap={3} alignItems={"center"}>
                              <Flex gap={1} alignItems={"center"}>
                                <Text as={"span"} w={"5"} textAlign={"right"}>
                                  {item.ai_similarity === 999
                                    ? "* "
                                    : item.ai_similarity}
                                </Text>
                                <Text textStyle={"xs"}>
                                  <AiOutlinePercentage />
                                </Text>
                              </Flex>
                              {/*Warning icon when no AI report exists*/}
                              {!item.ai_link ? (
                                <Tooltip
                                  content={
                                    item.ai_error_message ??
                                    `*% detected as AI\nAI detection includes the possibility of false positives. Although some text in this submission is likely AI generated, scores below the 20% threshold are not surfaced because they have a higher likelihood of false positives.`
                                  }
                                >
                                  <Badge colorPalette="orange" p={"0.65rem"}>
                                    <IoWarningOutline />
                                  </Badge>
                                </Tooltip>
                              ) : (
                                <Tooltip content="The AI report">
                                  <DownloadLink
                                    submissionId={item.id}
                                    submissionType={"ai"}
                                    variant={"surface"}
                                    size={"xs"}
                                    px={1}
                                    colorPalette={"green"}
                                  >
                                    <PiFilePdf />
                                  </DownloadLink>
                                </Tooltip>
                              )}
                            </Flex>
                          )}
                          {/* IGNORED */}
                          {item.ai_state === "IGNORED" && (
                            <Text
                              color="gray.400"
                              fontStyle="italic"
                              mx={"auto"}
                            >
                              —
                            </Text>
                          )}
                          {/* ERROR */}
                          {item.ai_state !== "COMPLETE" &&
                            item.ai_state !== "IGNORED" && (
                              <Tooltip
                                content={
                                  item.ai_error_message ??
                                  "Something went wrong"
                                }
                              >
                                <Badge
                                  colorPalette="red"
                                  p={"0.65rem"}
                                  ms={"3rem"}
                                >
                                  <IoAlertCircleOutline />
                                </Badge>
                              </Tooltip>
                            )}
                        </Flex>
                      </ReportStatus>
                    </Table.Cell>
                    <Table.Cell w={"100px"}>
                      {item.status !== "DELETED" &&
                        item.status !== "PROCESSING" && (
                          <Button
                            variant={"surface"}
                            colorPalette={"red"}
                            size={"xs"}
                            onClick={() => {
                              onDeleteModalOpen(item);
                            }}
                          >
                            Delete
                            <AiOutlineDelete />
                          </Button>
                        )}
                    </Table.Cell>
                  </Table.Row>
                ))}

              <Table.Row display={loading ? "table-row" : "none"}>
                <Table.Cell colSpan={6} textAlign={"center"} py={"4rem"}>
                  <Text opacity={"0.75"}>Loading ...</Text>
                </Table.Cell>
              </Table.Row>

              <Table.Row
                display={
                  !loading && (!pageable?.data || pageable.data.length === 0)
                    ? "table-row"
                    : "none"
                }
              >
                <Table.Cell colSpan={6} textAlign={"center"} py={"4rem"}>
                  <Text opacity={"0.75"}>Now submissions available</Text>
                </Table.Cell>
              </Table.Row>
            </Table.Body>
          </Table.Root>
        </Box>

        <Flex
          gap={6}
          alignItems={"center"}
          flexDirection={{ base: "column", md: "row" }}
        >
          <Text textStyle={"sm"}>
            Total submissions:{" "}
            <b>{pageable?.pagination?.total?.toLocaleString() ?? "-"}</b>
          </Text>

          <Pagination.Root
            ms={"auto"}
            count={pageable?.pagination?.total ?? 0}
            pageSize={pageable?.pagination?.pageSize ?? 0}
            page={page}
            siblingCount={2}
            onPageChange={(details) => {
              setPage(details.page);
            }}
          >
            <ButtonGroup variant="ghost" size="sm">
              <Pagination.PrevTrigger asChild>
                <IconButton>
                  <LuChevronLeft />
                </IconButton>
              </Pagination.PrevTrigger>

              <Pagination.Items
                render={(page) => (
                  <IconButton variant={{ base: "ghost", _selected: "outline" }}>
                    {page.value}
                  </IconButton>
                )}
              />

              <Pagination.NextTrigger asChild>
                <IconButton>
                  <LuChevronRight />
                </IconButton>
              </Pagination.NextTrigger>
            </ButtonGroup>
          </Pagination.Root>
        </Flex>

        <Dialog.Root
          motionPreset="slide-in-bottom"
          open={modelOpen}
          onOpenChange={(d) => setModelOpen(d.open)}
        >
          <Portal>
            <Dialog.Backdrop />
            <Dialog.Positioner>
              <Dialog.Content>
                <Dialog.Header>
                  <Dialog.Title>
                    Confirm deletion of this submission?
                  </Dialog.Title>
                </Dialog.Header>
                <Dialog.Body>
                  <p>
                    Deleting the file{" "}
                    <Badge>{selectedSubmission?.original_filename ?? ""}</Badge>{" "}
                    is an irreversible action and will permanently remove it
                    from our database.
                  </p>
                </Dialog.Body>
                <Dialog.Footer>
                  <Dialog.ActionTrigger asChild>
                    <Button disabled={deleteLoading} variant="outline">
                      Cancel
                    </Button>
                  </Dialog.ActionTrigger>
                  <Button
                    loading={deleteLoading}
                    variant={"surface"}
                    colorPalette={"red"}
                    onClick={() => {
                      deleteHandler(selectedSubmission?.id ?? null);
                    }}
                  >
                    Yes, confirm
                  </Button>
                </Dialog.Footer>
                <Dialog.CloseTrigger asChild>
                  <CloseButton size="sm" />
                </Dialog.CloseTrigger>
              </Dialog.Content>
            </Dialog.Positioner>
          </Portal>
        </Dialog.Root>

        <AddSubmissionModal
          open={modelAddOpen}
          setOpen={setModelAddOpen}
          callback={() => {
            refetch();
          }}
        />
      </Flex>
    </DashboardContainer>
  );
}

const ReportStatus = ({
  submission,
  children,
}: {
  submission: SubmissionDto;
  children?: ReactNode;
}) => {
  return (
    <>
      {submission.status === "PROCESSING" ? (
        <Badge colorPalette="gray" ms={"1rem"}>
          <Spinner size="sm" />
          <AiOutlinePercentage />
        </Badge>
      ) : submission.report_link ? (
        <>{children}</>
      ) : (
        <span className="text-gray-400 text-sm italic">—</span>
      )}
    </>
  );
};

interface DownloadLinkProps extends ButtonProps {
  submissionId: number;
  submissionType: "file" | "report" | "ai";
}

const DownloadLink = ({
  submissionId,
  submissionType,
  ...rest
}: DownloadLinkProps) => {
  const [loading, setLoading] = useState(false);

  const handleDownload = async () => {
    setLoading(true);
    axios
      .get(
        `/api/submissions/download?submissionId=${submissionId}&submissionType=${submissionType}`,
        {
          responseType: "blob",
        },
      )
      .then((res) => {
        const url = URL.createObjectURL(res.data);
        const a = document.createElement("a");
        a.href = url;
        a.download = `${submissionType}-${submissionId}.pdf`; // or whatever filename
        a.click();
        URL.revokeObjectURL(url);
      })
      .catch(() => {
        toaster.error({
          title: "",
          description: `Error downloading ${submissionType === "file" ? "document" : "report"}`,
        });
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <Button
      loading={loading}
      {...rest}
      onClick={() => {
        handleDownload().then();
      }}
    >
      {rest.children}
    </Button>
  );
};
