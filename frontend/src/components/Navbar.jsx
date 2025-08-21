import { useState, useRef, useEffect } from "react";
import { Menu, X, User, LogOut, Settings } from "lucide-react";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  const profileRef = useRef();

  useEffect(() => {
    function handleClickOutside(event) {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setProfileOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <nav className="fixed top-4 left-1/2 transform -translate-x-1/2 w-[95%] md:w-[90%] bg-white/20 backdrop-blur-xl shadow-lg border border-white/30 rounded-xl z-50 px-6 py-4">
      <div className="flex justify-between items-center">
        <div className="text-xl sm:text-2xl font-extrabold text-indigo-700 drop-shadow">
          API Tester 🚀
        </div>

        <div className="hidden md:flex space-x-8 items-center">
          <NavLink text="Dashboard" />
          <NavLink text="History" />

          <div className="relative" ref={profileRef}>
            <button
              onClick={() => setProfileOpen(!profileOpen)}
              className="w-9 h-9 flex items-center justify-center rounded-full bg-indigo-600 text-white hover:bg-indigo-700 transition"
            >
              <User size={18} />
            </button>

            {profileOpen && (
              <div className="absolute right-0 mt-2 w-44 bg-white/80 backdrop-blur-lg shadow-lg border border-white/30 rounded-lg py-2 z-50">
                <ProfileItem icon={<User size={16} />} text="Your Profile" />
                <ProfileItem icon={<Settings size={16} />} text="Settings" />
                <ProfileItem icon={<LogOut size={16} />} text="Logout" />
              </div>
            )}
          </div>
        </div>

        <button
          onClick={() => setIsOpen(!isOpen)}
          className="md:hidden text-gray-700"
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {isOpen && (
        <div className="md:hidden mt-4 space-y-3">
          <MobileLink text="Dashboard" />
          <MobileLink text="History" />

          <div className="pt-2 border-t border-white/30">
            <ProfileItemMobile icon={<User size={16} />} text="Your Profile" />
            <ProfileItemMobile icon={<Settings size={16} />} text="Settings" />
            <ProfileItemMobile icon={<LogOut size={16} />} text="Logout" />
          </div>
        </div>
      )}
    </nav>
  );
}

function NavLink({ text }) {
  return (
    <a
      href="#"
      className="text-gray-700 hover:text-indigo-600 transition font-medium text-sm"
    >
      {text}
    </a>
  );
}

function MobileLink({ text }) {
  return (
    <a
      href="#"
      className="block text-gray-700 hover:text-indigo-600 transition font-medium text-sm"
    >
      {text}
    </a>
  );
}

function ProfileItem({ icon, text }) {
  return (
    <a
      href="#"
      className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-indigo-100 transition"
    >
      {icon}
      {text}
    </a>
  );
}

function ProfileItemMobile({ icon, text }) {
  return (
    <a
      href="#"
      className="flex items-center gap-2 px-2 py-2 text-sm text-gray-700 hover:bg-indigo-100 transition"
    >
      {icon}
      {text}
    </a>
  );
}
