// components/layout/MainMenu.tsx
'use client';

import Link from 'next/link';

interface MainMenuProps {
  pathname: string;
}

const MainMenu = ({ pathname }: MainMenuProps) => {
  const mainMenuItems = [
    { label: 'Trang chủ', href: '/' },
    { label: 'Khóa học', href: '/courses' },
    { label: 'Về chúng tôi', href: '/about' },
    { label: 'Tin tức', href: '/blog' },
    { label: 'Liên hệ', href: '/contact' },
  ];

  return (
    <nav className="hidden lg:flex items-center space-x-1">
      {mainMenuItems.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className={`px-6 py-2 text-[15px] font-medium rounded-lg transition-all duration-200 ${
            pathname === item.href
              ? 'bg-indigo-50 text-indigo-600 border border-indigo-200'
              : 'text-gray-600 hover:text-indigo-600 hover:bg-gray-50'
          }`}
        >
          {item.label}
        </Link>
      ))}
    </nav>
  );
};

export default MainMenu;