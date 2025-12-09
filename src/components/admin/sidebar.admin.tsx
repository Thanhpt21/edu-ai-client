'use client';

import { Image, Layout, Menu } from 'antd';
import { 
  AppleOutlined, 
  AppstoreOutlined, 
  BgColorsOutlined, 
  BookOutlined, 
  BranchesOutlined, 
  BulbOutlined, 
  DashboardOutlined, 
  FileProtectOutlined, 
  GiftOutlined, 
  GoldOutlined, 
  HomeOutlined, 
  MessageOutlined, 
  PicLeftOutlined, 
  PicRightOutlined, 
  ProductOutlined, 
  QuestionCircleOutlined, // Thêm icon Quiz
  ScissorOutlined, 
  SettingOutlined, 
  SkinOutlined, 
  SolutionOutlined, 
  TruckOutlined, 
  UnorderedListOutlined, 
  UserOutlined 
} from '@ant-design/icons';
import Link from 'next/link';

interface SidebarAdminProps {
  collapsed: boolean;
}

export default function SidebarAdmin({ collapsed }: SidebarAdminProps) {
  return (
    <Layout.Sider
      trigger={null}
      collapsible
      collapsed={collapsed}
      className="!bg-white shadow"
      style={{ backgroundColor: '#fff' }}
    >
      <div className=" text-center py-4">
        <Image
          src="https://www.sfdcpoint.com/wp-content/uploads/2019/01/Salesforce-Admin-Interview-questions.png"
          alt="Admin Logo"
          width={collapsed ? 40 : 80}
          preview={false}
        />
      </div>
      <Menu
        mode="inline"
        defaultSelectedKeys={['1']}
        items={[
          {
            key: 'admin',
            icon: <DashboardOutlined />,
            label: <Link href="/admin">Dashboard</Link>,
          },
          {
            key: 'course',
            icon: <GoldOutlined />,
            label: <Link href="/admin/course">Khóa học</Link>,
          },
          {
            key: 'assignments',
            icon: <BookOutlined />,
            label: <Link href="/admin/assignments">Bài tập</Link>,
          },
          {
            key: 'quizzes',
            icon: <QuestionCircleOutlined />,
            label: <Link href="/admin/quizzes">Quiz</Link>,
          },
          {
            key: 'users',
            icon: <UserOutlined />,
            label: <Link href="/admin/users">Tài khoản</Link>,
          },
          {
            key: 'role',
            icon: <SettingOutlined />,
            label: <Link href="/admin/role">Vai trò</Link>,
          },
          {
            key: 'permission',
            icon: <FileProtectOutlined />,
            label: <Link href="/admin/permission">Quyền</Link>,
          },
          {
            key: 'contact',
            icon: <MessageOutlined />,
            label: <Link href="/admin/contact">Liên hệ</Link>,
          },
          {
            key: 'blog',
            icon: <BulbOutlined  />,
            label: <Link href="/admin/blog">Tin tức</Link>,
          },
          {
            key: 'sub4',
            icon: <BranchesOutlined />,
            label: 'Cấu hình',
            children: [
              {
                key: 'category',
                icon: <GoldOutlined />,
                label: <Link href="/admin/category">Danh mục khóa học</Link>,
              },
              {
                key: 'tag',
                icon: <GoldOutlined />,
                label: <Link href="/admin/tag">Thẻ khóa học</Link>,
              },
              { 
                key: 'config', 
                icon: <SettingOutlined />, 
                label: <Link href="/admin/config">Cấu hình</Link> 
              },
            ],
          },
        ]}
      />
    </Layout.Sider>
  );
}