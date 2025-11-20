import { Dispatch, SetStateAction, useEffect } from "react";
import {
  Button,
  CloseButton,
  Dialog,
  Field,
  Fieldset,
  Input,
  InputGroup,
  Portal,
  Stack,
  Switch,
} from "@chakra-ui/react";
import { UserDTO } from "@/dto/user.dto";
import { MdArrowRightAlt } from "react-icons/md";
import { IoMdRefresh } from "react-icons/io";
import { FormProvider, useForm, useWatch } from "react-hook-form";
import { AddUserFormRequest, AddUserFormSchema } from "@/lib/form.service";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormHelper } from "@/helpers/form.helper";
import { userAddAction } from "@/app/actions/user-add.action";

interface AddUserModalProps {
  selectedUser: UserDTO | null;
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  callback: () => void;
}

function getFormValues(selectedUser: UserDTO | null): AddUserFormRequest {
  return {
    id: selectedUser?.id ?? undefined,
    name: selectedUser?.name ?? "",
    email: selectedUser?.email ?? "",
    password: selectedUser ? "password" : "",
    active: selectedUser?.active ?? false,
  };
}

export const AddUserModal = ({
  selectedUser,
  open,
  setOpen,
  callback,
}: AddUserModalProps) => {
  const formMethods = useForm<AddUserFormRequest>({
    resolver: zodResolver(AddUserFormSchema),
    defaultValues: getFormValues(selectedUser),
  });

  useEffect(() => {
    if (open) {
      formMethods.reset(getFormValues(selectedUser));
    }
  }, [open, selectedUser, formMethods]);

  const isActive = useWatch({ control: formMethods.control, name: "active" });

  const onSubmit = (data: AddUserFormRequest) => {
    userAddAction(FormHelper.toFormData(data)).then((res) => {
      if (res.hasError) {
        formMethods.setError("email", {
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
      size={"lg"}
      open={open}
      onOpenChange={(d) => setOpen(d.open)}
    >
      <Portal>
        <Dialog.Backdrop />
        <Dialog.Positioner>
          <Dialog.Content>
            <Dialog.Header>
              <Dialog.Title>
                {selectedUser ? "Edit" : "Add new "} student
              </Dialog.Title>
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
                        Please fill out the following fields to add a new
                        student. All fields are required to ensure the student
                        is added to the system correctly.
                      </Fieldset.HelperText>
                    </Stack>

                    <Fieldset.Content>
                      {Object.keys(formMethods.formState.errors)}

                      <Field.Root
                        invalid={!!formMethods.formState.errors.name}
                        flex={1}
                      >
                        <Field.Label>Name</Field.Label>
                        <Input
                          {...formMethods.register("name")}
                          name="name"
                          type="text"
                          placeholder={"Enter the student name"}
                        />
                        <Field.ErrorText>
                          {formMethods.formState.errors.name?.message}
                        </Field.ErrorText>
                      </Field.Root>

                      <Field.Root
                        invalid={!!formMethods.formState.errors.email}
                        flex={1}
                      >
                        <Field.Label>Email</Field.Label>
                        <Input
                          {...formMethods.register("email")}
                          name="email"
                          type="email"
                          placeholder={"Enter the student email"}
                        />
                        <Field.ErrorText>
                          {formMethods.formState.errors.email?.message}
                        </Field.ErrorText>
                      </Field.Root>

                      {!selectedUser && (
                        <Field.Root
                          invalid={!!formMethods.formState.errors.password}
                          flex={1}
                        >
                          <Field.Label>Password</Field.Label>
                          <InputGroup
                            flex="1"
                            endElement={
                              <Button
                                size={"2xs"}
                                onClick={() => {
                                  formMethods.setValue(
                                    "password",
                                    generatePassword(),
                                  );
                                }}
                              >
                                Generate <IoMdRefresh />
                              </Button>
                            }
                          >
                            <Input
                              {...formMethods.register("password")}
                              name="password"
                              type="text"
                              placeholder={"Enter the student password"}
                            />
                          </InputGroup>
                          <Field.ErrorText>
                            {formMethods.formState.errors.password?.message}
                          </Field.ErrorText>
                        </Field.Root>
                      )}

                      {selectedUser && (
                        <Switch.Root
                          size={"sm"}
                          cursor={"pointer"}
                          checked={isActive}
                          onCheckedChange={(details) => {
                            formMethods.setValue("active", !!details.checked);
                          }}
                        >
                          <Switch.HiddenInput />
                          <Switch.Control />
                          <Switch.Label>is student active ?</Switch.Label>
                        </Switch.Root>
                      )}
                    </Fieldset.Content>
                  </Fieldset.Root>
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
                    {!selectedUser ? "Submit" : "Update"} <MdArrowRightAlt />
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

export function generatePassword(length = 8) {
  const chars =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*";
  const array = new Uint32Array(length);
  crypto.getRandomValues(array); // Web Crypto API (Next.js supports this)

  let password = "";
  for (let i = 0; i < length; i++) {
    password += chars[array[i] % chars.length];
  }

  return password;
}
