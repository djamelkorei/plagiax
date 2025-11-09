'use client';

import {Card, Flex, Icon, SimpleGrid, Stat, Text} from "@chakra-ui/react";
import {DashboardContainer} from "@/components/dashboard-container";
import {HiOutlineUsers} from "react-icons/hi";
import {LuBadgeCheck} from "react-icons/lu";
import {PiNewspaper} from "react-icons/pi";
import {Chart, useChart} from "@chakra-ui/charts";
import {Area, AreaChart, CartesianGrid, Cell, Label, Legend, Pie, PieChart, Tooltip, XAxis, YAxis,} from "recharts";

export default function DashboardHome() {

  const startDate = '09 Nov 2025';
  const endDate = '09 Dec 2025';
  const membershipLength = 1;
  const membershipUnit = 'Month(s)'

  return (
    <DashboardContainer
      title={'Dashboard'}
      breadcrumbs={['dashboard']}
    >
      <Flex gap={6} flexDirection={'column'}>

        <SimpleGrid columns={{base: 1, md: 3}} gap={6}>

          <Card.Root>
            <Card.Body bg={'secondaryLight'}>
              <Stat.Root>
                <Stat.Label>
                  Membership Status
                  <Icon asChild w={5} h={5} ms={'auto'}>
                    <LuBadgeCheck/>
                  </Icon>
                </Stat.Label>
                <Stat.ValueText
                  color={'green.600'}
                >
                  Active
                </Stat.ValueText>
                <Stat.HelpText>Total days left <b>32 days</b></Stat.HelpText>
              </Stat.Root>
            </Card.Body>
          </Card.Root>

          <Card.Root>
            <Card.Body bg={'secondaryLight'}>
              <Stat.Root>
                <Stat.Label>
                  Total student accounts
                  <Icon asChild w={5} h={5} ms={'auto'}>
                    <HiOutlineUsers/>
                  </Icon>
                </Stat.Label>
                <Stat.ValueText
                  alignItems="baseline"
                >
                  12 <Stat.ValueUnit>/ {(2000).toLocaleString()}</Stat.ValueUnit>
                </Stat.ValueText>
                <Stat.HelpText>Total account left <b>{(2000 - 12).toLocaleString()}</b></Stat.HelpText>
              </Stat.Root>
            </Card.Body>
          </Card.Root>

          <Card.Root>
            <Card.Body bg={'secondaryLight'}>
              <Stat.Root>
                <Stat.Label>
                  Submissions
                  <Icon asChild w={5} h={5} ms={'auto'}>
                    <PiNewspaper/>
                  </Icon>
                </Stat.Label>
                <Stat.ValueText
                >
                  {(708).toLocaleString()}
                </Stat.ValueText>
                <Stat.HelpText>Total documents submitted</Stat.HelpText>
              </Stat.Root>
            </Card.Body>
          </Card.Root>

        </SimpleGrid>

        <Card.Root>
          <Card.Body bg={'secondaryLight'} display={'flex'} flexDirection={'row'} alignItems={'center'} gap={6}>
            <Stat.Root>
              <Stat.Label>
                Membership Length
              </Stat.Label>
              <Stat.ValueText alignItems="baseline">
                {membershipLength}
                <Stat.ValueUnit>
                  {membershipUnit}
                </Stat.ValueUnit>
              </Stat.ValueText>
              <Stat.HelpText>Start at <b>{startDate}</b> | End at <b>{endDate}</b></Stat.HelpText>
            </Stat.Root>
            <MembershipChart/>
          </Card.Body>
        </Card.Root>

        <Card.Root>
          <Card.Body>
            <SubmissionChart/>
          </Card.Body>
        </Card.Root>


      </Flex>
    </DashboardContainer>
  )

}

const MembershipChart = () => {
  const chart = useChart({
    data: [
      {name: "account used", value: 18, color: "orange.300"},
      {name: "account free to use", value: 1982, color: "gray.200"},
    ],
  })

  return (
    <Chart.Root boxSize="100px" chart={chart}>
      <PieChart>
        <Tooltip
          cursor={false}
          animationDuration={100}
          content={<Chart.Tooltip hideLabel/>}
        />
        <Pie
          innerRadius={45}
          outerRadius={60}
          isAnimationActive={false}
          data={chart.data}
          dataKey={chart.key("value")}
          paddingAngle={2}
          cornerRadius={2}
        >
          <Label
            content={({viewBox}) => (
              <Chart.RadialText
                fontSize={'1.25rem'}
                viewBox={viewBox}
                title={chart.getTotal("value").toLocaleString()}
                description={(
                  <Text as={'tspan'} style={{fontSize: '0.5rem'}}>
                    Students Account
                  </Text>
                )}
              />
            )}
          />
          {chart.data.map((item) => (
            <Cell key={item.name} fill={chart.color(item.color)}/>
          ))}
        </Pie>
      </PieChart>
    </Chart.Root>
  )
}

const SubmissionChart = () => {
  const chart = useChart({
    data: [
      {submissions: 186, month: "January"},
      {submissions: 165, month: "February"},
      {submissions: 190, month: "March"},
      {submissions: 195, month: "May"},
      {submissions: 182, month: "June"},
      {submissions: 175, month: "August"},
      {submissions: 180, month: "October"},
      {submissions: 185, month: "November"},
    ],
    series: [
      {name: "submissions", color: "gray.500"},
    ],
  })

  const dataMax = Math.max(...chart.data.map(i => i.submissions))
  const edgeMax = 5 - ((dataMax + 10) % 5) + dataMax + 10;

  return (
    <Chart.Root maxH="2xs" chart={chart}>
      <AreaChart data={chart.data}>
        <CartesianGrid
          stroke={chart.color("border")}
          vertical={false}
          strokeDasharray="3 3"
        />
        <XAxis
          dataKey={chart.key("month")}
          tickLine={false}
          axisLine={false}
          tickMargin={8}
          tickFormatter={(value) => value.slice(0, 3)}
        />
        <YAxis tickLine={false}
               axisLine={false}
               tickMargin={10}
               domain={[0, edgeMax]}
               label={{value: "Total submission in month", position: "left", angle: -90}}
        />
        <Tooltip
          cursor={false}
          animationDuration={100}
          content={<Chart.Tooltip/>}
        />
        <Legend content={<Chart.Legend/>}/>

        {chart.series.map((item) => (
          <defs key={item.name}>
            <Chart.Gradient
              id={`${item.name}-gradient`}
              stops={[
                {offset: "0%", color: item.color, opacity: 0.2},
                {offset: "100%", color: item.color, opacity: 0},
              ]}
            />
          </defs>
        ))}

        {/*{chart.series.map((item) => (*/}
        {/*  <Area*/}
        {/*    isAnimationActive={false}*/}
        {/*    stackId="b"*/}
        {/*    legendType="none"*/}
        {/*    tooltipType="none"*/}
        {/*    key={item.name}*/}
        {/*    dataKey={chart.key(item.name)}*/}
        {/*    dot={{fill: chart.color(item.color), fillOpacity: 1}}*/}
        {/*    activeDot={false}*/}
        {/*    fill="none"*/}
        {/*    stroke="none"*/}
        {/*  />*/}
        {/*))}*/}

        {chart.series.map((item) => (
          <Area
            key={item.name}
            type="natural"
            isAnimationActive={false}
            dataKey={chart.key(item.name)}
            fill={`url(#${item.name}-gradient)`}
            stroke={chart.color(item.color)}
            strokeWidth={1}
            stackId="a"
          />
        ))}
      </AreaChart>
    </Chart.Root>
  )
}
