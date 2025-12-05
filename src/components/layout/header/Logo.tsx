// components/layout/Logo.tsx
'use client';

import Link from 'next/link';
import { BookOutlined } from '@ant-design/icons';

const Logo = () => {
  return (
    <Link
      href="/"
      className="flex items-center flex-shrink-0 hover:opacity-80 transition-opacity"
    >
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-xl flex items-center justify-center">
          <BookOutlined className="text-white text-lg" />
        </div>
        <div className="hidden sm:block">
          <span className="text-gray-900 font-bold text-xl">EduLearn</span>
          <span className="block text-indigo-600 text-xs font-medium">HỌC TẬP & PHÁT TRIỂN</span>
        </div>
      </div>
    </Link>
  );
};

export default Logo;