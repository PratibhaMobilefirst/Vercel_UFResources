// import { Bell, User } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { useAuthStore } from "@/store/useAuthStore";
import { useToast } from "@/components/ui/use-toast";
import { useSidebar } from "@/hooks/useSidebar";
import Bell from "../assets/img/Bell.svg"
import User_icon from "../assets/img/User_icon.svg"
import Logo from "../assets/img/Logo.svg"
const Header = () => {
  const { clearAuth } = useAuthStore();
  const { toast } = useToast();
  const { state: sidebarOpen } = useSidebar();

  const handleLogout = () => {
    clearAuth();
    localStorage.removeItem("auth-store");
    sessionStorage.removeItem("auth-store");

    toast({
      title: "Logged out successfully",
      description: "You have been logged out of your account.",
      duration: 3000, // Duration in ms
      // variant: "success", // Success variant
    });

    console.log("Logged out successfully!");
    // Add any additional logic for redirection, e.g., using React Router
  };

  return (
    <header className="h-16 border-b bg-white flex items-center justify-between px-6">
      <div className="flex-1 flex items-center gap-2">
        {/* Center logo when sidebar is closed on desktop */}
        <div className={`md:flex items-center transition-all duration-300 ${!sidebarOpen ? 'md:ml-[calc(50vw-130px)]' : 'md:ml-0'}`}>
          <img
            src={Logo}
            alt="Legacy Assurance Plan Logo"
            className="h-8 md:hidden"
          />
        </div>
      </div>
      <div className="flex items-center gap-4">
        {/* <Bell className="w-5 h-5 text-gray-500" /> */}
          <img src={Bell} alt="Bell" />
          
        {/* User icon dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger>
            {/* <User className="w-5 h-5 text-gray-500 cursor-pointer" /> */}
            <img src={User_icon} alt="user" />
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem onClick={handleLogout} className="cursor-pointer">
              Logout
            </DropdownMenuItem>
            {/* Add more menu items here if needed */}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
};

export default Header;
