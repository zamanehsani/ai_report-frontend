import * as React from "react";
import { IconLogout, type Icon } from "@tabler/icons-react";

import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

import { useStore } from "@/store/use-store";

export function NavSecondary({
  items,
  ...props
}: {
  items: {
    title: string;
    url: string;
    icon: Icon;
  }[];
} & React.ComponentPropsWithoutRef<typeof SidebarGroup>) {
  const logout = useStore((state: any) => state.logout);

  return (
    <SidebarGroup {...props}>
      <SidebarGroupContent>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild onClick={() => logout()}>
              <a href="#">
                <IconLogout />
                <span className="">Logout</span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>

          {/* {items.map((item) => (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton asChild>
                <a href={item.url}>
                  <item.icon />
                  <span>{item.title}</span>
                </a>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))} */}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}
