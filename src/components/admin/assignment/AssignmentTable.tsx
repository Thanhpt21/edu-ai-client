// src/components/admin/assignment/AssignmentTable.tsx
'use client'

import { Table, Tag, Space, Tooltip, Input, Button, Modal, message, Select, DatePicker, Badge, Image, Spin } from 'antd'
import type { ColumnsType } from 'antd/es/table'
import { EditOutlined, DeleteOutlined, EyeOutlined, BookOutlined, PaperClipOutlined, UploadOutlined, CalendarOutlined, DownloadOutlined } from '@ant-design/icons'
import { useState, useEffect } from 'react'
import { useAssignments } from '@/hooks/assignment/useAssignments'
import { useDeleteAssignment } from '@/hooks/assignment/useDeleteAssignment'
import { useChangeAssignmentStatus } from '@/hooks/assignment/useChangeAssignmentStatus'
import { AssignmentCreateModal } from './AssignmentCreateModal'
import { AssignmentUpdateModal } from './AssignmentUpdateModal'
import { AssignmentDetailModal } from './AssignmentDetailModal'
import { useAllCourses } from '@/hooks/course/useAllCourses'
import { useLessonsByCourseId } from '@/hooks/lesson/useLessonsByCourseId' // Đổi hook này
import dayjs from 'dayjs'
import 'dayjs/locale/vi'
import relativeTime from 'dayjs/plugin/relativeTime'
import { 
  Assignment
} from '@/types/assignment.type'
import { Course } from '@/types/course.type'
import { Lesson } from '@/types/lesson.type'
import { AssignmentStatus, getAssignmentStatusColor, getAssignmentStatusLabel } from '@/enums/assignment-status.enum'
import { AssignmentFileType, getFileTypeIcon } from '@/enums/assignment-file-type.enum'

dayjs.locale('vi')
dayjs.extend(relativeTime)

const { Option } = Select
const { Search } = Input

interface AssignmentTableProps {
  courseId?: number
  lessonId?: number
}

export default function AssignmentTable({ courseId, lessonId }: AssignmentTableProps) {
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState('')
  const [courseFilter, setCourseFilter] = useState<number | ''>(courseId || '')
  const [lessonFilter, setLessonFilter] = useState<number | ''>(lessonId || '')
  const [statusFilter, setStatusFilter] = useState<AssignmentStatus | ''>('')
  const [openCreate, setOpenCreate] = useState(false)
  const [openUpdate, setOpenUpdate] = useState(false)
  const [openViewDetail, setOpenViewDetail] = useState(false)
  const [selectedAssignment, setSelectedAssignment] = useState<Assignment | null>(null)

  // Fetch data
  const { data, isLoading, refetch } = useAssignments({ 
    page, 
    limit: 10, 
    search,
    courseId: courseFilter || undefined,
    lessonId: lessonFilter || undefined,
    status: statusFilter || undefined
  })

  console.log("data", data)
  
  const { data: coursesData, isLoading: isLoadingCourses } = useAllCourses({ isPublished: true })
  
  // Sử dụng useLessonsByCourseId thay vì useAllLessons
  const { 
    data: lessonsData, 
    isLoading: isLoadingLessons,
    refetch: refetchLessons 
  } = useLessonsByCourseId(courseFilter || 0)
  
  const { mutateAsync: deleteAssignment } = useDeleteAssignment()
  const { mutateAsync: changeStatus } = useChangeAssignmentStatus()

  const assignments: Assignment[] = data?.data || []
  const total = data?.data?.total || 0

  // Filter lessons based on selected course
  const filteredLessons = courseFilter ? 
    (lessonsData || []) : []

  // Effect để refetch lessons khi courseFilter thay đổi
  useEffect(() => {
    if (courseFilter && refetchLessons) {
      refetchLessons()
    }
  }, [courseFilter, refetchLessons])

  const columns: ColumnsType<Assignment> = [
    {
      title: 'STT',
      key: 'index',
      width: 50,
      align: 'center',
      render: (_text, _record, index) => (page - 1) * 10 + index + 1,
    },
    {
      title: 'Tiêu đề',
      dataIndex: 'title',
      key: 'title',
      width: 200,
      ellipsis: true,
      render: (title: string, record: Assignment) => (
        <div className="flex flex-col">
          <span className="font-medium">{title}</span>
          {record.description && (
            <span className="text-xs text-gray-500 truncate">{record.description}</span>
          )}
        </div>
      ),
    },
    {
      title: 'Khóa học',
      dataIndex: 'course',
      key: 'course',
      width: 150,
      render: (course: Course | undefined) => (
        <div>
          {course ? (
            <div className="flex items-center gap-2">
              {course.thumbnail && (
                <Image
                  src={course.thumbnail}
                  alt={course.title}
                  width={24}
                  height={24}
                  className="object-cover rounded"
                />
              )}
              <Tag color="blue">{course.title}</Tag>
            </div>
          ) : (
            <span className="text-gray-400">Không có</span>
          )}
        </div>
      ),
    },
    {
      title: 'Bài học',
      dataIndex: 'lesson',
      key: 'lesson',
      width: 150,
      render: (lesson: Lesson | undefined) => (
        <div>
          {lesson ? (
            <Tag color="green">Bài {lesson.order}: {lesson.title}</Tag>
          ) : (
            <span className="text-gray-400">Không có</span>
          )}
        </div>
      ),
    },
    {
      title: 'File',
      dataIndex: 'fileUrl',
      key: 'file',
      width: 80,
      align: 'center',
      render: (fileUrl: string | null, record: Assignment) => {
        if (!fileUrl) {
          return (
            <Tooltip title="Không có file">
              <PaperClipOutlined style={{ color: '#d9d9d9', fontSize: 16 }} />
            </Tooltip>
          )
        }
        
        // Extract file type for icon
        const fileType = getFileTypeFromUrl(fileUrl)
        const icon = getFileTypeIcon(fileType as AssignmentFileType)
        
        return (
          <Tooltip title="Tải xuống file">
            <a href={fileUrl} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center">
              <span className="text-lg">{icon}</span>
            </a>
          </Tooltip>
        )
      },
    },
    {
      title: 'Hạn nộp',
      dataIndex: 'dueDate',
      key: 'dueDate',
      width: 120,
      render: (dueDate: string | null) => {
        if (!dueDate) return <span className="text-gray-400">Không có</span>
        
        const dueDateObj = dayjs(dueDate)
        const isOverdue = dueDateObj.isBefore(dayjs())
        const isToday = dueDateObj.isSame(dayjs(), 'day')
        
        return (
          <Tooltip title={dueDateObj.format('DD/MM/YYYY HH:mm')}>
            <div className={`flex items-center ${isOverdue ? 'text-red-500' : isToday ? 'text-orange-500' : 'text-gray-700'}`}>
              <CalendarOutlined className="mr-1" />
              <span className="text-xs">
                {isToday ? 'Hôm nay' : dueDateObj.fromNow()}
              </span>
            </div>
          </Tooltip>
        )
      },
    },
    {
      title: 'Điểm tối đa',
      dataIndex: 'maxScore',
      key: 'maxScore',
      width: 100,
      align: 'center',
      render: (maxScore: number) => (
        <Tag color="orange">{maxScore}</Tag>
      ),
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      width: 120,
      render: (status: AssignmentStatus) => {
        const label = getAssignmentStatusLabel(status)
        const color = getAssignmentStatusColor(status)
        return <Tag color={color}>{label}</Tag>
      },
    },
    {
      title: 'Bài nộp',
      dataIndex: 'stats',
      key: 'submissions',
      width: 120,
      render: (stats: Assignment['stats']) => {
        const total = stats?.totalSubmissions || 0
        const graded = stats?.gradedSubmissions || 0
        const average = stats?.averageScore || 0
        
        return (
          <div className="flex flex-col">
            <div className="flex items-center">
              <Badge 
                count={total}
                style={{ backgroundColor: total > 0 ? '#1890ff' : '#d9d9d9' }}
                className="mr-2"
              />
              <span className="text-xs text-gray-500">
                {graded}/{total} đã chấm
              </span>
            </div>
            {average > 0 && (
              <span className="text-xs text-green-600">
                ĐTB: {average.toFixed(1)}
              </span>
            )}
          </div>
        )
      },
    },
    {
      title: 'Hành động',
      key: 'action',
      width: 180,
      fixed: 'right',
      render: (_: any, record: Assignment) => (
        <Space size="small">
          {/* View submissions button */}
          <Tooltip title="Xem bài nộp">
            <Button 
              type="link" 
              size="small"
              icon={<EyeOutlined />}
              onClick={() => handleViewSubmissions(record)}
              className="!p-0 !h-auto"
            />
          </Tooltip>

          {/* Edit button */}
          <Tooltip title="Chỉnh sửa">
            <Button 
              type="link" 
              size="small"
              icon={<EditOutlined />}
              onClick={() => {
                setSelectedAssignment(record)
                setOpenUpdate(true)
              }}
              className="!p-0 !h-auto"
            />
          </Tooltip>

          {/* Delete button */}
          <Tooltip title="Xóa">
            <Button 
              type="link" 
              danger
              size="small"
              icon={<DeleteOutlined />}
              onClick={() => handleDeleteAssignment(record)}
              className="!p-0 !h-auto"
            />
          </Tooltip>

          {/* Status change buttons */}
          {record.status === AssignmentStatus.DRAFT && (
            <Tooltip title="Công bố">
              <Button 
                type="link" 
                size="small"
                onClick={() => handleChangeStatus(record.id, AssignmentStatus.PUBLISHED)}
                className="!p-0 !h-auto !text-green-600"
                icon={<UploadOutlined />}
              />
            </Tooltip>
          )}
          {record.status === AssignmentStatus.PUBLISHED && (
            <Tooltip title="Đóng bài tập">
              <Button 
                type="link" 
                size="small"
                onClick={() => handleChangeStatus(record.id, AssignmentStatus.CLOSED)}
                className="!p-0 !h-auto !text-red-500"
              >
                Đóng
              </Button>
            </Tooltip>
          )}
        </Space>
      ),
    },
  ]

  const handleChangeStatus = async (id: number, status: AssignmentStatus) => {
    try {
      await changeStatus({ id, status })
      message.success(`Đã thay đổi trạng thái thành ${getAssignmentStatusLabel(status)}`)
      refetch?.()
    } catch (error: any) {
      message.error(error?.response?.data?.message || 'Thay đổi trạng thái thất bại')
    }
  }

  const handleDeleteAssignment = (record: Assignment) => {
    Modal.confirm({
      title: 'Xác nhận xóa bài tập',
      content: (
        <div>
          <p>Bạn có chắc chắn muốn xóa bài tập "{record.title}" không?</p>
          {record.stats?.totalSubmissions && record.stats.totalSubmissions > 0 && (
            <p className="text-red-500 mt-1">
              ⚠️ Có {record.stats.totalSubmissions} bài nộp sẽ bị xóa!
            </p>
          )}
        </div>
      ),
      okText: 'Xóa',
      okType: 'danger',
      cancelText: 'Hủy',
      onOk: async () => {
        try {
          await deleteAssignment(record.id)
          message.success('Xóa bài tập thành công')
          refetch?.()
        } catch (error: any) {
          message.error(error?.response?.data?.message || 'Xóa thất bại')
        }
      },
    })
  }

  const handleViewSubmissions = (record: Assignment) => {
    setSelectedAssignment(record)
    setOpenViewDetail(true)
  }

  const handleSearch = (value: string) => {
    setPage(1)
    setSearch(value)
  }

  const handleResetFilters = () => {
    setSearch('')
    setCourseFilter(courseId || '')
    setLessonFilter(lessonId || '')
    setStatusFilter('')
    setPage(1)
  }

  const handleCourseChange = (courseId: number | '') => {
    setCourseFilter(courseId)
    setLessonFilter('') // Reset lesson filter when course changes
    setPage(1)
  }

  // Helper function to get file type from URL
  const getFileTypeFromUrl = (url: string): string => {
    const extension = url.split('.').pop()?.toLowerCase()
    const typeMap: Record<string, AssignmentFileType> = {
      'pdf': AssignmentFileType.PDF,
      'doc': AssignmentFileType.DOC,
      'docx': AssignmentFileType.DOCX,
      'xls': AssignmentFileType.XLS,
      'xlsx': AssignmentFileType.XLSX,
      'ppt': AssignmentFileType.PPT,
      'pptx': AssignmentFileType.PPTX,
      'txt': AssignmentFileType.TXT,
      'jpg': AssignmentFileType.JPG,
      'jpeg': AssignmentFileType.JPEG,
      'png': AssignmentFileType.PNG,
      'gif': AssignmentFileType.GIF,
      'zip': AssignmentFileType.ZIP,
      'rar': AssignmentFileType.RAR,
      '7z': AssignmentFileType.SEVENZ,
    }
    return typeMap[extension || ''] || AssignmentFileType.PDF
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2 flex-wrap">
          <Search
            placeholder="Tìm kiếm bài tập..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onSearch={handleSearch}
            allowClear
            className="w-[250px]"
          />

          {!courseId && (
            <Select
              placeholder="Chọn khóa học"
              value={courseFilter}
              onChange={handleCourseChange}
              allowClear
              showSearch
              optionFilterProp="children"
              className="w-[200px]"
              loading={isLoadingCourses}
            >
              {coursesData?.map((course: Course) => (
                <Option key={course.id} value={course.id}>
                  <div className="flex items-center gap-2">
                   
                    <span>{course.title}</span>
                  </div>
                </Option>
              ))}
            </Select>
          )}

          {!lessonId && (
            <Select
              placeholder="Chọn bài học"
              value={lessonFilter}
              onChange={(value) => {
                setLessonFilter(value)
                setPage(1)
              }}
              allowClear
              showSearch
              optionFilterProp="children"
              className="w-[200px]"
              loading={isLoadingLessons}
              disabled={!courseFilter}
              notFoundContent={courseFilter ? (
                <div className="py-2 text-center">
                  {isLoadingLessons ? (
                    <Spin size="small" />
                  ) : (
                    <span className="text-gray-400">Không có bài học nào</span>
                  )}
                </div>
              ) : (
                <div className="py-2 text-center text-gray-400">
                  Vui lòng chọn khóa học trước
                </div>
              )}
            >
              {filteredLessons.map((lesson: Lesson) => (
                <Option key={lesson.id} value={lesson.id}>
                  Bài {lesson.order}: {lesson.title}
                </Option>
              ))}
            </Select>
          )}

          <Select
            placeholder="Trạng thái"
            value={statusFilter}
            onChange={setStatusFilter}
            allowClear
            className="w-[130px]"
          >
            <Option value={AssignmentStatus.DRAFT}>{getAssignmentStatusLabel(AssignmentStatus.DRAFT)}</Option>
            <Option value={AssignmentStatus.PUBLISHED}>{getAssignmentStatusLabel(AssignmentStatus.PUBLISHED)}</Option>
            <Option value={AssignmentStatus.CLOSED}>{getAssignmentStatusLabel(AssignmentStatus.CLOSED)}</Option>
          </Select>

          <Button onClick={handleResetFilters}>
            Đặt lại
          </Button>
        </div>

        <Button 
          type="primary" 
          onClick={() => setOpenCreate(true)}
          icon={<BookOutlined />}
        >
          Tạo bài tập
        </Button>
      </div>

      <Table
        columns={columns}
        dataSource={assignments}
        rowKey="id"
        loading={isLoading}
        scroll={{ x: 1500 }}
        pagination={{
          total: total,
          current: page,
          pageSize: 10,
          onChange: (p) => setPage(p),
          showTotal: (total, range) => `${range[0]}-${range[1]} của ${total} bài tập`,
          showSizeChanger: false,
        }}
      />

      <AssignmentCreateModal
        open={openCreate}
        onClose={() => setOpenCreate(false)}
        refetch={refetch}
        defaultCourseId={courseId}
        defaultLessonId={lessonId}
      /> 

      <AssignmentUpdateModal
        open={openUpdate}
        onClose={() => setOpenUpdate(false)}
        assignment={selectedAssignment}
        refetch={refetch}
      />

      <AssignmentDetailModal
        open={openViewDetail}
        onClose={() => {
          setOpenViewDetail(false)
          setSelectedAssignment(null)
        }}
        assignment={selectedAssignment}
      />
    </div>
  )
}