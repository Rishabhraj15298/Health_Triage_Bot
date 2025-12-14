import { User, MessageSquare, Calendar, LogOut, FileText, Home } from "lucide-react";
import { useClerk } from "@clerk/clerk-react";
import { useNavigate, useLocation } from "react-router-dom";

export default function Sidebar() {
  const { signOut } = useClerk();
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    { icon: User, label: "Profile", path: "/dashboard/profile" },
    { icon: FileText, label: "Documents", path: "/dashboard/documents" },
    { icon: MessageSquare, label: "Bot", path: "/dashboard/chatbot" },
    { icon: Calendar, label: "Calendar", path: "/dashboard/calendar" },
  ];

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  const isActive = (path) => location.pathname === path;

  return (
    <aside className="w-64 h-screen bg-[#0A0A0F] border-r border-gray-800 flex flex-col fixed left-0 top-0">
      {/* Logo */}
      <div className="p-6 border-b border-gray-800">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">V</span>
          </div>
          <span className="text-xl font-bold text-white">Vaidya</span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.path);
          
          return (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-300 group ${
                active
                  ? "bg-blue-600 text-white shadow-[0_0_20px_rgba(37,99,235,0.3)]"
                  : "text-gray-400 hover:bg-white/5 hover:text-white"
              }`}
            >
              <Icon
                className={`w-5 h-5 transition-transform duration-300 ${
                  active ? "scale-110" : "group-hover:scale-110"
                }`}
              />
              <span className="font-medium">{item.label}</span>
            </button>
          );
        })}
      </nav>

      {/* Bottom Actions */}
      <div className="p-4 border-t border-gray-800 space-y-2">
        {/* Home Button */}
        <button
          onClick={() => navigate("/")}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-blue-400 hover:bg-blue-500/10 hover:text-blue-300 transition-all duration-300 group"
        >
          <Home className="w-5 h-5 group-hover:scale-110 transition-transform" />
          <span className="font-medium">Back to Home</span>
        </button>
        
        {/* Logout Button */}
        <button
          onClick={handleSignOut}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-all duration-300 group"
        >
          <LogOut className="w-5 h-5 group-hover:scale-110 transition-transform" />
          <span className="font-medium">Logout</span>
        </button>
      </div>
    </aside>
  );
}
