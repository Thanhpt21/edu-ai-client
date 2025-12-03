'use client'

import { Modal, Table, Button, Input, Space, message, Tag, Transfer } from 'antd'
import { useEffect, useState, useMemo } from 'react'
import { useCourseEnrollments } from '@/hooks/enrollment/useCourseEnrollments'
import { useAllUsers } from '@/hooks/user/useAllUsers'
import { useCreateEnrollment } from '@/hooks/enrollment/useCreateEnrollment'
import { useDeleteEnrollment } from '@/hooks/enrollment/useDeleteEnrollment'
import { UserOutlined, SearchOutlined, SyncOutlined } from '@ant-design/icons'
import { User } from '@/types/user.type'

interface EnrollmentManagementModalProps {
  open: boolean
  onClose: () => void
  courseId: number
  courseTitle: string
}

export function EnrollmentManagementModal({
  open,
  onClose,
  courseId,
  courseTitle,
}: EnrollmentManagementModalProps) {
  const [searchText, setSearchText] = useState('')
  const [targetKeys, setTargetKeys] = useState<string[]>([])
  const [selectedKeys, setSelectedKeys] = useState<string[]>([])

  // Data fetching
  const { 
    data: enrollments = [], 
    isLoading: isLoadingEnrollments,
    refetch: refetchEnrollments 
  } = useCourseEnrollments(courseId)
  
  const { 
    data: allUsers = [], 
    isLoading: isLoadingUsers,
    refetch: refetchUsers 
  } = useAllUsers(searchText)

  const studentUsers = useMemo(() => {
    return allUsers.filter((user: User) => user.role === 'user')
  }, [allUsers])



  // Mutations
  const { mutateAsync: createEnrollment, isPending: isCreating } = useCreateEnrollment()
  const { mutateAsync: deleteEnrollment, isPending: isDeleting } = useDeleteEnrollment()

  // 1. Cập nhật targetKeys từ enrollments
  useEffect(() => {
    if (enrollments && enrollments.length > 0) {
      const keys = enrollments.map(enrollment => enrollment.user.id.toString())
      setTargetKeys(keys)
      console.log('Target keys updated:', keys)
    } else {
      setTargetKeys([])
      console.log('No enrollments, target keys cleared')
    }
  }, [enrollments])

  // 2. Tạo dataSource cho Transfer (TẤT CẢ users)
  const allUsersDataSource = useMemo(() => {
    return studentUsers.map((user: User) => ({
      key: user.id.toString(),
      title: user.name || user.email,
      email: user.email,
      description: user.email,
    }))
  }, [studentUsers])


  // 3. Xử lý thêm học viên
  const handleAddEnrollment = async (userId: number) => {
    try {
      await createEnrollment({
        userId,
        courseId,
        progress: 0,
      })
      message.success('Thêm học viên thành công')
      refetchEnrollments()
    } catch (error: any) {
      message.error(error?.response?.data?.message || 'Thêm học viên thất bại')
    }
  }

  // 4. Xử lý xóa học viên
  const handleRemoveEnrollment = async (userId: number) => {
    const enrollment = enrollments.find(e => e.user.id === userId)
    if (!enrollment) return

    try {
      await deleteEnrollment(enrollment.id)
      message.success('Xóa học viên thành công')
      refetchEnrollments()
    } catch (error: any) {
      message.error(error?.response?.data?.message || 'Xóa học viên thất bại')
    }
  }

  // 5. Xử lý transfer
  const handleTransferChange = (
    newTargetKeys: string[],
    direction: 'left' | 'right',
    moveKeys: string[]
  ) => {
    console.log('Transfer change:', { newTargetKeys, direction, moveKeys })
    
    if (direction === 'right') {
      // Thêm học viên
      moveKeys.forEach(async (key) => {
        await handleAddEnrollment(parseInt(key))
      })
    } else {
      // Xóa học viên
      moveKeys.forEach(async (key) => {
        await handleRemoveEnrollment(parseInt(key))
      })
    }
    
    // Cập nhật target keys ngay lập tức để UI phản hồi
    setTargetKeys(newTargetKeys)
  }

  // 6. Custom render item
  const renderItem = (item: any) => {
    return {
      label: (
        <div className="flex flex-col py-1">
          <span className="font-medium">{item.title}</span>
          <span className="text-xs text-gray-500">{item.email}</span>
        </div>
      ),
      value: `${item.title} (${item.email})`,
    }
  }

  // 7. Filter option
  const filterOption = (inputValue: string, item: any) => {
    const searchLower = inputValue.toLowerCase()
    return (
      (item.title || '').toLowerCase().includes(searchLower) ||
      item.email.toLowerCase().includes(searchLower)
    )
  }

  // 8. Columns cho table
  const enrolledColumns = [
    {
      title: 'Họ tên',
      key: 'name',
      render: (_: any, record: any) => (
        <div className="flex items-center gap-2">
          <UserOutlined style={{ color: '#1890ff' }} />
          <span>{record.user?.name || record.user?.email || 'N/A'}</span>
        </div>
      ),
    },
    {
      title: 'Email',
      key: 'email',
      render: (_: any, record: any) => record.user?.email || 'N/A',
    },
    {
      title: 'Tiến độ',
      dataIndex: 'progress',
      key: 'progress',
      render: (progress: number) => (
        <Tag color={progress === 100 ? 'success' : progress > 50 ? 'processing' : 'warning'}>
          {progress?.toFixed(1)}%
        </Tag>
      ),
    },
    {
      title: 'Ngày đăng ký',
      dataIndex: 'enrolledAt',
      key: 'enrolledAt',
      render: (date: string) => {
        if (!date) return 'N/A'
        return new Date(date).toLocaleDateString('vi-VN')
      },
    },
    {
      title: 'Hành động',
      key: 'action',
      render: (_: any, record: any) => (
        <Button
          type="link"
          danger
          size="small"
          loading={isDeleting}
          onClick={() => handleRemoveEnrollment(record.user.id)}
        >
          Xóa
        </Button>
      ),
    },
  ]

  return (
    <Modal
      title={
        <div className="flex items-center justify-between">
          <div>
            <span>Quản lý học viên: </span>
            <span className="font-semibold text-blue-600">{courseTitle}</span>
          </div>
          <Button 
            icon={<SyncOutlined />} 
            onClick={() => {
              refetchEnrollments()
              refetchUsers()
            }}
            loading={isLoadingEnrollments || isLoadingUsers}
          >
            Làm mới
          </Button>
        </div>
      }
      open={open}
      onCancel={onClose}
      footer={null}
      width={1200}
      className="max-w-[95vw]"
      destroyOnClose
    >
      <div className="space-y-6">
        {/* Transfer Component - QUAN TRỌNG: dùng ALL users làm dataSource */}
        <div className="p-4 bg-gray-50 rounded-lg">
          <h3 className="mb-4 font-medium text-gray-700">
            Thêm/Xóa học viên nhanh
          </h3>
          
          <div className="mb-3 p-2 bg-blue-50 rounded text-sm">
            <div className="flex gap-4">
              <span>👥 Đã tham gia khóa học: <strong>{targetKeys.length}</strong></span>
            </div>
          </div>
          
          <Transfer
            dataSource={allUsersDataSource}
            targetKeys={targetKeys}
            selectedKeys={selectedKeys}
            onChange={handleTransferChange}
            onSelectChange={(sourceSelectedKeys, targetSelectedKeys) => {
              setSelectedKeys([...sourceSelectedKeys, ...targetSelectedKeys])
            }}
            render={renderItem}
            titles={['Học viên chưa tham gia', 'Học viên đã tham gia']}
            listStyle={{
              width: 450,
              height: 400,
            }}
            showSearch
            filterOption={filterOption}
            operations={['Thêm vào khóa học', 'Xóa khỏi khóa học']}
            locale={{
              searchPlaceholder: 'Tìm theo tên hoặc email',
              itemUnit: 'học viên',
              itemsUnit: 'học viên',
              notFoundContent: 'Không tìm thấy học viên',
            }}
            disabled={isLoadingEnrollments || isLoadingUsers || isCreating || isDeleting}
          />
        </div>

        {/* Search */}
        <div className="flex items-center gap-4">
          <Input
            placeholder="Tìm kiếm học viên (cập nhật danh sách bên trên)..."
            prefix={<SearchOutlined />}
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            allowClear
            className="flex-1"
            onPressEnter={() => refetchUsers()}
          />
        </div>

        {/* Table hiển thị chi tiết */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-medium text-gray-700">
              Danh sách chi tiết học viên đã tham gia
            </h3>
            <span className="text-sm text-gray-500">
              {enrollments.length} học viên
            </span>
          </div>
          
          <Table
            columns={enrolledColumns}
            dataSource={enrollments}
            rowKey={(record) => record.user.id.toString()}
            loading={isLoadingEnrollments}
            locale={{ 
              emptyText: isLoadingEnrollments ? 'Đang tải...' : 'Chưa có học viên nào' 
            }}
            pagination={{
              pageSize: 5,
              showSizeChanger: true,
              showTotal: (total) => `Tổng ${total} học viên`,
            }}
            size="small"
            scroll={{ x: 800 }}
          />
        </div>

        {/* Footer */}
        <div className="flex justify-end pt-4 border-t">
          <Button onClick={onClose}>
            Đóng
          </Button>
        </div>
      </div>
    </Modal>
  )
}