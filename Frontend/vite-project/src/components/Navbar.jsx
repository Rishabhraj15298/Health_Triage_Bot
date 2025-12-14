import { Menu, X, Zap, User } from "lucide-react";
import { useState, useEffect } from "react";
import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/clerk-react";
import { useNavigate } from "react-router-dom";

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <nav className={`fixed top-0 w-full bg-[#0A0A0F]/90 backdrop-blur-md z-50 border-b border-gray-800 transition-all duration-700 ${isVisible ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0'}`}>
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          {/* LOGO */}
          <div className="flex items-center gap-2 group cursor-pointer" onClick={() => navigate("/")}>
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center group-hover:scale-110 group-hover:rotate-6 transition-all duration-300">
              <Zap className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-white group-hover:text-blue-400 transition-colors">HealthAI</span>
          </div>

          {/* Desktop Links */}
          <div className="hidden md:flex items-center gap-8">
            <a href="#features" className="relative text-gray-300 hover:text-white transition-colors group">
              Features
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-blue-500 group-hover:w-full transition-all duration-300"></span>
            </a>
            <a href="#solutions" className="relative text-gray-300 hover:text-white transition-colors group">
              Solutions
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-blue-500 group-hover:w-full transition-all duration-300"></span>
            </a>
            <a href="#pricing" className="relative text-gray-300 hover:text-white transition-colors group">
              Pricing
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-blue-500 group-hover:w-full transition-all duration-300"></span>
            </a>
            <a href="#docs" className="relative text-gray-300 hover:text-white transition-colors group">
              Docs
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-blue-500 group-hover:w-full transition-all duration-300"></span>
            </a>
          </div>

          {/* Desktop Auth Buttons */}
          <div className="hidden md:flex items-center gap-4">
            
            <SignedOut>
              <SignInButton mode="modal">
                <button className="text-gray-300 hover:text-white px-4 py-2 transition-colors">
                  Sign in
                </button>
              </SignInButton>
            </SignedOut>

            <SignedIn>
              <button 
                onClick={() => navigate("/dashboard/profile")}
                className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg flex items-center gap-2 transition-all hover:scale-105 hover:shadow-[0_0_20px_rgba(37,99,235,0.4)]"
              >
                <User className="w-4 h-4" />
                Go to Profile
              </button>
              <UserButton afterSignOutUrl="/" />
            </SignedIn>

            <SignedOut>
              <SignInButton mode="modal">
                <button className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg transition-all hover:scale-105 hover:shadow-[0_0_20px_rgba(37,99,235,0.4)]">
                  Get Started
                </button>
              </SignInButton>
            </SignedOut>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-gray-300 hover:text-white transition-colors"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>

        </div>
      </div>

      {/* Mobile Menu */}
      <div className={`md:hidden border-t border-gray-800 bg-[#0A0A0F] overflow-hidden transition-all duration-300 ${isMenuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}>
        <div className="px-6 py-4 space-y-4">
          
          <a href="#features" className="text-gray-300 hover:text-white block hover:translate-x-2 transition-all">Features</a>
          <a href="#solutions" className="text-gray-300 hover:text-white block hover:translate-x-2 transition-all">Solutions</a>
          <a href="#pricing" className="text-gray-300 hover:text-white block hover:translate-x-2 transition-all">Pricing</a>
          <a href="#docs" className="text-gray-300 hover:text-white block hover:translate-x-2 transition-all">Docs</a>

          {/* Mobile Auth */}
          <div className="pt-4 space-y-3">
            <SignedOut>
              <SignInButton mode="modal">
                <button className="w-full text-gray-300 border border-gray-700 rounded-lg py-2 hover:bg-white/5 transition-all">
                  Sign in
                </button>
              </SignInButton>

              <SignInButton mode="modal">
                <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg transition-all">
                  Get Started
                </button>
              </SignInButton>
            </SignedOut>

            <SignedIn>
              <button 
                onClick={() => navigate("/dashboard/profile")}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg flex items-center justify-center gap-2 transition-all"
              >
                <User className="w-4 h-4" />
                Go to Profile
              </button>
              <div className="flex justify-center pt-2">
                <UserButton afterSignOutUrl="/" />
              </div>
            </SignedIn>
          </div>
        </div>
      </div>
    </nav>
  );
}

