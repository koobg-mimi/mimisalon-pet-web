'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ChevronRight, type LucideIcon } from 'lucide-react';

import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import {
  SidebarGroup,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from '@/components/ui/sidebar';

export function NavMain({
  items,
}: {
  items: {
    title: string;
    url: string;
    icon?: LucideIcon;
    isActive?: boolean;
    items?: {
      title: string;
      url: string;
    }[];
  }[];
}) {
  const pathname = usePathname();

  // State to track which menus are open
  const [openMenus, setOpenMenus] = useState<Record<string, boolean>>({});

  // Initialize and update open state based on current route
  useEffect(() => {
    const newOpenMenus: Record<string, boolean> = {};

    items.forEach((item) => {
      const menuKey = item.title;

      // Check if menu should be open based on current route
      const shouldBeOpen =
        item.isActive || (item.items?.some((subItem) => pathname.startsWith(subItem.url)) ?? false);

      // Keep existing open state if manually opened, otherwise follow route logic
      newOpenMenus[menuKey] = shouldBeOpen;
    });

    setOpenMenus((prev) => {
      // Only update if there's actually a change
      const hasChanged = Object.keys(newOpenMenus).some((key) => prev[key] !== newOpenMenus[key]);
      if (!hasChanged) return prev; // Prevent re-render by returning previous state
      return { ...prev, ...newOpenMenus };
    });
  }, [pathname, items]);

  // Handle manual toggle of collapsible menus
  const toggleMenu = (menuKey: string) => {
    setOpenMenus((prev) => ({
      ...prev,
      [menuKey]: !prev[menuKey],
    }));
  };

  return (
    <SidebarGroup>
      <SidebarMenu>
        {items.map((item) => {
          // If item has sub-items, render as collapsible
          if (item.items && item.items.length > 0) {
            return (
              <Collapsible
                key={item.title}
                asChild
                open={openMenus[item.title] ?? false}
                onOpenChange={() => toggleMenu(item.title)}
                className="group/collapsible"
              >
                <SidebarMenuItem>
                  <CollapsibleTrigger asChild>
                    <SidebarMenuButton tooltip={item.title}>
                      {item.icon && <item.icon />}
                      <span>{item.title}</span>
                      <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                    </SidebarMenuButton>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <SidebarMenuSub>
                      {item.items.map((subItem) => (
                        <SidebarMenuSubItem key={subItem.title}>
                          <SidebarMenuSubButton asChild>
                            <Link href={subItem.url}>
                              <span>{subItem.title}</span>
                            </Link>
                          </SidebarMenuSubButton>
                        </SidebarMenuSubItem>
                      ))}
                    </SidebarMenuSub>
                  </CollapsibleContent>
                </SidebarMenuItem>
              </Collapsible>
            );
          }

          // If item has no sub-items, render as direct link
          return (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton asChild tooltip={item.title}>
                <Link href={item.url}>
                  {item.icon && <item.icon />}
                  <span>{item.title}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          );
        })}
      </SidebarMenu>
    </SidebarGroup>
  );
}
