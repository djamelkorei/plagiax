import {Box, Heading, List, Text} from "@chakra-ui/react";
import {AppContext} from "@/data/context";

export default function Terms() {
  return (
    <Box py={8}>
      <Heading as="h1" size="2xl" mb={6}>Terms of Use</Heading>

      <Box>
        <Heading as="h3" size="lg" mb={4}>1. Introduction</Heading>
        <Text mb={6}>
          Welcome to {AppContext.name}! By using our services, you agree to the following terms and conditions.
          Please read them carefully to understand your rights and obligations when using our platform.
        </Text>

        <Heading as="h3" size="lg" mb={4}>2. Acceptance of Terms</Heading>
        <Text mb={6}>
          By accessing and using {AppContext.name}, you agree to comply with these Terms of Use and all applicable laws
          and
          regulations.
          If you do not agree with any of these terms, please refrain from using the platform.
        </Text>

        <Heading as="h3" size="lg" mb={4}>3. Account Registration</Heading>
        <Text mb={4}>
          To use certain features of {AppContext.name}, you may need to create an account. You agree to provide
          accurate, current,
          and complete information during the registration process, and to keep your account information up-to-date.
        </Text>
        <List.Root mb={6} ps={10}>
          <List.Item>You are responsible for maintaining the confidentiality of your account and password.</List.Item>
          <List.Item>You agree to immediately notify us of any unauthorized access or suspicious activity related to
            your account.</List.Item>
        </List.Root>

        <Heading as="h3" size="lg" mb={4}>4. User Responsibilities</Heading>
        <Text mb={6}>
          You agree not to use {AppContext.name} to upload or share content that violates any intellectual property
          rights, or is
          illegal, harmful, defamatory, or offensive. You also agree to not attempt to interfere with the functioning of
          the platform.
        </Text>

        <Heading as="h3" size="lg" mb={4}>5. {AppContext.name} Rights</Heading>
        <Text mb={6}>
          {AppContext.name} reserves the right to modify, update, or discontinue the platform at any time. We may also
          monitor
          user activities
          to ensure compliance with these Terms of Use and suspend or terminate your access if you violate them.
        </Text>

        <Heading as="h3" size="lg" mb={4}>6. Intellectual Property</Heading>
        <Text mb={6}>
          All content, trademarks, logos, and intellectual property associated with {AppContext.name} are owned
          by {AppContext.name} or its
          licensors.
          You agree not to copy, modify, distribute, or create derivative works based on {AppContext.name}’s content
          without
          explicit permission.
        </Text>

        <Heading as="h3" size="lg" mb={4}>7. Limitation of Liability</Heading>
        <Text mb={6}>
          {AppContext.name} is not responsible for any damages that arise from your use or inability to use the
          platform,
          including but not
          limited to data loss, errors, or any unauthorized access to your content.
        </Text>

        <Heading as="h3" size="lg" mb={4}>8. Indemnification</Heading>
        <Text mb={6}>
          You agree to indemnify and hold harmless {AppContext.name}, its affiliates, officers, employees, and agents
          from any
          claims, damages,
          or liabilities arising out of your use of the platform.
        </Text>

        <Heading as="h3" size="lg" mb={4}>9. Termination</Heading>
        <Text mb={6}>
          We may terminate your access to {AppContext.name} at any time, with or without cause, and without prior
          notice. Upon
          termination,
          your rights to use the platform will cease immediately.
        </Text>

        <Heading as="h3" size="lg" mb={4}>10. Changes to Terms</Heading>
        <Text mb={6}>
          {AppContext.name} reserves the right to modify these Terms of Use at any time. Any changes will be posted on
          this page,
          and by
          continuing to use the platform, you agree to be bound by the updated terms.
        </Text>
      </Box>
    </Box>
  )
}
