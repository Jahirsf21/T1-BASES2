'use client'

import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Building2Icon, HistoryIcon } from 'lucide-react'
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from '@/components/ui/navigation-menu'

const links = [
  { href: '/', label: 'Departamentos', icon: Building2Icon },
  { href: '/employee-department-history', label: 'Historial del departamento del empleado', icon: HistoryIcon },
]

export function AppNavigation() {
  const pathname = usePathname()

  return (
    <header className="border-b bg-card px-4 sm:px-8">
      <div className="mx-auto flex h-14 max-w-7xl items-center gap-6">
        <span className="hidden items-center gap-2 text-sm font-semibold sm:flex">
          <Image src="/icon.svg" alt="AdventureWorks" width={30} height={30} />
          AdventureWorks
        </span>
        <NavigationMenu className="max-w-none justify-start">
          <NavigationMenuList className="justify-start">
            {links.map(({ href, label, icon: Icon }) => (
              <NavigationMenuItem key={href}>
                <NavigationMenuLink
                  render={<Link href={href} />}
                  data-active={pathname === href}
                >
                  <Icon />
                  <span>{label}</span>
                </NavigationMenuLink>
              </NavigationMenuItem>
            ))}
          </NavigationMenuList>
        </NavigationMenu>
      </div>
    </header>
  )
}
