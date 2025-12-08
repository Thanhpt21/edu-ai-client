// components/admin/contact/ContactTable.tsx
'use client';

import React, { useState } from 'react';
import { Table, Spin, Input, Button, Space, Modal, Tag, Tooltip, Select, message } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { DeleteOutlined, SearchOutlined, EyeOutlined } from '@ant-design/icons';
import moment from 'moment';

// Import các hooks
import { useContacts } from '@/hooks/contact/useContacts';
import { useDeleteContact } from '@/hooks/contact/useDeleteContact';
import { useUpdateContact } from '@/hooks/contact/useUpdateContact'; // Import hook update

// Import interfaces và enums
import { Contact } from '@/types/contact.type';
import { ContactStatus, ContactType } from '@/enums/contact.enums';

const { Search } = Input;
const { Option } = Select;

export default function ContactTable() {
  const [page, setPage] = useState(1);
  const [inputValue, setInputValue] = useState('');
  const [search, setSearch] = useState('');

  // States cho modal xem nội dung
  const [openViewCommentModal, setOpenViewCommentModal] = useState(false);
  const [viewCommentContent, setViewCommentContent] = useState('');
  const [viewCommentTitle, setViewCommentTitle] = useState('');

  // Kích thước trang mặc định
  const pageSize = Number(process.env.NEXT_PUBLIC_PAGE_SIZE) || 10;

  const { data, isLoading, refetch } = useContacts({ page, limit: pageSize, search });
  const { mutateAsync: deleteContact, isPending: isDeleting } = useDeleteContact();
  const { mutateAsync: updateContact, isPending: isUpdating } = useUpdateContact();

  const handleSearch = () => {
    setPage(1);
    setSearch(inputValue);
  };

  const handleTableChange = (pagination: any) => {
    setPage(pagination.current);
  };

  const confirmDelete = async (id: number, name: string) => {
    Modal.confirm({
      title: 'Xác nhận xoá liên hệ',
      content: `Bạn có chắc chắn muốn xoá liên hệ của "${name}" không?`,
      okText: 'Xoá',
      okType: 'danger',
      cancelText: 'Hủy',
      onOk: async () => {
        try {
          await deleteContact(id);
        } catch (error: any) {
          // Xử lý lỗi đã có trong useDeleteContact
        }
      },
      okButtonProps: { loading: isDeleting },
    });
  };

  // Hàm xử lý thay đổi trạng thái
  const handleStatusChange = async (id: number, newStatus: ContactStatus, currentName: string) => {
    try {
      await updateContact({ 
        id, 
        data: { status: newStatus } 
      });
      
      message.success(`Đã cập nhật trạng thái của "${currentName}" thành ${getStatusText(newStatus)}`);
      refetch(); // Làm mới dữ liệu
    } catch (error) {
      message.error('Cập nhật trạng thái thất bại');
    }
  };

  // Hàm chuyển đổi enum status sang tiếng Việt
  const getStatusText = (status: ContactStatus): string => {
    switch (status) {
      case ContactStatus.PENDING:
        return 'Đang chờ';
      case ContactStatus.PROCESSING:
        return 'Đang xử lý';
      case ContactStatus.COMPLETED:
        return 'Hoàn thành';
      case ContactStatus.FAILED:
        return 'Thất bại';
      default:
        return status;
    }
  };

  // Hàm chuyển đổi enum type sang tiếng Việt
  const getTypeText = (type: ContactType): string => {
    switch (type) {
      case ContactType.CONTACT:
        return 'Liên hệ chung';
      case ContactType.PROMOTION:
        return 'Đăng ký khuyến mãi';
      case ContactType.OTHER:
        return 'Khác';
      default:
        return type;
    }
  };

  // Hàm lấy màu cho trạng thái
  const getStatusColor = (status: ContactStatus): string => {
    switch (status) {
      case ContactStatus.PENDING:
        return 'orange';
      case ContactStatus.PROCESSING:
        return 'blue';
      case ContactStatus.COMPLETED:
        return 'green';
      case ContactStatus.FAILED:
        return 'red';
      default:
        return 'default';
    }
  };

  const openCommentModal = (content: string, contactName: string) => {
    setViewCommentContent(content);
    setViewCommentTitle(`Nội dung liên hệ từ: ${contactName}`);
    setOpenViewCommentModal(true);
  };

  const columns: ColumnsType<Contact> = [
    {
      title: 'STT',
      key: 'index',
      width: 60,
      render: (_text, _record, index) => (page - 1) * pageSize + index + 1,
    },
    {
      title: 'Tên người gửi',
      dataIndex: 'name',
      key: 'name',
      sorter: (a, b) => a.name.localeCompare(b.name),
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: 'Số điện thoại',
      dataIndex: 'phone',
      key: 'phone',
      render: (text) => text || 'N/A',
    },
    
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      render: (status: ContactStatus, record: Contact) => (
        <Select
          value={status}
          style={{ width: 120 }}
          onChange={(value) => handleStatusChange(record.id, value, record.name)}
          disabled={isUpdating}
          size="small"
        >
          <Option value={ContactStatus.PENDING}>
            <Tag color="orange">Đang chờ</Tag>
          </Option>
          <Option value={ContactStatus.PROCESSING}>
            <Tag color="blue">Đang xử lý</Tag>
          </Option>
          <Option value={ContactStatus.COMPLETED}>
            <Tag color="green">Hoàn thành</Tag>
          </Option>
          <Option value={ContactStatus.FAILED}>
            <Tag color="red">Thất bại</Tag>
          </Option>
        </Select>
      ),
      filters: Object.values(ContactStatus).map((status) => ({
        text: getStatusText(status),
        value: status,
      })),
      onFilter: (value, record) => record.status === value,
    },
    {
      title: 'Nội dung',
      dataIndex: 'message',
      key: 'message',
      width: 100,
      render: (text: string, record) => (
        <Space>
          <Tooltip title="Xem chi tiết nội dung">
            <EyeOutlined
              style={{ cursor: 'pointer', color: '#1890ff' }}
              onClick={() => openCommentModal(text, record.name)}
            />
          </Tooltip>
        </Space>
      ),
    },
    {
      title: 'Ngày gửi',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (date: string) => moment(date).format('DD/MM/YYYY HH:mm'),
      sorter: (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
    },
    {
      title: 'Hành động',
      key: 'action',
      width: 60,
      render: (_, record) => (
        <Space size="middle">
          <Tooltip title="Xóa">
            <DeleteOutlined
              style={{ color: 'red', cursor: 'pointer' }}
              onClick={() => confirmDelete(record.id, record.name)}
            />
          </Tooltip>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Input
            placeholder="Tìm kiếm liên hệ..."
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onPressEnter={handleSearch}
            allowClear
            className="w-[300px]"
          />
          <Button type="primary" onClick={handleSearch}>
            <SearchOutlined /> Tìm kiếm
          </Button>
        </div>
      </div>

      <Table
        columns={columns}
        dataSource={data?.data || []}
        rowKey="id"
        loading={isLoading || isDeleting || isUpdating}
        pagination={{
          total: data?.total,
          current: page,
          pageSize: pageSize,
          onChange: (p) => setPage(p),
          showTotal: (total) => `Tổng ${total} liên hệ`,
        }}
        onChange={handleTableChange}
        scroll={{ x: 'max-content' }}
      />

      {/* Modal hiển thị nội dung chi tiết */}
      <Modal
        title={viewCommentTitle}
        open={openViewCommentModal}
        onCancel={() => setOpenViewCommentModal(false)}
        footer={[
          <Button key="close" onClick={() => setOpenViewCommentModal(false)}>
            Đóng
          </Button>,
        ]}
      >
        <p style={{ whiteSpace: 'pre-wrap' }}>{viewCommentContent}</p>
      </Modal>
    </div>
  );
}