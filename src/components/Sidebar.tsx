import {
  Sidebar as SidebarComponent,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar";
import {
  // LayoutDashboard,
  // Users,
  // MessageSquare,
  // FileText,
  // Upload,
  // CheckSquare,
  // FileSpreadsheet,
  // BarChart2,
  // Database,
  // UserCog,
  Menu,
} from "lucide-react";
import { useLocation, Link } from "react-router-dom";
import { useSidebar } from "@/hooks/useSidebar";
import { useAuthStore } from "@/store/useAuthStore";
import { Button } from "@/components/ui/button";
import Dashboard from "../assets/img/dashboard.svg"
import Campaign from "../assets/img/campaign.svg"
import Usertie from "../assets/img/user-tie.svg"
import Clause from "../assets/img/Clause.svg"
import Upload from "../assets/img/upload.svg"
import Approve from "../assets/img/mdi_file-tick.svg"
import Template from "../assets/img/heroicons-solid_template.svg"
import BarChart2 from "../assets/img/Report.svg"
import Database from "../assets/img/material-symbols_folder.svg"
import UserCog from "../assets/img/UserAccess.svg"
import CampaignActive from "../assets/img/material-symbols_campaign-rounded.svg"
import UsertieActive from "../assets/img/fa-solid_user-tie.svg"
import ClauseActive from "../assets/img/Group(3).svg"
import UploadActive from "../assets/img/Group 37903 (2).svg"
import ApproveActive from "../assets/img/mdi_file-tickactive.svg"
import TemplateActive from "../assets/img/heroicons-solid_template (1).svg"
import BarChart2Active from "../assets/img/Frame 1597884787.svg"
import DatabaseActive from "../assets/img/material-symbols_folder (2).svg"
import UserCogActive from "../assets/img/Frame 1597884788 (1).svg"
import logo from "../assets/img/Logo.svg"
// Menu items with associated feature names for permission checking
const menuItems = [
  {
    icon:Dashboard,
    activeicon:Dashboard,
    label: "Dashboard",
    href: "/dashboard",
    featureName: "Dashboard",
  },
  {
    icon: Usertie,
    activeicon: UsertieActive,
    label: "Attorney Management",
    href: "/attorney-management",
    featureName: "Attorney Management",
  },
  {
    icon: Campaign,
    activeicon: CampaignActive,
    label: "Campaign Management",
    href: "/campaign-management",
    featureName: "Campaign Management",
  },
  {
    icon: Clause,
    activeicon: ClauseActive,
    label: "Clause Management",
    href: "/clause-management" ,
    featureName: "Clause Management",
  },
  {
    icon: Upload,
    activeicon: UploadActive,
    label: "Upload Templates",
    href: "/upload-template",
    featureName: "Templates",
  },
  {
    icon: Approve,
    activeicon: ApproveActive,
    label: "Approve Templates",
    href: "/approve-template",
    featureName: "Approve Templates",
  },
  {
    icon: Template,
    activeicon: TemplateActive,
    label: "Template Management",
    href: "/template-management",
    featureName: "Template Management",
  },
  { icon: BarChart2, activeicon: BarChart2Active, label: "Report", href: "/report", featureName: "Report" },
  {
    icon: Database,
    activeicon: DatabaseActive,
    label: "Content Management System",
    href: "/content-management",
    featureName: "CMS ",
  },
  {
    icon: UserCog,
     activeicon: UserCogActive,
    label: "User Access Management",
    href: "/user-management",
    featureName: "User Access Management",
  },
];

const Sidebar = () => {
  const location = useLocation();
  const { state, toggleSidebar } = useSidebar();
  const { user } = useAuthStore();

  // Check if the user has permission for a specific feature
  const hasPermission = (permissions: any[], featureName: string) => {
    // Special case for Template Management - show it when Templates is allowed
    if (featureName === "Template Management") {
      const templatesFeature = permissions.find(
        (perm) => perm.featureName === "Templates"
      );
      if (templatesFeature) {
        return templatesFeature.permissions.some(
          (perm: any) => 
            ["View", "Manage", "Create"].includes(perm.name) && 
            perm.status === true
        );
      }
      return false;
    }

    const feature = permissions.find(
      (perm) => perm.featureName === featureName
    );
    if (!feature) return false;

    // For Dashboard and Follow Me: Special permission check
    if (
      ["Dashboard", "Follow Me", "Approve Templates", "Report"].includes(
        featureName
      )
    ) {
      return feature.permissions.some(
        (perm: any) => perm.name === "Allowed" && perm.status === true
      );
    }

    // Define permission categories for specific features
    const permissionCategories: { [key: string]: string[] } = {
      "Clause Management": ["Create", "Manage", "View"],
      "User Access Management": ["View", "Manage"],
      "Campaign Management": ["View", "Manage", "Create"],
      "Templates": ["View", "Manage", "Create"],
      "Attorney Management": ["View", "Manage", "Create"],
      // Add other features with their respective permission names as needed
    };

    // Check if the feature name exists in our permission categories mapping
    if (permissionCategories[featureName]) {
      return feature.permissions.some(
        (perm: any) =>
          permissionCategories[featureName].includes(perm.name) &&
          perm.status === true
      );
    }

    // For other features: Allow if any permission is true and it's not "Not Allowed"
    return feature.permissions.some(
      (perm: any) => perm.status === true && perm.name !== "Not Allowed"
    );
  };
  // Determine if an item is active
  const isItemActive = (item: typeof menuItems[0]) => {
    // Standard check for direct matches
    if (location.pathname.startsWith(item.href)) {
      return true;
    }
    
    // Special cases for Attorney Management
    if (item.href === "/attorney-management") {
      return (
        location.pathname.startsWith("/attorney-detail") ||
        location.pathname.startsWith("/attorney-case-detail")
      );
    }
     if (item.href === "/campaign-management") {
    return (
      location.pathname.startsWith("/create-campaign") ||
      location.pathname.startsWith("/campaign-management")
    );
  }
    
    return false;
  };

  return (
    <>
      {/* Mobile Header */}
      <div className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-4 h-16 bg-white border-b shadow-sm md:hidden">
        <Button
          variant="ghost"
          size="sm"
          className="p-0 hover:bg-transparent"
          onClick={toggleSidebar}
        >
          <Menu className="h-6 w-6 text-gray-600" />
        </Button>
        <div className="flex justify-center items-center">
          <img src={logo} alt="Legacy Assurance Plan Logo" className="h-8" />
        </div>
        <div className="w-6" />
      </div>

      <div className="md:hidden h-16" />

      <SidebarComponent>
        <SidebarContent className="bg-white shadow-lg">
          <div className="hidden md:flex justify-center items-center h-16 border-b">
            <img src={logo} alt="Legacy Assurance Plan Logo" className="h-10" />
          </div>
          <SidebarGroup>
            <SidebarGroupContent>
              <SidebarMenu className="space-y-2">
                {menuItems.map((item) => {
                  const isActive = isItemActive(item);
                  const iconSrc = isActive ? item.activeicon : item.icon;
                  
                  if (hasPermission(user.permissions, item.featureName)) {
                    return (
                      <SidebarMenuItem key={item.label}>
                        <SidebarMenuButton asChild>
                          <Link
                            to={item.href}
                            className={`flex items-center gap-3 px-4 py-3 hover:bg-[#E7F5FF] rounded-md hover:text-[#00426E] text-base font-medium roboto-font transition-colors ${
                              isActive
                                ? "bg-[#E7F5FF] text-[#00426E]"
                                : "text-[#222B45]"
                            }`}
                            onClick={() => {
                              if (window.innerWidth < 768) {
                                toggleSidebar();
                              }
                            }}
                          >
                            <img 
                              className="w-5 h-5 shrink-0" 
                              src={iconSrc} 
                              alt={item.label}
                            />
                            <span className="truncate">{item.label}</span>
                          </Link>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    );
                  }
                  return null;
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
      </SidebarComponent>
    </>
  );
};

export default Sidebar;
