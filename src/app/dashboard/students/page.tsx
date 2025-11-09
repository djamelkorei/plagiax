'use client';

import {
  Avatar,
  Badge,
  Box,
  Button,
  ButtonGroup,
  CloseButton,
  Dialog,
  Field,
  Fieldset,
  Flex,
  HStack,
  IconButton,
  Input,
  InputGroup,
  Pagination,
  Portal,
  Stack,
  Switch,
  Table,
  Text
} from "@chakra-ui/react";
import {DashboardContainer} from "@/components/dashboard-container";
import {LuChevronLeft, LuChevronRight} from "react-icons/lu";
import {useEffect, useState} from "react";
import {SearchFilter} from "@/components/search-filter";
import moment from "moment";
import {AiOutlineDelete} from "react-icons/ai";
import {IoAddOutline} from "react-icons/io5";
import {MdArrowRightAlt} from "react-icons/md";
import {IoMdRefresh} from "react-icons/io";
import {HiOutlinePencil} from "react-icons/hi";

interface UserDTO {
  id: number,
  studentName: string,
  studentEmail: string,
  createdDate: string,
  status: 'active' | string,
}

const dateToFullDateTimeString = (date: string | Date): string => {
  return moment(date).utcOffset(0)
    .format('MMM DD, YYYY, HH:mm');
}

export default function DashboardSubmissions() {

  const loading = false;
  const [, setTextFilter] = useState<string>('');
  const [selectedUser, setSelectedUser] = useState<UserDTO | null>(null);

  const [modelOpen, setModelOpen] = useState(false);
  const [modelAddOpen, setModelAddOpen] = useState(false);

  const studentList: UserDTO[] = [
    {
      id: 1,
      studentName: 'John Doe',
      studentEmail: 'john.doe@example.com',
      createdDate: '2025-11-01 14:32',
      status: 'active',
    },
    {
      id: 2,
      studentName: 'Jane Smith',
      studentEmail: 'jane.smith@example.com',
      createdDate: '2025-11-02 13:32',
      status: 'suspended',
    },
    {
      id: 3,
      studentName: 'Alice Brown',
      studentEmail: 'alice.brown@example.com',
      createdDate: '2025-11-03 07:32',
      status: 'active',
    },
  ];

  const deleteHandler = (item: UserDTO) => {
    setSelectedUser(item);
    setSelectedUser(prev => {
      setModelOpen(true);
      return prev;
    })
  }

  const editHandler = (item: UserDTO) => {
    setSelectedUser(item);
    setSelectedUser(prev => {
      setModelAddOpen(true);
      return prev;
    })
  }

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
      title={'Students'}
      breadcrumbs={['dashboard', 'students']}
    >

      <Flex flexDirection={'column'} gap={6}>

        <Flex gap={6} alignItems={'center'} flexDirection={{base: 'column', md: 'row'}}>
          <Button w={'fit-content'} onClick={() => {
            setModelAddOpen(true);
          }}>
            New Student
            <IoAddOutline/>
          </Button>

          <SearchFilter
            loading={loading}
            callback={(text) => {
              setTextFilter(text ?? '')
            }}
            placeholder={'Search by student name, email'}
            marginStart={'auto'}
            w={{base: 'full', md: '350px'}}/>

        </Flex>

        <Box minHeight={'400px'} bg={'#fcfcfc'} border={'1px solid'} borderColor={'border'} borderRadius={'sm'}
             overflow={'hidden'}>
          <Table.Root variant="outline" size={'sm'}>
            <Table.Header>
              <Table.Row>
                <Table.ColumnHeader>Student</Table.ColumnHeader>
                <Table.ColumnHeader w={'180px'}>Created date</Table.ColumnHeader>
                <Table.ColumnHeader w={'180px'}>Status</Table.ColumnHeader>
                <Table.ColumnHeader w={'100px'}></Table.ColumnHeader>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {!loading && studentList && studentList.map((item, index) => (
                <Table.Row
                  key={item.id}
                  cursor={'pointer'}
                  bg={'white'}
                  borderBottomWidth={studentList.length - 1 === index ? 0 : 1}
                >
                  <Table.Cell>
                    <HStack alignItems={'center'} gap={2}>
                      <Avatar.Root size={'xs'}>
                        <Avatar.Fallback name={item.studentName}/>
                      </Avatar.Root>
                      <Box>
                        <Text>{item.studentName}</Text>
                        <Text textStyle={'xs'} color={'gray.500'}>{item.studentEmail}</Text>
                      </Box>
                    </HStack>
                  </Table.Cell>
                  <Table.Cell w={'180px'}>
                    {dateToFullDateTimeString(item.createdDate)}
                  </Table.Cell>
                  <Table.Cell w={'180px'}>
                    <Badge colorPalette={item.status === 'active' ? 'teal' : 'orange'}>
                      {item.status}
                    </Badge>
                  </Table.Cell>
                  <Table.Cell w={'100px'}>
                    <HStack gap={2}>
                      <Button variant={'surface'} size={'xs'} onClick={() => {
                        editHandler(item);
                      }}>
                        Edit
                        <HiOutlinePencil/>
                      </Button>
                      <Button variant={'surface'} colorPalette={'red'} size={'xs'} onClick={() => {
                        deleteHandler(item);
                      }}>
                        Delete
                        <AiOutlineDelete/>
                      </Button>
                    </HStack>
                  </Table.Cell>
                </Table.Row>
              ))}

              <Table.Row display={loading ? 'table-row' : 'none'}>
                <Table.Cell colSpan={6} textAlign={'center'} py={'4rem'}>
                  <Text opacity={'0.75'}>Loading ...</Text>
                </Table.Cell>
              </Table.Row>

              <Table.Row display={!loading && (!studentList || studentList.length === 0) ? 'table-row' : 'none'}>
                <Table.Cell colSpan={6} textAlign={'center'} py={'4rem'}>
                  <Text opacity={'0.75'}>Now students available</Text>
                </Table.Cell>
              </Table.Row>

            </Table.Body>
          </Table.Root>
        </Box>

        <Flex gap={6} alignItems={'center'} flexDirection={{base: 'column', md: 'row'}}>
          <Text textStyle={'sm'}>Total students: <b>{(2321).toLocaleString()}</b></Text>

          <Pagination.Root
            ms={'auto'}
            count={200}
            pageSize={10}
            defaultPage={10}
            siblingCount={2}
          >
            <ButtonGroup variant="ghost" size="sm">
              <Pagination.PrevTrigger asChild>
                <IconButton>
                  <LuChevronLeft/>
                </IconButton>
              </Pagination.PrevTrigger>

              <Pagination.Items
                render={(page) => (
                  <IconButton variant={{base: "ghost", _selected: "outline"}}>
                    {page.value}
                  </IconButton>
                )}
              />

              <Pagination.NextTrigger asChild>
                <IconButton>
                  <LuChevronRight/>
                </IconButton>
              </Pagination.NextTrigger>
            </ButtonGroup>
          </Pagination.Root>
        </Flex>

        <Dialog.Root motionPreset="slide-in-bottom"
                     open={modelOpen}
                     onOpenChange={(d) => setModelOpen(d.open)}>
          <Portal>
            <Dialog.Backdrop/>
            <Dialog.Positioner>
              <Dialog.Content>
                <Dialog.Header>
                  <Dialog.Title>Confirm deletion of this student?</Dialog.Title>
                </Dialog.Header>
                <Dialog.Body>
                  <p>
                    Deleting the file <Badge>{selectedUser?.studentName ?? ''}</Badge> is an irreversible action and
                    will
                    permanently remove it from our database.
                  </p>
                </Dialog.Body>
                <Dialog.Footer>
                  <Dialog.ActionTrigger asChild>
                    <Button variant="outline">Cancel</Button>
                  </Dialog.ActionTrigger>
                  <Button variant={'surface'} colorPalette={'red'}>Yes, confirm</Button>
                </Dialog.Footer>
                <Dialog.CloseTrigger asChild>
                  <CloseButton size="sm"/>
                </Dialog.CloseTrigger>
              </Dialog.Content>
            </Dialog.Positioner>
          </Portal>
        </Dialog.Root>


        <Dialog.Root motionPreset="slide-in-bottom"
                     size={'lg'}
                     open={modelAddOpen}
                     onOpenChange={(d) => setModelAddOpen(d.open)}>
          <Portal>
            <Dialog.Backdrop/>
            <Dialog.Positioner>
              <Dialog.Content>
                <Dialog.Header>
                  <Dialog.Title>{selectedUser ? 'Edit' : 'Add new '} student</Dialog.Title>
                </Dialog.Header>
                <Dialog.Body position={'relative'} display={'flex'} flexDirection={'column'} gap={4}>
                  <Fieldset.Root>
                    <Stack>
                      <Fieldset.HelperText>
                        Please fill out the following fields to add a new student. All fields are required to ensure the
                        student is added to the system correctly.
                      </Fieldset.HelperText>
                    </Stack>

                    <Fieldset.Content>

                      <Field.Root invalid={false} flex={1}>
                        <Field.Label>Name</Field.Label>
                        <Input name="name" type="text" placeholder={'Enter the student name'}/>
                        <Field.ErrorText>This is an error text</Field.ErrorText>
                      </Field.Root>

                      <Field.Root invalid={false} flex={1}>
                        <Field.Label>Email</Field.Label>
                        <Input name="email" type="email" placeholder={'Enter the student email'}/>
                        <Field.ErrorText>This is an error text</Field.ErrorText>
                      </Field.Root>

                      {!selectedUser && (
                        <Field.Root invalid={false} flex={1}>
                          <Field.Label>Password</Field.Label>
                          <InputGroup flex="1"
                                      endElement={<Button size={'2xs'}>Generate <IoMdRefresh/></Button>}>
                            <Input name="password" type="text" placeholder={'Enter the student password'}/>
                          </InputGroup>
                          <Field.ErrorText>This is an error text</Field.ErrorText>
                        </Field.Root>
                      )}

                      {selectedUser && (
                        <Switch.Root size={'sm'} cursor={'pointer'}>
                          <Switch.HiddenInput/>
                          <Switch.Control/>
                          <Switch.Label>is student active ?</Switch.Label>
                        </Switch.Root>
                      )}

                    </Fieldset.Content>

                  </Fieldset.Root>

                </Dialog.Body>
                <Dialog.Footer>
                  <Dialog.ActionTrigger asChild>
                    <Button variant="outline">Cancel</Button>
                  </Dialog.ActionTrigger>
                  <Button>{!selectedUser ? 'Submit' : 'Update'} <MdArrowRightAlt/></Button>
                </Dialog.Footer>
                <Dialog.CloseTrigger asChild>
                  <CloseButton size="sm"/>
                </Dialog.CloseTrigger>
              </Dialog.Content>
            </Dialog.Positioner>
          </Portal>
        </Dialog.Root>

      </Flex>
    </DashboardContainer>
  )

}



