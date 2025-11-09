'use client';

import {Button, Card, Field, Fieldset, Flex, Input, Stack} from "@chakra-ui/react";
import {DashboardContainer} from "@/components/dashboard-container";
import {MdArrowRightAlt} from "react-icons/md";

export default function DashboardAccount() {

  return (
    <DashboardContainer
      title={'Submissions'}
      breadcrumbs={['dashboard', 'account']}
    >
      <Flex gap={6} flexDirection={'column'}>

        <Card.Root>
          <Card.Body>
            <Fieldset.Root>
              <Stack>
                <Fieldset.Legend>Profile Information</Fieldset.Legend>
                <Fieldset.HelperText>
                  Update your account's profile information and email address.
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

              </Fieldset.Content>

              <Button w={'fit-content'}>Update <MdArrowRightAlt/></Button>

            </Fieldset.Root>
          </Card.Body>
        </Card.Root>

        <Card.Root>
          <Card.Body>
            <Fieldset.Root>
              <Stack>
                <Stack>
                  <Fieldset.Legend>Update Password</Fieldset.Legend>
                  <Fieldset.HelperText>
                    Ensure your account is using a long, random password to stay secure.
                  </Fieldset.HelperText>
                </Stack>
              </Stack>

              <Fieldset.Content>

                <Field.Root invalid={false} flex={1}>
                  <Field.Label>Current Password</Field.Label>
                  <Input name="current_password" type="text" placeholder={'Enter your current password'}/>
                  <Field.ErrorText>This is an error text</Field.ErrorText>
                </Field.Root>

                <Field.Root invalid={false} flex={1}>
                  <Field.Label>New Password</Field.Label>
                  <Input name="new_password" type="text" placeholder={'Enter your new password'}/>
                  <Field.ErrorText>This is an error text</Field.ErrorText>
                </Field.Root>

                <Field.Root invalid={false} flex={1}>
                  <Field.Label>Confirm Password</Field.Label>
                  <Input name="confirm_password" type="text" placeholder={'Enter your confirm password'}/>
                  <Field.ErrorText>This is an error text</Field.ErrorText>
                </Field.Root>

              </Fieldset.Content>

              <Button w={'fit-content'}>Submit <MdArrowRightAlt/></Button>

            </Fieldset.Root>
          </Card.Body>
        </Card.Root>

      </Flex>
    </DashboardContainer>
  )

}
