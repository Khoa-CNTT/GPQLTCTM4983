'use client'

import * as React from 'react'
import { Area, AreaChart, CartesianGrid, XAxis } from 'recharts'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent
} from '@/components/ui/chart'
import { ICashFlowAnalysisStatistic } from '@/core/overview/models/overview.interface'
import { useTranslation } from 'react-i18next'

export function LineChart({ chartData }: { chartData: ICashFlowAnalysisStatistic[] }) {
  const { t, i18n } = useTranslation(['overview'])

  const chartConfig = {
    transactions: {
      label: t('dashboard.chart.transactions', 'Transactions')
    },
    incoming: {
      label: t('dashboard.chart.incoming', 'Incoming'),
      color: 'hsl(142.1 76.2% 36.3%)'
    },
    outgoing: {
      label: t('dashboard.chart.outgoing', 'Outgoing'),
      color: 'hsl(346.8 77.2% 49.8%)'
    }
  } satisfies ChartConfig

  return (
    <ChartContainer config={chartConfig} className='aspect-auto h-[250px] w-full'>
      <AreaChart data={chartData}>
        <defs>
          <linearGradient id='fillIncoming' x1='0' y1='0' x2='0' y2='1'>
            <stop offset='5%' stopColor='hsl(142.1 76.2% 36.3%)' stopOpacity={0.8} />
            <stop offset='95%' stopColor='hsl(142.1 76.2% 36.3%)' stopOpacity={0.1} />
          </linearGradient>
          <linearGradient id='fillOutgoing' x1='0' y1='0' x2='0' y2='1'>
            <stop offset='5%' stopColor='hsl(346.8 77.2% 49.8%)' stopOpacity={0.8} />
            <stop offset='95%' stopColor='hsl(346.8 77.2% 49.8%)' stopOpacity={0.1} />
          </linearGradient>
        </defs>
        <CartesianGrid vertical={false} />
        <XAxis
          dataKey='date'
          tickLine={false}
          axisLine={false}
          tickMargin={8}
          minTickGap={32}
          tickFormatter={(value) => {
            const date = new Date(value)
            return date.toLocaleDateString(i18n.language === 'vi' ? 'vi-VN' : 'en-US', {
              month: 'short',
              day: 'numeric'
            })
          }}
        />
        <ChartTooltip
          cursor={false}
          content={
            <ChartTooltipContent
              labelFormatter={(value) => {
                return new Date(value).toLocaleDateString(i18n.language === 'vi' ? 'vi-VN' : 'en-US', {
                  month: 'short',
                  day: 'numeric'
                })
              }}
              formatter={(value) => `${value.toLocaleString()}đ`}
              indicator='dot'
            />
          }
        />
        <Area dataKey='incoming' type='natural' fill='url(#fillIncoming)' stroke='hsl(142.1 76.2% 36.3%)' stackId='a' />
        <Area dataKey='outgoing' type='natural' fill='url(#fillOutgoing)' stroke='hsl(346.8 77.2% 49.8%)' stackId='a' />
        <ChartLegend content={<ChartLegendContent />} />
      </AreaChart>
    </ChartContainer>
  )
}
