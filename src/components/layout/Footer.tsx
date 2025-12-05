"use client";

import Link from "next/link";
import {
  PhoneOutlined,
  MailOutlined,
  EnvironmentOutlined,
  FacebookOutlined,
  YoutubeOutlined,
  LinkedinOutlined,
  InstagramOutlined,
  BookOutlined,
} from "@ant-design/icons";

interface FooterProps {
  config?: {
    phone?: string;
    email?: string;
    address?: string;
    facebook?: string;
    youtube?: string;
    linkedin?: string;
    instagram?: string;
  };
}

const Footer = ({ config }: FooterProps) => {
  const socialLinks = [
    {
      icon: <FacebookOutlined />,
      url: config?.facebook || "#",
      label: "Facebook",
    },
    {
      icon: <YoutubeOutlined />,
      url: config?.youtube || "#",
      label: "YouTube",
    },
    {
      icon: <LinkedinOutlined />,
      url: config?.linkedin || "#",
      label: "LinkedIn",
    },
    {
      icon: <InstagramOutlined />,
      url: config?.instagram || "#",
      label: "Instagram",
    },
  ];

  const quickLinks = [
    { label: "Trang chủ", href: "/" },
    { label: "Khóa học", href: "/courses" },
    { label: "Giảng viên", href: "/instructors" },
    { label: "Blog", href: "/blog" },
    { label: "Về chúng tôi", href: "/about" },
  ];

  const categoryLinks = [
    { label: "Lập trình", href: "/courses?category=programming" },
    { label: "Kinh doanh", href: "/courses?category=business" },
    { label: "Marketing", href: "/courses?category=marketing" },
    { label: "Design", href: "/courses?category=design" },
    { label: "Data Science", href: "/courses?category=data-science" },
  ];

  const supportLinks = [
    { label: "Trung tâm hỗ trợ", href: "/help-center" },
    { label: "Câu hỏi thường gặp", href: "/faq" },
    { label: "Chính sách bảo mật", href: "/privacy" },
    { label: "Điều khoản dịch vụ", href: "/terms" },
    { label: "Liên hệ", href: "/contact" },
  ];

  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {/* Company Info */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-lg flex items-center justify-center">
                <BookOutlined className="text-white text-lg" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white">EduLearn</h3>
                <p className="text-indigo-300 text-sm">HỌC TẬP & PHÁT TRIỂN</p>
              </div>
            </div>
            <p className="text-gray-300 text-sm leading-relaxed mb-6 max-w-md">
              Nền tảng học tập trực tuyến hàng đầu với hàng nghìn khóa học chất lượng cao. 
              Chúng tôi cam kết mang đến trải nghiệm học tập tốt nhất cho mọi học viên.
            </p>
            
            {/* Contact Info */}
            <div className="space-y-3">
              <div className="flex items-center gap-3 text-gray-300 text-sm">
                <PhoneOutlined className="text-indigo-400" />
                <span>{config?.phone || "1800 1010"}</span>
              </div>
              <div className="flex items-center gap-3 text-gray-300 text-sm">
                <MailOutlined className="text-indigo-400" />
                <span>{config?.email || "contact@edulearn.vn"}</span>
              </div>
              <div className="flex items-start gap-3 text-gray-300 text-sm">
                <EnvironmentOutlined className="text-indigo-400 mt-0.5" />
                <span>{config?.address || "Tòa nhà TechMaster, Quận 1, TP.HCM"}</span>
              </div>
            </div>

            {/* Newsletter Subscription */}
            <div className="mt-6">
              <h4 className="font-medium text-white mb-2 text-sm">
                Đăng ký nhận tin tức
              </h4>
              <div className="flex">
                <input
                  type="email"
                  placeholder="Email của bạn"
                  className="flex-1 px-4 py-2 text-sm text-gray-900 bg-white border border-gray-300 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
                <button className="px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-sm font-medium rounded-r-lg hover:from-indigo-700 hover:to-purple-700 transition-all">
                  Đăng ký
                </button>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold text-white mb-4 text-sm uppercase tracking-wider">
              Điều hướng
            </h4>
            <ul className="space-y-2">
              {quickLinks.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-gray-300 hover:text-white transition-colors text-sm block py-1 hover:translate-x-1 duration-200"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h4 className="font-semibold text-white mb-4 text-sm uppercase tracking-wider">
              Danh mục
            </h4>
            <ul className="space-y-2">
              {categoryLinks.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-gray-300 hover:text-white transition-colors text-sm block py-1 hover:translate-x-1 duration-200"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support & Social */}
          <div>
            <h4 className="font-semibold text-white mb-4 text-sm uppercase tracking-wider">
              Hỗ trợ
            </h4>
            <ul className="space-y-2 mb-6">
              {supportLinks.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-gray-300 hover:text-white transition-colors text-sm block py-1 hover:translate-x-1 duration-200"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>

            {/* Social Links */}
            <div>
              <h4 className="font-semibold text-white mb-3 text-sm uppercase tracking-wider">
                Kết nối với chúng tôi
              </h4>
              <div className="flex gap-3">
                {socialLinks.map((link, index) => (
                  <Link
                    key={index}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 bg-gray-800 hover:bg-gradient-to-br hover:from-indigo-600 hover:to-purple-600 rounded-lg flex items-center justify-center transition-all duration-300 transform hover:scale-105"
                    title={link.label}
                  >
                    <span className="text-white text-lg">{link.icon}</span>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-800 mt-8 pt-8">
          {/* Bottom Bar */}
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="text-gray-400 text-sm text-center md:text-left">
              <p>© {new Date().getFullYear()} EduLearn. Tất cả các quyền được bảo lưu.</p>
              <p className="mt-1">Mã số doanh nghiệp: 0312345678</p>
            </div>
            
            <div className="flex items-center gap-6 text-gray-400 text-sm">
              <Link href="/privacy" className="hover:text-white transition-colors">
                Bảo mật
              </Link>
              <Link href="/terms" className="hover:text-white transition-colors">
                Điều khoản
              </Link>
              <Link href="/sitemap" className="hover:text-white transition-colors">
                Sitemap
              </Link>
            </div>
          </div>

          {/* Certifications & Awards */}
          <div className="mt-6 pt-6 border-t border-gray-800">
            <div className="flex flex-wrap items-center justify-center gap-6">
              {/* Badge 1 */}
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-indigo-600 rounded-full flex items-center justify-center">
                  <span className="text-white text-xs font-bold">✓</span>
                </div>
                <span className="text-gray-300 text-xs">Chứng nhận ISO 9001</span>
              </div>
              
              {/* Badge 2 */}
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center">
                  <span className="text-white text-xs font-bold">A+</span>
                </div>
                <span className="text-gray-300 text-xs">Đánh giá chất lượng</span>
              </div>
              
              {/* Badge 3 */}
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-yellow-600 rounded-full flex items-center justify-center">
                  <span className="text-white text-xs font-bold">🏆</span>
                </div>
                <span className="text-gray-300 text-xs">Top 10 EdTech 2024</span>
              </div>
            </div>
          </div>

          {/* Educational Message */}
          <div className="mt-6 p-4 bg-gradient-to-r from-indigo-500/10 to-purple-500/10 border border-indigo-500/20 rounded-lg">
            <div className="flex items-center justify-center gap-3">
              <div className="w-6 h-6 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-full flex items-center justify-center">
                <BookOutlined className="text-white text-xs" />
              </div>
              <p className="text-indigo-200 text-sm text-center">
                📚 <strong>Học tập là khoản đầu tư không bao giờ lỗ</strong> - 
                Mỗi khóa học là một bước tiến trên con đường phát triển sự nghiệp của bạn.
              </p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;