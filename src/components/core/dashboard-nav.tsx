'use client'

import { usePathname, useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { Icons } from '@/components/ui/icons'
import { cn } from '@/libraries/utils'
import { NavItem } from '@/types/core.i'
import { Dispatch, SetStateAction } from 'react'
import { useSidebar } from '@/hooks/useSidebar'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/common/tooltip'

interface DashboardNavProps {
  items: NavItem[]
  setOpen?: Dispatch<SetStateAction<boolean>>
  isMobileNav?: boolean
}

export function DashboardNav({ items, setOpen, isMobileNav = false }: DashboardNavProps) {
  const path = usePathname()
  const router = useRouter()
  const { isMinimized } = useSidebar()
  if (!items?.length) {
    return null
  }

  return (
    <nav className='grid items-start gap-2'>
      <TooltipProvider>
        {items.map((item, index) => {
          const Icon = Icons[item.icon || 'arrowRight']
          return (
            item.href && (
              <Tooltip key={index}>
                <TooltipTrigger asChild>
                  <button
                    className={cn(
                      'flex w-full items-center gap-2 overflow-hidden rounded-md py-2 text-sm font-medium text-foreground hover:bg-primary hover:text-white',
                      path === item.href ? 'bg-primary text-white' : 'transparent',
                      item.disabled && 'cursor-not-allowed opacity-80'
                    )}
                    onClick={() => {
                      if (setOpen) setOpen(false)
                      if (!item.disabled) {
                        router.push(item.href)
                      }
                    }}
                  >
                    <Icon className={`ml-3 size-5 flex-none`} src='' alt='' />
                    {isMobileNav || (!isMinimized && !isMobileNav) ? (
                      <motion.span
                        initial={{ x: -20, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ duration: 0.2, delay: 0.1 }}
                        className='mr-2 truncate'
                      >
                        <span className='te'>{item.title}</span>
                      </motion.span>
                    ) : (
                      ''
                    )}
                  </button>
                </TooltipTrigger>
                <motion.div
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  transition={{ duration: 0.2 }}
                >
                  <TooltipContent
                    align='center'
                    side='right'
                    sideOffset={8}
                    className={`${!isMinimized ? 'hidden' : 'inline-block'} text-white`}
                  >
                    {item.title}
                  </TooltipContent>
                </motion.div>
              </Tooltip>
            )
          )
        })}
      </TooltipProvider>
    </nav>
  )
}
