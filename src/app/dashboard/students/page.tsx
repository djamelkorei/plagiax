"use client";

import {
  Avatar,
  Badge,
  Box,
  Button,
  ButtonGroup,
  CloseButton,
  Dialog,
  Flex,
  HStack,
  IconButton,
  Pagination,
  Portal,
  Table,
  Text,
} from "@chakra-ui/react";
import moment from "moment";
import { useEffect, useState } from "react";
import { AiOutlineDelete } from "react-icons/ai";
import { HiOutlinePencil } from "react-icons/hi";
import { IoAddOutline } from "react-icons/io5";
import { LuChevronLeft, LuChevronRight } from "react-icons/lu";
import { userDeleteAction } from "@/app/actions/user-delete.action";
import { DashboardContainer } from "@/components/dashboard-container";
import { AddUserModal } from "@/components/modals/add-user.modal";
import { SearchFilter } from "@/components/search-filter";
import type { Pageable } from "@/dto/pageable.dto";
import type { UserDTO } from "@/dto/user.dto";
import { FormHelper } from "@/helpers/form.helper";
import { useFetch } from "@/hooks/use-fetch";

const dateToFullDateTimeString = (date: string | Date): string => {
  return moment(date).utcOffset(0).format("MMM DD, YYYY, HH:mm");
};

export default function DashboardSubmissions() {
  const [textFilter, setTextFilter] = useState<string>("");
  const [selectedUser, setSelectedUser] = useState<UserDTO | null>(null);

  const [modelOpen, setModelOpen] = useState(false);
  const [modelAddOpen, setModelAddOpen] = useState(false);

  const [deleteLoading, setDeleteLoading] = useState<boolean>(false);
  const [page, setPage] = useState<number>(1);
  const {
    data: pageable,
    loading,
    refetch,
  } = useFetch<Pageable<UserDTO>>("/api/users", { page, q: textFilter });

  const onDeleteModalOpen = (item: UserDTO) => {
    setSelectedUser(item);
    setSelectedUser((prev) => {
      setModelOpen(true);
      return prev;
    });
  };

  const deleteHandler = (id: number | null) => {
    if (id) {
      setDeleteLoading(true);
      userDeleteAction(FormHelper.toFormData({ userId: id }))
        .then((res) => {
          if (res) {
            refetch();
          }
        })
        .finally(() => {
          setTimeout(() => {
            setDeleteLoading(false);
            setModelOpen(false);
            setSelectedUser(null);
          }, 300);
        });
    }
  };

  const editHandler = (item: UserDTO) => {
    setSelectedUser(item);
    setSelectedUser((prev) => {
      setModelAddOpen(true);
      return prev;
    });
  };

  useEffect(() => {
    if (!modelOpen) {
      setSelectedUser(null);
    }
  }, [modelOpen]);

  useEffect(() => {
    if (!modelAddOpen) {
      setSelectedUser(null);
    }
  }, [modelAddOpen]);

  return (
    <DashboardContainer
      title={"Students"}
      breadcrumbs={["dashboard", "students"]}
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
            New Student
            <IoAddOutline />
          </Button>

          <SearchFilter
            loading={loading}
            callback={(text) => {
              setTextFilter(text ?? "");
            }}
            placeholder={"Search by student name, email"}
            marginStart={"auto"}
            w={{ base: "full", md: "350px" }}
          />
        </Flex>

        <Box
          minHeight={"400px"}
          bg={"#fcfcfc"}
          border={"1px solid"}
          borderColor={"border"}
          borderRadius={"sm"}
          overflow={"hidden"}
        >
          <Table.Root variant="outline" size={"sm"}>
            <Table.Header>
              <Table.Row>
                <Table.ColumnHeader>Student</Table.ColumnHeader>
                <Table.ColumnHeader w={"180px"}>
                  Created date
                </Table.ColumnHeader>
                <Table.ColumnHeader w={"180px"}>Status</Table.ColumnHeader>
                <Table.ColumnHeader w={"100px"}></Table.ColumnHeader>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {!loading &&
                pageable &&
                pageable.data &&
                pageable.data.map((item, index) => (
                  <Table.Row
                    key={item.id}
                    cursor={"pointer"}
                    bg={"white"}
                    borderBottomWidth={
                      pageable.data.length - 1 === index ? 0 : 1
                    }
                  >
                    <Table.Cell>
                      <HStack alignItems={"center"} gap={2}>
                        <Avatar.Root size={"xs"}>
                          <Avatar.Fallback name={item.name} />
                        </Avatar.Root>
                        <Box>
                          <Text>{item.name}</Text>
                          <Text textStyle={"xs"} color={"gray.500"}>
                            {item.email}
                          </Text>
                        </Box>
                      </HStack>
                    </Table.Cell>
                    <Table.Cell w={"180px"}>
                      {dateToFullDateTimeString(item.created_at)}
                    </Table.Cell>
                    <Table.Cell w={"180px"}>
                      <Badge colorPalette={item.active ? "teal" : "orange"}>
                        {item.active ? "Active" : "Inactive"}
                      </Badge>
                    </Table.Cell>
                    <Table.Cell w={"100px"}>
                      <HStack gap={2}>
                        <Button
                          variant={"surface"}
                          size={"xs"}
                          onClick={() => {
                            editHandler(item);
                          }}
                        >
                          Edit
                          <HiOutlinePencil />
                        </Button>
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
                      </HStack>
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
                  <Text opacity={"0.75"}>Now students available</Text>
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
            Total students:{" "}
            <b>{pageable?.pagination?.total.toLocaleString()}</b>
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
                  <Dialog.Title>Confirm deletion of this student?</Dialog.Title>
                </Dialog.Header>
                <Dialog.Body>
                  <p>
                    Deleting the file <Badge>{selectedUser?.name ?? ""}</Badge>{" "}
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
                    onClick={() => {
                      deleteHandler(selectedUser?.id ?? null);
                    }}
                    variant={"surface"}
                    colorPalette={"red"}
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

        <AddUserModal
          selectedUser={selectedUser}
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
