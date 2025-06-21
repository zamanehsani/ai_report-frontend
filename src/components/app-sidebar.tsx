import * as React from "react";
import {
  IconCamera,
  IconChartBar,
  IconDashboard,
  IconDatabase,
  IconFileAi,
  IconFileDescription,
  IconFileWord,
  IconFolder,
  IconHelp,
  IconInnerShadowTop,
  IconReport,
  IconSearch,
  IconSettings,
  IconUsers,
} from "@tabler/icons-react";

// import { NavDocuments } from "./nav-documents";
import { NavMain } from "./nav-main";
import { NavSecondary } from "./nav-secondary";
import { NavUser } from "./nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

import { useStore } from "@/store/use-store";

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const user = useStore((state) => state.user);

  let navMain = [];

  if (user?.userType === "client") {
    navMain = [
      {
        title: "Reports",
        url: "./",
        icon: IconFolder,
      },
      {
        title: "Sites",
        url: "./sites",
        icon: IconChartBar,
      },
    ];
  } else if (user?.userType === "personnel") {
    navMain = [
      {
        title: "Reports",
        url: "./",
        icon: IconFolder,
      },
    ];
  } else {
    navMain = [
      {
        title: "Reports",
        url: "./",
        icon: IconFolder,
      },
      {
        title: "Users",
        url: "./admin",
        icon: IconDashboard,
      },
      {
        title: "Clients",
        url: "./clients",
        icon: IconUsers,
      },
      {
        title: "Personnels",
        url: "./personnels",
        icon: IconUsers,
      },
      {
        title: "Sites",
        url: "./sites",
        icon: IconChartBar,
      },
    ];
  }

  const navSecondary = [
    {
      title: "Settings",
      url: "#",
      icon: IconSettings,
    },
    {
      title: "Get Help",
      url: "#",
      icon: IconHelp,
    },
    {
      title: "Search",
      url: "#",
      icon: IconSearch,
    },
  ];

  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild className="data-[slot=sidebar-menu-button]:!p-1.5">
              <a href="#">
                <IconInnerShadowTop className="!size-5" />
                <span className="text-base font-semibold">ProtectionCorps.com</span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarFooter>
        <NavUser user={user} />
      </SidebarFooter>
      <SidebarContent>
        <NavMain items={navMain} />
        {/* <NavDocuments items={data.documents} /> */}
        <NavSecondary items={navSecondary} className="mt-auto" />
      </SidebarContent>
    </Sidebar>
  );
}
