import { Upload, BookOpen, Sparkles } from "lucide-react";
import { NavLink } from "@/components/NavLink";
import { Separator } from "@/components/ui/separator";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  useSidebar,
} from "@/components/ui/sidebar";

const navGroups = [
  {
    label: "Review",
    items: [
      { title: "New Review", url: "/", icon: Upload },
    ],
  },
  {
    label: "Resources",
    items: [
      { title: "Knowledge Base", url: "/knowledge", icon: BookOpen },
    ],
  },
];

export function AppSidebar() {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="border-b px-4 py-5">
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary shadow-sm">
            <Sparkles className="h-4 w-4 text-primary-foreground" />
          </div>
          {!collapsed && (
            <div className="flex flex-col">
              <span className="text-sm font-semibold text-foreground tracking-tight">Creative Review</span>
              <span className="text-[11px] text-muted-foreground">AI-Powered Agent</span>
            </div>
          )}
        </div>
      </SidebarHeader>

      <SidebarContent className="py-2">
        {navGroups.map((group, gi) => (
          <SidebarGroup key={group.label}>
            <SidebarGroupLabel className="text-[11px] uppercase tracking-wider text-muted-foreground/60 font-medium px-3">
              {group.label}
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {group.items.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild>
                      <NavLink
                        to={item.url}
                        end
                        className="sidebar-menu-hover hover:bg-sidebar-accent hover:text-sidebar-accent-foreground transition-colors"
                        activeClassName="bg-sidebar-accent text-sidebar-accent-foreground font-medium"
                      >
                        <item.icon className="mr-2 h-4 w-4" />
                        {!collapsed && <span>{item.title}</span>}
                      </NavLink>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
            {gi < navGroups.length - 1 && (
              <Separator className="mt-2 mx-3 w-auto opacity-50" />
            )}
          </SidebarGroup>
        ))}
      </SidebarContent>
    </Sidebar>
  );
}
