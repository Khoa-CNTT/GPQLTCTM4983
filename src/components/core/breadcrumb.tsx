'use client'

import React, { useMemo } from 'react'
import { usePathname } from 'next/navigation'
import Link from 'next/link' // Import next/link for client-side navigation
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
  BreadcrumbPage
} from '@/components/ui/breadcrumb'
import { navItems } from '@/constants/routes'
import { NavItem } from '@/types/core.i'
import { useTranslation } from 'react-i18next'

function findNavItem(path: string, items = navItems): NavItem | undefined {
  for (const item of items) {
    if (item.href === path) {
      return item
    }
    if (item.children) {
      const found = findNavItem(path, item.children)
      if (found) {
        return found
      }
    }
  }
  return undefined
}

export default function BreadcrumbHeader() {
  const path = usePathname()
  const { t } = useTranslation(['overview', 'common'])

  const translateBreadcrumbTitle = (title: string, path: string): string => {
    // Chuyển đổi title dựa vào path
    if (path === '/dashboard') {
      return t('breadcrumb.overview', 'Overview')
    }

    // Mapping các path khác với các key trong file dịch
    const pathTranslationMap: Record<string, string> = {
      '/dashboard/profile': 'common:breadcrumb.profile',
      '/dashboard/transaction': 'common:breadcrumb.transaction',
      '/dashboard/tracker-transaction': 'common:breadcrumb.tracker_transaction',
      '/dashboard/account-source': 'common:breadcrumb.account_source',
      '/dashboard/expenditure-fund': 'common:breadcrumb.expenditure_fund',
      '/dashboard/spending-plan': 'common:breadcrumb.spending_plan',
    }

    // Nếu path được định nghĩa trong map, trả về bản dịch tương ứng
    if (pathTranslationMap[path]) {
      return t(pathTranslationMap[path], title)
    }

    return title
  }

  const breadcrumbItems = useMemo(() => {
    const segments = path.split('/').filter((seg) => seg)
    const paths = segments.map((segment, index) => `/${segments.slice(0, index + 1).join('/')}`)
  console.log('paths', paths);

    return paths.map((path, index) => {
      const navItem = findNavItem(path)
      const title = navItem?.title || 'Dashboard'
      return {
        title: translateBreadcrumbTitle(title, path),
        href: path,
        isLast: index === paths.length - 1
      }
    })
  }, [path, t ])

  return (
    <div className='select-none'>
      <Breadcrumb>
        {/* Using regular Link components instead of BreadcrumbLink with asChild 
            to avoid issues with React.Children.only errors from Radix UI Slot */}
        <BreadcrumbList>
          <BreadcrumbItem>
            <Link href='/' className='font-semibold text-foreground hover:text-foreground transition-colors'>
              <span>{t('common:breadcrumb.home', 'Home')}</span>
            </Link>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          {breadcrumbItems.map((item) => (
            <React.Fragment key={item.href}>
              <BreadcrumbItem>
                {item.isLast ? (
                  <BreadcrumbPage className='font-semibold text-foreground'>{item.title}</BreadcrumbPage>
                ) : (
                  <Link href={item.href} className='font-semibold text-foreground hover:text-foreground transition-colors'>
                    <span>{item.title}</span>
                  </Link>
                )}
              </BreadcrumbItem>
              {!item.isLast && <BreadcrumbSeparator />}
            </React.Fragment>
          ))}
        </BreadcrumbList>
      </Breadcrumb>
    </div>
  )
}
