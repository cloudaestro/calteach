import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { LayoutDashboard, FileText, User, Mail, LogOut } from "lucide-react";
import { motion } from "framer-motion";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const FloatingNav = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();

  const handleSignOut = async () => {
    try {
      await logout();
      navigate("/");
    } catch (error) {
      console.error("Failed to sign out:", error);
    }
  };

  // Don't show on login/register pages
  if (location.pathname === "/login" || location.pathname === "/register") {
    return null;
  }

  // Redirect to dashboard if user is logged in and tries to access landing page
  if (user && location.pathname === "/") {
    navigate("/dashboard");
    return null;
  }

  // Don't show nav on landing page for non-logged in users
  if (!user && location.pathname === "/") {
    return null;
  }

  return (
    <div className="fixed bottom-6 w-full flex justify-center z-50">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="flex items-center gap-2 bg-white/80 backdrop-blur-lg rounded-full px-4 py-2 shadow-lg border border-neutral-200"
      >
        <TooltipProvider delayDuration={0}>
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                onClick={() => navigate("/dashboard")}
                className="p-2 hover:bg-neutral-100 rounded-full transition-all duration-200 hover:scale-110"
                title="Dashboard"
              >
                <LayoutDashboard className="w-5 h-5 text-neutral-600" />
              </button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Dashboard</p>
            </TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <button
                onClick={() => navigate("/my-worksheets")}
                className="p-2 hover:bg-neutral-100 rounded-full transition-all duration-200 hover:scale-110"
                title="My Work"
              >
                <FileText className="w-5 h-5 text-neutral-600" />
              </button>
            </TooltipTrigger>
            <TooltipContent>
              <p>My Worksheets</p>
            </TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <button
                onClick={() => navigate("/profile")}
                className="p-2 hover:bg-neutral-100 rounded-full transition-all duration-200 hover:scale-110"
                title="Profile"
              >
                <User className="w-5 h-5 text-neutral-600" />
              </button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Profile</p>
            </TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <button
                onClick={() => navigate("/contact")}
                className="p-2 hover:bg-neutral-100 rounded-full transition-all duration-200 hover:scale-110"
                title="Contact"
              >
                <Mail className="w-5 h-5 text-neutral-600" />
              </button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Contact</p>
            </TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <button
                onClick={handleSignOut}
                className="p-2 hover:bg-neutral-100 rounded-full transition-all duration-200 hover:scale-110"
                title="Sign Out"
              >
                <LogOut className="w-5 h-5 text-neutral-600" />
              </button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Sign Out</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </motion.div>
    </div>
  );
};

export default FloatingNav;