// components/layout/UserMenu.tsx
'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  UserOutlined, SettingOutlined, LogoutOutlined, 
  BookOutlined, DashboardOutlined 
} from '@ant-design/icons';
import { useAuth } from '@/context/AuthContext';
import { useLogout } from '@/hooks/auth/useLogout';

const UserMenu = () => {
  const router = useRouter();
  const { currentUser } = useAuth();
  const [showMenu, setShowMenu] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const { logoutUser, isPending: isLogoutPending } = useLogout();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setShowMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => logoutUser();
  if (!currentUser) return null;

  // Menu items cơ bản cho mọi user
  const userMenuItems = [
    { label: 'Hồ sơ', href: '/profile', icon: <UserOutlined /> },
    { label: 'Khóa học của tôi', href: '/my-courses', icon: <BookOutlined /> },
    { label: 'Cài đặt', href: '/settings', icon: <SettingOutlined /> },
  ];

  // Thêm menu item đặc biệt theo role
  const roleSpecificItems = [];
  
  if (currentUser.role === 'teacher') {
    roleSpecificItems.push({
      label: 'Bảng điều khiển giảng viên',
      href: '/instructor/dashboard',
      icon: <DashboardOutlined />
    });
  }
  
  if (currentUser.role === 'admin') {
    roleSpecificItems.push({
      label: 'Bảng điều khiển quản trị',
      href: '/admin/dashboard',
      icon: <DashboardOutlined />
    });
  }

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setShowMenu(!showMenu)}
        className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-50 transition-colors"
      >
        <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-full flex items-center justify-center">
          {currentUser.avatar ? (
            <img 
              src={currentUser.avatar} 
              alt={currentUser.name} 
              className="w-8 h-8 rounded-full object-cover" 
            />
          ) : (
            <UserOutlined className="text-white text-sm" />
          )}
        </div>
        <div className="hidden md:block text-left">
          <p className="text-sm font-medium text-gray-700">{currentUser.name}</p>
          <p className="text-xs text-gray-500">
            {currentUser.role === 'teacher' ? 'Giảng viên' : 
             currentUser.role === 'admin' ? 'Quản trị viên' : 'Học viên'}
          </p>
        </div>
      </button>

      {showMenu && (
        <div className="absolute right-0 mt-2 w-72 bg-white rounded-xl shadow-lg border border-gray-200 py-2 z-50">
          {/* User Info */}
          <div className="px-4 py-3 border-b border-gray-100">
            <p className="font-semibold text-gray-900">{currentUser.name}</p>
            <p className="text-sm text-gray-500">{currentUser.email}</p>
            <div className="mt-1">
              <span className={`text-xs px-2 py-1 rounded-full ${
                currentUser.role === 'teacher' 
                  ? 'bg-orange-100 text-orange-700' 
                  : currentUser.role === 'admin'
                  ? 'bg-red-100 text-red-700'
                  : 'bg-green-100 text-green-700'
              }`}>
                {currentUser.role === 'teacher' ? 'Giảng viên' : 
                 currentUser.role === 'admin' ? 'Quản trị viên' : 'Học viên'}
              </span>
            </div>
          </div>

          {/* Main Menu Items */}
          {userMenuItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center space-x-3 px-4 py-3 text-gray-700 hover:bg-gray-50 transition-colors"
              onClick={() => setShowMenu(false)}
            >
              {item.icon}
              <span>{item.label}</span>
            </Link>
          ))}

          {/* Role Specific Items */}
          {roleSpecificItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center space-x-3 px-4 py-3 ${
                currentUser.role === 'teacher'
                  ? 'text-orange-600 hover:bg-orange-50'
                  : 'text-red-600 hover:bg-red-50'
              } transition-colors border-t border-gray-100`}
              onClick={() => setShowMenu(false)}
            >
              {item.icon}
              <span className="font-medium">{item.label}</span>
            </Link>
          ))}

          {/* Logout Button */}
          <button
            onClick={handleLogout}
            disabled={isLogoutPending}
            className="flex items-center space-x-3 px-4 py-3 text-red-600 hover:bg-red-50 w-full text-left transition-colors border-t border-gray-100"
          >
            <LogoutOutlined />
            <span>{isLogoutPending ? 'Đang đăng xuất...' : 'Đăng xuất'}</span>
          </button>
        </div>
      )}
    </div>
  );
};

export default UserMenu;