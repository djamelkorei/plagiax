import { Box, Heading, List, Text } from "@chakra-ui/react";
import { AppContext } from "@/data/context";

export default function Terms() {
  return (
    <Box py={8}>
      <Heading as="h1" size="2xl" mb={6}>
        Privacy Policy
      </Heading>

      <Box>
        <Heading as="h3" size="lg" mb={4}>
          1. Introduction
        </Heading>
        <Text mb={6}>
          At {AppContext.name}, we are committed to protecting your privacy.
          This Privacy Policy explains how we collect, use, and protect your
          personal information when you use our platform. By using our services,
          you agree to the collection and use of information as described in
          this policy.
        </Text>

        <Heading as="h3" size="lg" mb={4}>
          2. Information We Collect
        </Heading>
        <Text mb={4}>We collect the following types of information:</Text>
        <List.Root mb={6} ps={10}>
          <List.Item>
            <strong>Personal Information:</strong> When you register for an
            account, we may collect your name, email address, and other relevant
            contact details.
          </List.Item>
          <List.Item>
            <strong>Usage Data:</strong> We collect data on how you interact
            with our platform, including the features you use and how often you
            use them.
          </List.Item>
          <List.Item>
            <strong>Content Submitted:</strong> When you upload documents for
            plagiarism checking, we process and store the content of these
            documents in order to provide the service.
          </List.Item>
        </List.Root>

        <Heading as="h3" size="lg" mb={4}>
          3. How We Use Your Information
        </Heading>
        <Text mb={6}>
          We use the information we collect for the following purposes:
        </Text>
        <List.Root mb={6} ps={10}>
          <List.Item>
            To provide our services: This includes checking for plagiarism,
            scanning content for originality, and delivering reports.
          </List.Item>
          <List.Item>
            To improve our platform: We analyze usage data to improve our
            services and provide you with a better experience.
          </List.Item>
          <List.Item>
            To communicate with you: We may send you updates about your account,
            service notifications, or marketing materials if you've opted in to
            receive them.
          </List.Item>
        </List.Root>

        <Heading as="h3" size="lg" mb={4}>
          4. Data Retention
        </Heading>
        <Text mb={6}>
          We retain your personal data for as long as necessary to fulfill the
          purposes outlined in this Privacy Policy or as required by law. If you
          wish to delete your account or request removal of your data, please
          *contact us.
          {/*at{" "}*!/*/}
          {/*<Text as={"b"} textTransform={"lowercase"}>*/}
          {/*  [{AppContext.email}]*/}
          {/*</Text>*/}
          {/*.*/}
        </Text>

        <Heading as="h3" size="lg" mb={4}>
          5. Sharing Your Information
        </Heading>
        <Text mb={6}>
          We do not sell or rent your personal information to third parties.
          However, we may share your information with:
        </Text>
        <List.Root mb={6}>
          <List.Item>
            <strong>Service Providers:</strong> We may share data with trusted
            third-party vendors who assist us in operating our platform and
            delivering services.
          </List.Item>
          <List.Item>
            <strong>Legal Compliance:</strong> We may disclose your information
            if required by law or in response to legal requests from
            authorities.
          </List.Item>
        </List.Root>

        <Heading as="h3" size="lg" mb={4}>
          6. Security of Your Information
        </Heading>
        <Text mb={6}>
          We implement reasonable security measures to protect your personal
          data from unauthorized access, alteration, or destruction. However, no
          method of transmission over the Internet or electronic storage is 100%
          secure, so we cannot guarantee absolute security.
        </Text>

        <Heading as="h3" size="lg" mb={4}>
          7. Your Rights
        </Heading>
        <Text mb={6}>
          Depending on your location, you may have certain rights regarding your
          personal data, including:
        </Text>
        <List.Root mb={6}>
          <List.Item>
            The right to access, update, or delete your personal information.
          </List.Item>
          <List.Item>
            The right to object to or restrict the processing of your data.
          </List.Item>
          <List.Item>The right to withdraw consent at any time.</List.Item>
        </List.Root>
        <Text mb={6}>
          To exercise any of these rights, please contact us.
          {/*at{" "}*/}
          {/*<Text as={"b"} textTransform={"lowercase"}>*/}
          {/*  [{AppContext.email}]*/}
          {/*</Text>*/}
          {/*.*/}
        </Text>

        <Heading as="h3" size="lg" mb={4}>
          8. Cookies and Tracking Technologies
        </Heading>
        <Text mb={6}>
          {AppContext.name} uses cookies and similar tracking technologies to
          enhance your experience. These technologies help us remember your
          preferences, analyze usage patterns, and improve our services. You can
          adjust your browser settings to manage or block cookies.
        </Text>

        <Heading as="h3" size="lg" mb={4}>
          9. Changes to This Policy
        </Heading>
        <Text mb={6}>
          We may update this Privacy Policy from time to time. Any changes will
          be posted on this page, and we will notify you via email or through a
          notification on the platform.
        </Text>

        <Heading as="h3" size="lg" mb={4}>
          10. Contact Us
        </Heading>
        <Text mb={6}>
          If you have any questions or concerns about our privacy practices,
          please reach out to us.
          {/*at{" "}*/}
          {/*<Text as={"b"} textTransform={"lowercase"}>*/}
          {/*  [{AppContext.email}]*/}
          {/*</Text>*/}
          {/*.*/}
        </Text>
      </Box>
    </Box>
  );
}
