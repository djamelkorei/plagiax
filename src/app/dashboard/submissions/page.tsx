'use client';

import {
  Alert,
  Avatar,
  Badge,
  Box,
  Button,
  ButtonGroup,
  CloseButton,
  Dialog,
  Field,
  Fieldset,
  FileUpload,
  Flex,
  For,
  HStack,
  Icon,
  IconButton,
  Input,
  InputGroup,
  Pagination,
  Portal,
  RadioGroup,
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
import {AiOutlineDelete, AiOutlineFile, AiOutlinePercentage} from "react-icons/ai";
import {PiFilePdf} from "react-icons/pi";
import {IoAddOutline, IoCloudUploadOutline} from "react-icons/io5";
import {MdArrowRightAlt} from "react-icons/md";
import {TbSquarePercentage} from "react-icons/tb";

interface SubmissionDTO {
  id: number,
  fileName: string,
  fileUrl: string,
  studentName: string,
  studentEmail: string,
  postedDate: string,
  status: 'active' | string,
  similarityPercentage: number,
  similarityFileUrl: string,
  aiSimilarityPercentage: number,
  aiSimilarityFileUrl: string,
}

const dateToFullDateTimeString = (date: string | Date): string => {
  return moment(date).utcOffset(0)
    .format('MMM DD, YYYY, HH:mm');
}

const formSubmissionExclusion = [
  {
    field: 'exclusion_bibliographic',
    label: 'Exclude bibliographic materials'
  },
  {
    field: 'exclusion_quoted',
    label: 'Exclude quoted materials'
  },
  {
    field: 'exclusion_small_sources',
    label: 'Exclude small sources (Small match exclusion type)'
  },
]

const formSubmissionExclusionThresholdType = [
  {label: "Words", field: "exclusion_type", value: 'words'},
  {label: "Percentage", field: "exclusion_type", value: 'percentage'},
]

export default function DashboardSubmissions() {

  const loading = false;
  const [, setTextFilter] = useState<string>('');
  const [selectedSubmission, setSelectedSubmission] = useState<SubmissionDTO | null>(null);

  const [modelOpen, setModelOpen] = useState(false);
  const [modelAddOpen, setModelAddOpen] = useState(false);

  const submissionList: SubmissionDTO[] = [
    {
      id: 1,
      fileName: 'file1.pdf',
      fileUrl: 'https://example.com/file1',
      studentName: 'John Doe',
      studentEmail: 'john.doe@example.com',
      postedDate: '2025-11-01 14:32',
      status: 'active',
      similarityPercentage: 85,
      similarityFileUrl: 'https://example.com/similarity1',
      aiSimilarityPercentage: 80,
      aiSimilarityFileUrl: 'https://example.com/ai-similarity1',
    },
    {
      id: 2,
      fileName: 'file2.pdf',
      fileUrl: 'https://example.com/file2',
      studentName: 'Jane Smith',
      studentEmail: 'jane.smith@example.com',
      postedDate: '2025-11-02 13:32',
      status: 'inactive',
      similarityPercentage: 95,
      similarityFileUrl: 'https://example.com/similarity2',
      aiSimilarityPercentage: 85,
      aiSimilarityFileUrl: 'https://example.com/ai-similarity2',
    },
    {
      id: 3,
      fileName: 'file3.pdf',
      fileUrl: 'https://example.com/file3',
      studentName: 'Alice Brown',
      studentEmail: 'alice.brown@example.com',
      postedDate: '2025-11-03',
      status: 'active',
      similarityPercentage: 75,
      similarityFileUrl: 'https://example.com/similarity3',
      aiSimilarityPercentage: 70,
      aiSimilarityFileUrl: 'https://example.com/ai-similarity3',
    },
  ];

  const deleteHandler = (item: SubmissionDTO) => {
    setSelectedSubmission(item);
    setSelectedSubmission(prev => {
      setModelOpen(true);
      return prev;
    })
  }

  useEffect(() => {
    if (!modelOpen) {
      setSelectedSubmission(null);
    }
  }, [modelOpen]);

  return (
    <DashboardContainer
      title={'Submissions'}
      breadcrumbs={['dashboard', 'submissions']}
    >

      <Flex flexDirection={'column'} gap={6}>

        <Flex gap={6} alignItems={'center'} flexDirection={{base: 'column', md: 'row'}}>
          <Button w={'fit-content'} onClick={() => {
            setModelAddOpen(true);
          }}>
            New Submission
            <IoAddOutline/>
          </Button>

          <SearchFilter
            loading={loading}
            callback={(text) => {
              setTextFilter(text ?? '')
            }}
            placeholder={'Search by title, student name | email'}
            marginStart={'auto'}
            w={{base: 'full', md: '350px'}}/>

        </Flex>

        <Box minHeight={'400px'} bg={'#fcfcfc'} border={'1px solid'} borderColor={'border'} borderRadius={'sm'}
             overflow={'hidden'}>
          <Table.Root variant="outline" size={'sm'}>
            <Table.Header>
              <Table.Row>
                <Table.ColumnHeader w={'180px'}>Document</Table.ColumnHeader>
                <Table.ColumnHeader w={'180px'}>Student</Table.ColumnHeader>
                <Table.ColumnHeader w={'180px'}>Status</Table.ColumnHeader>
                <Table.ColumnHeader w={'100px'}>
                  <Flex gap={1} alignItems={'center'}>
                    Similarity <AiOutlinePercentage/>
                  </Flex>
                </Table.ColumnHeader>
                <Table.ColumnHeader w={'100px'}>
                  <Flex gap={1} alignItems={'center'}>
                    AI Similarity<AiOutlinePercentage/>
                  </Flex>
                </Table.ColumnHeader>
                <Table.ColumnHeader w={'100px'}></Table.ColumnHeader>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {!loading && submissionList && submissionList.map((item, index) => (
                <Table.Row
                  key={item.id}
                  cursor={'pointer'}
                  bg={'white'}
                  borderBottomWidth={submissionList.length - 1 === index ? 0 : 1}
                >
                  <Table.Cell w={'180px'}>
                    <HStack gap={4}>
                      <Button size={'xs'} variant={'surface'} colorPalette={'blue'}>
                        <AiOutlineFile/>
                      </Button>
                      <Box>
                        <Text>{item.fileName}</Text>
                        <Text textStyle={'xs'} color={'gray.500'}>{dateToFullDateTimeString(item.postedDate)}</Text>
                      </Box>
                    </HStack>
                  </Table.Cell>
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
                    <Badge colorPalette={'teal'}>Completed</Badge>
                  </Table.Cell>
                  <Table.Cell w={'100px'}>
                    <Flex gap={3} alignItems={'center'}>
                      <Flex gap={1} alignItems={'center'}>
                        {item.similarityPercentage}
                        <Text textStyle={'xs'}><AiOutlinePercentage/></Text>
                      </Flex>

                      <Button variant={'surface'} size={'xs'} px={1} colorPalette={'green'}>
                        <PiFilePdf/>
                      </Button>
                    </Flex>
                  </Table.Cell>
                  <Table.Cell w={'100px'}>
                    <Flex gap={3} alignItems={'center'}>
                      <Flex gap={1} alignItems={'center'}>
                        {item.aiSimilarityPercentage}
                        <Text textStyle={'xs'}><AiOutlinePercentage/></Text>
                      </Flex>
                      <Button variant={'surface'} size={'xs'} px={1} colorPalette={'green'}>
                        <PiFilePdf/>
                      </Button>
                    </Flex>
                  </Table.Cell>
                  <Table.Cell w={'100px'}>
                    <Button variant={'surface'} colorPalette={'red'} size={'xs'} onClick={() => {
                      deleteHandler(item);
                    }}>
                      Delete
                      <AiOutlineDelete/>
                    </Button>
                  </Table.Cell>
                </Table.Row>
              ))}

              <Table.Row display={loading ? 'table-row' : 'none'}>
                <Table.Cell colSpan={6} textAlign={'center'} py={'4rem'}>
                  <Text opacity={'0.75'}>Loading ...</Text>
                </Table.Cell>
              </Table.Row>

              <Table.Row display={!loading && (!submissionList || submissionList.length === 0) ? 'table-row' : 'none'}>
                <Table.Cell colSpan={6} textAlign={'center'} py={'4rem'}>
                  <Text opacity={'0.75'}>Now monitors available</Text>
                </Table.Cell>
              </Table.Row>

            </Table.Body>
          </Table.Root>
        </Box>

        <Flex gap={6} alignItems={'center'} flexDirection={{base: 'column', md: 'row'}}>
          <Text textStyle={'sm'}>Total submissions: <b>{(2321).toLocaleString()}</b></Text>

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
                  <Dialog.Title>Confirm deletion of this submission?</Dialog.Title>
                </Dialog.Header>
                <Dialog.Body>
                  <p>
                    Deleting the file <Badge>{selectedSubmission?.fileName ?? ''}</Badge> is an irreversible action and
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
                     size={'xl'}
                     open={modelAddOpen}
                     onOpenChange={(d) => setModelAddOpen(d.open)}>
          <Portal>
            <Dialog.Backdrop/>
            <Dialog.Positioner>
              <Dialog.Content>
                <Dialog.Header>
                  <Dialog.Title>Add new submission</Dialog.Title>
                </Dialog.Header>
                <Dialog.Body position={'relative'} display={'flex'} flexDirection={'column'} gap={4}>
                  <Fieldset.Root>
                    <Stack>
                      <Fieldset.HelperText>
                        Please fill out the following fields to submit your document for plagiarism checking. Each field
                        is important to ensure your document is processed accurately.
                      </Fieldset.HelperText>
                    </Stack>

                    <Fieldset.Content display={'flex'} flexDirection={{base: 'column', md: 'row'}} gap={6}>

                      <Flex flexDirection={'column'} gap={4} flex={'1'} position={'relative'}>

                        <Field.Root invalid={false} flex={1}>
                          <Field.Label>Title</Field.Label>
                          <Input name="title" type="text" placeholder={'Enter the document title'}/>
                          <Field.ErrorText>This is an error text</Field.ErrorText>
                        </Field.Root>

                        <Box mb={3}>
                          <Text fontWeight={'semibold'} mb={4}>Options ( exclusion )</Text>
                          <Stack gap={4} align="flex-start">
                            <For each={formSubmissionExclusion}>
                              {(item) => (
                                <Switch.Root key={item.field} size={'sm'} variant={'solid'} cursor={'pointer'}>
                                  <Switch.HiddenInput name={item.field}/>
                                  <Switch.Control/>
                                  <Switch.Label>{item.label}</Switch.Label>
                                </Switch.Root>
                              )}
                            </For>
                          </Stack>
                        </Box>

                        <Flex gap={4} flex={1}
                              flexDirection={'column'}
                              border={'1px solid'} borderColor={'border'} p={3}
                              borderRadius={4}>
                          <Flex justifyContent={'space-between'}>
                            <Text fontWeight={'semibold'}>
                              Exclusion Threshold
                            </Text>
                            <RadioGroup.Root defaultValue="1" size={'sm'} variant={'outline'}>
                              <HStack gap={3}>
                                {formSubmissionExclusionThresholdType.map((item) => (
                                  <RadioGroup.Item key={item.label} value={item.value} cursor={'pointer'}>
                                    <RadioGroup.ItemHiddenInput name={item.field}/>
                                    <RadioGroup.ItemIndicator/>
                                    <RadioGroup.ItemText>{item.label}</RadioGroup.ItemText>
                                  </RadioGroup.Item>
                                ))}
                              </HStack>
                            </RadioGroup.Root>
                          </Flex>

                          <Field.Root>
                            <Field.Label display={'none'}>Email</Field.Label>
                            <InputGroup flex={1} startElement={<TbSquarePercentage/>}>
                              <Input name={'exclusion_value'} size={'xs'} placeholder="Set threshold..."/>
                            </InputGroup>
                          </Field.Root>

                        </Flex>
                      </Flex>

                      <FileUpload.Root
                        w={{base: 'full', md: '350px'}}
                        alignItems="stretch"
                        maxFiles={1}
                        accept={'.docx,.xlsx,.pptx,.ps,.pdf,.html, .rtf, .odt, .hwp, .txt'}
                        cursor={'pointer'}
                        gap={2}
                      >
                        <FileUpload.Label>Document</FileUpload.Label>
                        <FileUpload.HiddenInput/>
                        <FileUpload.Dropzone minHeight={'auto'}
                                             height={'-webkit-fill-available'}
                                             gap={2}
                                             p={5}
                                             bg={'gray.50'}
                                             _hover={{bg: 'orange.50'}}>
                          <Icon size="xl" color="fg.muted">
                            <IoCloudUploadOutline/>
                          </Icon>
                          <FileUpload.DropzoneContent>
                            <Box fontSize={'sm'} mb={4}>Drag and drop file here</Box>
                            <Flex fontSize={'xs'} flexDirection={'column'} color="fg.muted">
                              <Text as={'span'}>Uploaded file must be less than <b>100 MB</b></Text>
                              <Text as={'span'}>Uploaded file must has less than <b>800 pages</b></Text>
                              <Text as={'span'}>Files must contain <b>over 20 words</b> for a similarity report</Text>
                              <Text as={'span'}>Supported file types for generating repots:</Text>
                              <Text as={'span'} fontWeight={'bold'}>.docx, .xlsx, .pptx, .ps, .pdf, .html, .rtf, .odt,
                                .hwp, .txt</Text>
                            </Flex>
                          </FileUpload.DropzoneContent>
                        </FileUpload.Dropzone>
                        <FileUpload.List clearable/>
                      </FileUpload.Root>
                    </Fieldset.Content>

                  </Fieldset.Root>

                  <Alert.Root size={'sm'} variant={'surface'} status={'warning'}>
                    <Alert.Indicator />
                    <Alert.Content>
                      <Alert.Title />
                      <Alert.Description>
                        The AI feature is available exclusively for English documents.
                      </Alert.Description>
                    </Alert.Content>
                  </Alert.Root>

                  <Alert.Root size={'sm'} variant={'surface'} status="info" colorPalette="gray">
                    <Alert.Indicator />
                    <Alert.Content>
                      <Alert.Description>
                        The file you are submitting will not be added to any repository.
                      </Alert.Description>
                    </Alert.Content>
                  </Alert.Root>


                </Dialog.Body>
                <Dialog.Footer>
                  <Dialog.ActionTrigger asChild>
                    <Button variant="outline">Cancel</Button>
                  </Dialog.ActionTrigger>
                  <Button>Submit <MdArrowRightAlt/></Button>
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



