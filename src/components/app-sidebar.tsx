import { Settings, FileText, Tag, Plus, Folder } from "lucide-react"

import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar"
import { Link } from "react-router-dom";
import Logo from "./logo";
import { ReactNode } from "react";

interface MenuItem {
  title: string;
  icon?: ReactNode;
  path?: string;
  children?: SubMenuItem[];
}

interface SubMenuItem {
  title: string;
  path: string;
  icon?: ReactNode;
}

export function AppSidebar() {
  const menuItems: MenuItem[] = [
    {
      title: "Posts",
      icon: <FileText className="mr-2 h-4 w-4" />,
      children: [
        { title: "List posts", path: "/admin/posts", icon: <FileText className="mr-2 h-4 w-4" /> },
        { title: "Editor post", path: "/admin/posts/create", icon: <Plus className="mr-2 h-4 w-4" /> }
      ]
    },
    {
      title: "Categories",
      icon: <Folder className="mr-2 h-4 w-4" />,  
      children: [
        { title: "List categories", path: "/admin/categories", icon: <Folder className="mr-2 h-4 w-4" /> },
        { title: "Editor category", path: "/admin/categories/create", icon: <Plus className="mr-2 h-4 w-4" /> }
      ]
    },
    {
      title: "Tags",
      icon: <Tag className="mr-2 h-4 w-4" />,
      children: [
        { title: "List tags", path: "/admin/tags", icon: <Tag className="mr-2 h-4 w-4" /> },
        { title: "Editor tag", path: "/admin/tags/create", icon: <Plus className="mr-2 h-4 w-4" /> }
      ]
    },
    {
      title: "Settings",
      icon: <Settings className="mr-2 h-4 w-4" />,
      path: "/admin/settings"
    }
  ];

  return (
    <Sidebar className="pt-16 px-3" variant="sidebar">
      <SidebarHeader className="mb-3">
        <Logo />
      </SidebarHeader>
      <SidebarContent>
        {menuItems.map((item, index) => (
          <SidebarMenuItem key={index} className="list-none">
            {item.children ? (
              <>
                <SidebarMenuButton>
                  <span className="flex items-center">{item.icon}{item.title}</span>
                </SidebarMenuButton>
                <SidebarMenuSub>
                  {item.children.map((subItem, subIndex) => (
                    <SidebarMenuSubItem key={subIndex}>
                        <SidebarMenuSubButton asChild>
                          <Link to={subItem.path} className="flex items-center">
                            {subItem.icon}
                            {subItem.title}
                          </Link>
                        </SidebarMenuSubButton>
                      </SidebarMenuSubItem>
                    ))}
                </SidebarMenuSub>
              </>
            ) : (
              <SidebarMenuButton asChild>
                <Link to={item.path || "#"} className="flex items-center">
                  {item.icon}
                  {item.title}
                </Link>
              </SidebarMenuButton>
            )}
          </SidebarMenuItem>
        ))}
      </SidebarContent>
    </Sidebar>
  )
}
