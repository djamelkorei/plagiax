'use client';

import {Flex} from "@chakra-ui/react";
import {DashboardContainer} from "@/components/dashboard-container";

export default function DashboardAccount() {

  return (
    <DashboardContainer
      title={'Submissions'}
      breadcrumbs={['dashboard', 'account']}
    >
      <Flex gap={6} flexDirection={'column'}>

        account

      </Flex>
    </DashboardContainer>
  )

}
