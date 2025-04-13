'use client'

import * as React from 'react'
import { Label, Pie, PieChart, Tooltip } from 'recharts'
import { formatCurrency } from '@/libraries/utils'
import { motion, AnimatePresence } from 'framer-motion'
import { useTranslation } from 'react-i18next'

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart'
import { ITotalBalanceChart } from '@/core/overview/models/overview.interface'

// Add new state type
interface Selected {
  account: string
  amount: number
}

export function BalanceChart({
  chartData,
  chartConfig
}: {
  chartData: ITotalBalanceChart[]
  chartConfig: ChartConfig
}) {
  const { t } = useTranslation(['overview'])
  const [selected, setSelected] = React.useState<Selected | null>(null)
  const chartRef = React.useRef<HTMLDivElement>(null)

  const totalAmount = React.useMemo(() => {
    return chartData.reduce((acc, curr) => acc + curr.amount, 0)
  }, [chartData])

  // Handle click outside
  React.useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (chartRef.current && !chartRef.current.contains(event.target as Node)) {
        setSelected(null)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <Card className='flex flex-col'>
      <CardContent className='flex-1 pb-0 h-full'>
        <ChartContainer config={chartConfig} className='mx-auto aspect-square' ref={chartRef}>
          <PieChart>
            <Tooltip
              wrapperStyle={{ outline: 'none' }}
              content={({ payload }) => {
                if (payload && payload[0]) {
                  const data = payload[0].payload
                  return (
                    <motion.div
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      className='rounded-lg border bg-background p-2 shadow-md'
                    >
                      <p className='font-medium'>{data.account}</p>
                      <p className='text-sm text-muted-foreground'>{formatCurrency(data.amount, 'đ', 'vi-VN')}</p>
                    </motion.div>
                  )
                }
                return null
              }}
            />
            <Pie
              data={chartData}
              dataKey='amount'
              nameKey='account'
              innerRadius={100}
              strokeWidth={10}
              onClick={(data) =>
                setSelected({
                  account: data.account,
                  amount: data.amount
                })
              }
            >
              <Label
                content={({ viewBox }) => {
                  if (viewBox && 'cx' in viewBox && 'cy' in viewBox) {
                    return (
                      <motion.g>
                        <AnimatePresence mode='wait'>
                          <motion.text
                            key={selected ? selected.account : 'total'}
                            initial={{ opacity: 0, y: 5 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -5 }}
                            transition={{ duration: 0.2 }}
                            x={viewBox.cx}
                            y={viewBox.cy}
                            textAnchor='middle'
                            dominantBaseline='middle'
                          >
                            <tspan
                              x={viewBox.cx}
                              y={viewBox.cy ? viewBox.cy - 12 : 0}
                              className='fill-muted-foreground text-sm'
                            >
                              {selected ? selected.account : t('dashboard.balance_chart.title', 'Total Balance')}
                            </tspan>
                            <tspan
                              x={viewBox.cx}
                              y={(viewBox.cy ?? 0) + 12}
                              className='fill-foreground text-2xl font-bold'
                            >
                              {formatCurrency(selected ? selected.amount : totalAmount, 'đ', 'vi-VN')}
                            </tspan>
                          </motion.text>
                        </AnimatePresence>
                      </motion.g>
                    )
                  }
                }}
              />
            </Pie>
          </PieChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
