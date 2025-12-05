// components/layout/MobileMenu.tsx
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { 
  Menu, X, Home, BookOpen, Users, FileText, Info,
  User, Settings, LogOut, BookMarked 
} from 'lucide-react';
import { UserOutlined } from '@ant-design/icons';
import { useLogout } from '@/hooks/auth/useLogout';

const MobileMenu = () => {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const { currentUser, isLoading } = useAuth();
  const { logoutUser } = useLogout();

  // Prevent body scroll when menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  // Close menu on route change
  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  const mainMenuItems = [
    { label: 'Trang chủ', href: '/', icon: <Home className="w-5 h-5" /> },
    { label: 'Khóa học', href: '/courses', icon: <BookOpen className="w-5 h-5" /> },
    { label: 'Giảng viên', href: '/instructors', icon: <Users className="w-5 h-5" /> },
    { label: 'Blog', href: '/blog', icon: <FileText className="w-5 h-5" /> },
    { label: 'Về chúng tôi', href: '/about', icon: <Info className="w-5 h-5" /> },
  ];

  const userMenuItems = currentUser ? [
    { label: 'Hồ sơ', href: '/profile', icon: <User className="w-5 h-5" /> },
    { label: 'Khóa học của tôi', href: '/my-courses', icon: <BookMarked className="w-5 h-5" /> },
    { label: 'Cài đặt', href: '/settings', icon: <Settings className="w-5 h-5" /> },
  ] : [];

  const handleLogout = () => {
    logoutUser();
    setIsOpen(false);
  };

  return (
    <>
      {/* Mobile Menu Button */}
      <div className="lg:hidden flex items-center">
        <button
          onClick={() => setIsOpen(true)}
          className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
          aria-label="Open menu"
        >
          <Menu className="w-6 h-6 text-gray-700" />
        </button>
      </div>

      {/* Mobile Menu Overlay */}
      {isOpen && (
        <div className="lg:hidden fixed inset-0 z-[100]">
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-black bg-opacity-50 backdrop-blur-sm"
            onClick={() => setIsOpen(false)}
          />
          
          {/* Menu Panel */}
          <div className="absolute right-0 top-0 bottom-0 w-[85%] max-w-sm bg-white shadow-xl animate-slideIn">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-xl flex items-center justify-center">
                  <BookOpen className="text-white w-6 h-6" />
                </div>
                <div>
                  <span className="text-gray-900 font-bold text-lg">EduLearn</span>
                  <span className="block text-indigo-600 text-xs font-medium">MOBILE MENU</span>
                </div>
              </div>
              
              <button
                onClick={() => setIsOpen(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                aria-label="Close menu"
              >
                <X className="w-5 h-5 text-gray-600" />
              </button>
            </div>

            {/* Content - Scrollable */}
            <div className="h-[calc(100vh-64px)] overflow-y-auto">
              {/* User Info Section */}
              {!isLoading && (
                <div className="p-4 border-b border-gray-100 bg-gray-50">
                  {currentUser ? (
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-full flex items-center justify-center">
                        {currentUser.avatar ? (
                          <img 
                            src={currentUser.avatar} 
                            alt={currentUser.name} 
                            className="w-12 h-12 rounded-full object-cover"
                          />
                        ) : (
                          <UserOutlined className="text-white text-lg" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-gray-900 truncate">{currentUser.name}</p>
                        <p className="text-sm text-gray-500 truncate">{currentUser.email}</p>
                        <div className="flex items-center mt-1">
                          <span className="text-xs px-2 py-1 rounded-full bg-green-100 text-green-700">
                            {currentUser.role === 'teacher' ? 'Giảng viên' : 'Học viên'}
                          </span>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <p className="text-gray-700 font-medium">Chào mừng đến với EduLearn</p>
                      <div className="flex space-x-2">
                        <button
                          onClick={() => {
                            setIsOpen(false);
                            router.push('/login');
                          }}
                          className="flex-1 px-4 py-2 text-sm font-semibold text-gray-700 border border-gray-300 rounded-lg hover:border-indigo-500 hover:text-indigo-600 transition-colors"
                        >
                          Đăng nhập
                        </button>
                        <button
                          onClick={() => {
                            setIsOpen(false);
                            router.push('/register');
                          }}
                          className="flex-1 px-4 py-2 text-sm font-semibold bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-all shadow-lg hover:shadow-xl"
                        >
                          Đăng ký
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Main Navigation */}
              <div className="p-4">
                <h3 className="text-sm font-semibold text-gray-700 mb-3 uppercase tracking-wider">ĐIỀU HƯỚNG</h3>
                <div className="space-y-1">
                  {mainMenuItems.map((item) => {
                    const isActive = pathname === item.href;
                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        className={`flex items-center space-x-3 p-3 rounded-lg transition-all ${
                          isActive
                            ? 'bg-indigo-50 text-indigo-600 border border-indigo-200'
                            : 'text-gray-700 hover:bg-gray-50'
                        }`}
                      >
                        <div className={`${isActive ? 'text-indigo-600' : 'text-gray-500'}`}>
                          {item.icon}
                        </div>
                        <span className="font-medium">{item.label}</span>
                        {isActive && (
                          <div className="ml-auto w-2 h-2 bg-indigo-600 rounded-full"></div>
                        )}
                      </Link>
                    );
                  })}
                </div>
              </div>

              {/* User Menu (if logged in) */}
              {currentUser && userMenuItems.length > 0 && (
                <div className="p-4 border-t border-gray-100">
                  <h3 className="text-sm font-semibold text-gray-700 mb-3 uppercase tracking-wider">TÀI KHOẢN</h3>
                  <div className="space-y-1">
                    {userMenuItems.map((item) => {
                      const isActive = pathname === item.href;
                      return (
                        <Link
                          key={item.href}
                          href={item.href}
                          className={`flex items-center space-x-3 p-3 rounded-lg transition-all ${
                            isActive
                              ? 'bg-indigo-50 text-indigo-600 border border-indigo-200'
                              : 'text-gray-700 hover:bg-gray-50'
                          }`}
                        >
                          <div className={`${isActive ? 'text-indigo-600' : 'text-gray-500'}`}>
                            {item.icon}
                          </div>
                          <span className="font-medium">{item.label}</span>
                          {isActive && (
                            <div className="ml-auto w-2 h-2 bg-indigo-600 rounded-full"></div>
                          )}
                        </Link>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Teacher Dashboard Link (if teacher) */}
              {currentUser?.role === 'teacher' && (
                <div className="p-4 border-t border-gray-100">
                  <Link
                    href="/instructor/dashboard"
                    className="flex items-center justify-center space-x-2 w-full p-3 bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-lg hover:from-indigo-600 hover:to-purple-600 transition-all shadow-lg"
                    onClick={() => setIsOpen(false)}
                  >
                    <Users className="w-5 h-5" />
                    <span className="font-medium">Bảng điều khiển giảng viên</span>
                  </Link>
                </div>
              )}

              {/* Admin Dashboard Link (if admin) */}
              {currentUser?.role === 'admin' && (
                <div className="p-4 border-t border-gray-100">
                  <Link
                    href="/admin/dashboard"
                    className="flex items-center justify-center space-x-2 w-full p-3 bg-gradient-to-r from-red-500 to-pink-500 text-white rounded-lg hover:from-red-600 hover:to-pink-600 transition-all shadow-lg"
                    onClick={() => setIsOpen(false)}
                  >
                    <Settings className="w-5 h-5" />
                    <span className="font-medium">Bảng điều khiển quản trị</span>
                  </Link>
                </div>
              )}

              {/* Logout Button (if logged in) */}
              {currentUser && (
                <div className="p-4 border-t border-gray-100">
                  <button
                    onClick={handleLogout}
                    className="flex items-center justify-center space-x-2 w-full p-3 text-red-600 bg-red-50 border border-red-200 rounded-lg hover:bg-red-100 transition-colors"
                  >
                    <LogOut className="w-5 h-5" />
                    <span className="font-medium">Đăng xuất</span>
                  </button>
                </div>
              )}

              {/* App Info */}
              <div className="p-4 border-t border-gray-100">
                <div className="text-center text-xs text-gray-500 space-y-1">
                  <p>EduLearn © 2024</p>
                  <p>Nền tảng học tập trực tuyến</p>
                  <p className="pt-2">Học mọi lúc, mọi nơi - Phát triển không ngừng</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add CSS for slide animation */}
      <style jsx global>{`
        @keyframes slideIn {
          from {
            transform: translateX(100%);
          }
          to {
            transform: translateX(0);
          }
        }
        .animate-slideIn {
          animation: slideIn 0.3s ease-out;
        }
      `}</style>
    </>
  );
};

export default MobileMenu;