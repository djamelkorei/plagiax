import {
  Alert,
  Box,
  Button,
  CloseButton,
  Dialog,
  Field,
  Fieldset,
  FileUpload,
  Flex,
  For,
  HStack,
  Icon,
  Input,
  InputGroup,
  NumberInput,
  Portal,
  RadioGroup,
  Stack,
  Switch,
  Text,
} from "@chakra-ui/react";
import { zodResolver } from "@hookform/resolvers/zod";
import type { Dispatch, SetStateAction } from "react";
import {
  FormProvider,
  useForm,
  useFormContext,
  useWatch,
} from "react-hook-form";
import { IoCloudUploadOutline } from "react-icons/io5";
import { MdArrowRightAlt } from "react-icons/md";
import { TbSquarePercentage } from "react-icons/tb";
import { submissionAddAction } from "@/app/actions/submission-add.action";
import {
  type AddSubmissionFormRequest,
  AddSubmissionFormSchema,
} from "@/lib/form.service";

interface AddSubmissionModalProps {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  callback: () => void;
}

const formSubmissionExclusion: {
  field:
    | "exclusion_bibliographic"
    | "exclusion_quoted"
    | "exclusion_small_sources";
  label: string;
}[] = [
  {
    field: "exclusion_bibliographic",
    label: "Exclude bibliographic materials",
  },
  {
    field: "exclusion_quoted",
    label: "Exclude quoted materials",
  },
  {
    field: "exclusion_small_sources",
    label: "Exclude small sources (Small match exclusion type)",
  },
];

const formSubmissionExclusionThresholdType = [
  { label: "Words", field: "exclusion_type", value: "words" },
  { label: "Percentage", field: "exclusion_type", value: "percentage" },
];

export const AddSubmissionModal = ({
  open,
  setOpen,
  callback,
}: AddSubmissionModalProps) => {
  const formMethods = useForm<AddSubmissionFormRequest>({
    resolver: zodResolver(AddSubmissionFormSchema),
    defaultValues: {
      title: "",
      exclusion_bibliographic: false,
      exclusion_quoted: false,
      exclusion_small_sources: false,
      exclusion_type: "none",
      exclusion_value: 0,
    },
  });

  const isExclusionSmallSources = useWatch({
    control: formMethods.control,
    name: "exclusion_small_sources",
  });
  const exclusionType = useWatch({
    control: formMethods.control,
    name: "exclusion_type",
  });
  const exclusionValue = useWatch({
    control: formMethods.control,
    name: "exclusion_value",
  });

  const onSubmit = (data: AddSubmissionFormRequest) => {
    const formData = new FormData();
    formData.append("file", data.file);
    formData.append("title", data.title ?? "");
    formData.append("exclusion_value", String(data.exclusion_value));
    formData.append("exclusion_type", data.exclusion_type);
    formData.append(
      "exclusion_small_sources",
      String(data.exclusion_small_sources),
    );
    formData.append(
      "exclusion_bibliographic",
      String(data.exclusion_bibliographic),
    );
    formData.append("exclusion_quoted", String(data.exclusion_quoted));
    submissionAddAction(formData).then((res) => {
      if (res.hasError) {
        formMethods.setError("file", {
          type: "server",
          message: res.message,
        });
      } else {
        setOpen(false);
        callback();
      }
    });
  };

  return (
    <Dialog.Root
      motionPreset="slide-in-bottom"
      size={"xl"}
      open={open}
      onOpenChange={(d) => setOpen(d.open)}
    >
      <Portal>
        <Dialog.Backdrop />
        <Dialog.Positioner>
          <Dialog.Content>
            <Dialog.Header>
              <Dialog.Title>Add new submission</Dialog.Title>
            </Dialog.Header>

            <FormProvider {...formMethods}>
              <form onSubmit={formMethods.handleSubmit(onSubmit)}>
                <Dialog.Body
                  position={"relative"}
                  display={"flex"}
                  flexDirection={"column"}
                  gap={4}
                >
                  <Fieldset.Root>
                    <Stack>
                      <Fieldset.HelperText>
                        Please fill out the following fields to submit your
                        document for plagiarism checking. Each field is
                        important to ensure your document is processed
                        accurately.
                      </Fieldset.HelperText>
                    </Stack>

                    <Fieldset.Content
                      display={"flex"}
                      flexDirection={{ base: "column", md: "row" }}
                      gap={6}
                    >
                      <Flex
                        flexDirection={"column"}
                        gap={4}
                        flex={"1"}
                        position={"relative"}
                      >
                        <Field.Root
                          invalid={!!formMethods.formState.errors.title}
                        >
                          <Field.Label>Title</Field.Label>
                          <Input
                            {...formMethods.register("title")}
                            name="title"
                            type="text"
                            placeholder={"Enter the document title"}
                          />
                          <Field.ErrorText>
                            {formMethods.formState.errors.title?.message}
                          </Field.ErrorText>
                        </Field.Root>

                        <Box mb={3}>
                          <Text fontWeight={"semibold"} mb={4}>
                            Options ( exclusion )
                          </Text>
                          <Stack gap={4} align="flex-start">
                            <For each={formSubmissionExclusion}>
                              {(item) => (
                                <SwitchComponent
                                  key={item.field}
                                  name={item.field}
                                  label={item.label}
                                />
                              )}
                            </For>
                          </Stack>
                        </Box>

                        <Flex
                          gap={4}
                          flex={1}
                          flexDirection={"column"}
                          border={"1px solid"}
                          borderColor={"border"}
                          p={3}
                          borderRadius={4}
                          display={isExclusionSmallSources ? "flex" : "none"}
                        >
                          <Flex justifyContent={"space-between"}>
                            <Text fontWeight={"semibold"}>
                              Exclusion Threshold
                            </Text>
                            <RadioGroup.Root
                              defaultValue="1"
                              size={"sm"}
                              variant={"outline"}
                              value={exclusionType}
                              onValueChange={(details) => {
                                formMethods.setValue(
                                  "exclusion_type",
                                  // @ts-expect-error
                                  details.value,
                                );
                              }}
                            >
                              <HStack gap={3}>
                                {formSubmissionExclusionThresholdType.map(
                                  (item) => (
                                    <RadioGroup.Item
                                      key={item.label}
                                      value={item.value}
                                      cursor={"pointer"}
                                    >
                                      <RadioGroup.ItemHiddenInput
                                        name={item.field}
                                      />
                                      <RadioGroup.ItemIndicator />
                                      <RadioGroup.ItemText>
                                        {item.label}
                                      </RadioGroup.ItemText>
                                    </RadioGroup.Item>
                                  ),
                                )}
                              </HStack>
                            </RadioGroup.Root>
                          </Flex>

                          <Flex>
                            <NumberInput.Root
                              size={"xs"}
                              w={"full"}
                              name={"exclusion_value"}
                              value={String(exclusionValue)}
                              onValueChange={({ value }) => {
                                formMethods.setValue(
                                  "exclusion_value",
                                  Number(value),
                                );
                              }}
                            >
                              <NumberInput.Label />
                              <NumberInput.Control>
                                <NumberInput.IncrementTrigger />
                                <NumberInput.DecrementTrigger />
                              </NumberInput.Control>
                              <NumberInput.Scrubber />
                              <InputGroup
                                flex={1}
                                startElement={<TbSquarePercentage />}
                              >
                                <NumberInput.Input />
                              </InputGroup>
                            </NumberInput.Root>
                          </Flex>
                        </Flex>
                      </Flex>

                      <FileUpload.Root
                        w={{ base: "full", md: "350px" }}
                        alignItems="stretch"
                        maxFiles={1}
                        accept={
                          ".docx,.xlsx,.pptx,.ps,.pdf,.html, .rtf, .odt, .hwp, .txt"
                        }
                        cursor={"pointer"}
                        gap={2}
                      >
                        <FileUpload.Label>Document</FileUpload.Label>
                        <FileUpload.HiddenInput
                          multiple={false}
                          onChange={(e) => {
                            const fileList = e.target.files;
                            if (fileList) {
                              formMethods.setValue("file", fileList[0], {
                                shouldValidate: true,
                                shouldDirty: true,
                              });
                            }
                          }}
                        />
                        <FileUpload.Dropzone
                          minHeight={"auto"}
                          height={"-webkit-fill-available"}
                          gap={2}
                          p={5}
                          bg={"gray.50"}
                          _hover={{ bg: "orange.50" }}
                        >
                          <Icon size="xl" color="fg.muted">
                            <IoCloudUploadOutline />
                          </Icon>
                          <FileUpload.DropzoneContent>
                            <Box fontSize={"sm"} mb={5}>
                              Drag and drop file here
                            </Box>
                            <Flex
                              fontSize={"xs"}
                              flexDirection={"column"}
                              color="fg.muted"
                            >
                              <Text as={"span"}>
                                Uploaded file must be less than <b>100 MB</b>
                              </Text>
                              <Text as={"span"}>
                                Uploaded file must has less than{" "}
                                <b>800 pages</b>
                              </Text>
                              <Text as={"span"}>
                                Files must contain <b>over 20 words</b> for a
                                similarity report
                              </Text>
                              <Text as={"span"}>
                                Supported file types for generating repots:
                              </Text>
                              <Text as={"span"} fontWeight={"bold"}>
                                .docx, .xlsx, .pptx, .ps, .pdf, .html, .rtf,
                                .odt, .hwp, .txt
                              </Text>
                            </Flex>
                          </FileUpload.DropzoneContent>
                        </FileUpload.Dropzone>
                        <FileUpload.List clearable />
                        <Text
                          textStyle={"xs"}
                          color={"red.500"}
                          fontWeight={500}
                        >
                          {formMethods.formState.errors.file?.message as string}
                        </Text>
                      </FileUpload.Root>
                    </Fieldset.Content>
                  </Fieldset.Root>
                  <Alert.Root
                    size={"sm"}
                    variant={"surface"}
                    status={"warning"}
                  >
                    <Alert.Indicator />
                    <Alert.Content>
                      <Alert.Title />
                      <Alert.Description>
                        The AI feature is available exclusively for English
                        documents.
                      </Alert.Description>
                    </Alert.Content>
                  </Alert.Root>
                  <Alert.Root
                    size={"sm"}
                    variant={"surface"}
                    status="info"
                    colorPalette="gray"
                  >
                    <Alert.Indicator />
                    <Alert.Content>
                      <Alert.Description>
                        The file you are submitting will not be added to any
                        repository.
                      </Alert.Description>
                    </Alert.Content>
                  </Alert.Root>
                </Dialog.Body>
                <Dialog.Footer>
                  <Dialog.ActionTrigger asChild>
                    <Button
                      disabled={formMethods.formState.isSubmitting}
                      variant="outline"
                    >
                      Cancel
                    </Button>
                  </Dialog.ActionTrigger>
                  <Button
                    loading={formMethods.formState.isSubmitting}
                    type={"submit"}
                  >
                    Submit <MdArrowRightAlt />
                  </Button>
                </Dialog.Footer>
                <Dialog.CloseTrigger asChild>
                  <CloseButton size="sm" />
                </Dialog.CloseTrigger>
              </form>
            </FormProvider>
          </Dialog.Content>
        </Dialog.Positioner>
      </Portal>
    </Dialog.Root>
  );
};

const SwitchComponent = ({
  label,
  name,
}: {
  label: string;
  name:
    | "exclusion_bibliographic"
    | "exclusion_quoted"
    | "exclusion_small_sources";
}) => {
  const { setValue, control } = useFormContext<AddSubmissionFormRequest>();
  const fieldValue = useWatch({ control, name });

  return (
    <Switch.Root
      size={"sm"}
      variant={"solid"}
      cursor={"pointer"}
      checked={fieldValue}
      onCheckedChange={(details) => {
        setValue(name, !!details.checked);
        if (name === "exclusion_small_sources") {
          if (details.checked) {
            setValue("exclusion_type", "words");
            setValue("exclusion_value", 0);
          } else {
            setValue("exclusion_type", "none");
            setValue("exclusion_value", 0);
          }
        }
      }}
    >
      <Switch.HiddenInput name={name} />
      <Switch.Control />
      <Switch.Label>{label}</Switch.Label>
    </Switch.Root>
  );
};
