'use client'

import { useState, useEffect } from 'react'
import { 
  Grid, 
  Button, 
  Input, 
  Select, 
  Spin, 
  Empty, 
  Pagination
} from 'antd'
import { 
  SearchOutlined, 
  EyeOutlined,
  UserOutlined,
  ClockCircleOutlined,
  DollarOutlined,
  FireOutlined
} from '@ant-design/icons'
import { useRouter } from 'next/navigation'
import { useCourses } from '@/hooks/course/useCourses'
import { Course } from '@/types/course.type'
import { CourseLevelString, SortByField, SortOrder } from '@/types/course.type'
import CourseCard from '@/components/course/CourseCard'
import CourseFilters from '@/components/course/CourseFilters'

const { Search } = Input
const { Option } = Select
const { useBreakpoint } = Grid

export default function CoursesPage() {
  const router = useRouter()
  const screens = useBreakpoint()
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState('')
  const [levelFilter, setLevelFilter] = useState<CourseLevelString | ''>('')
  const [categoryFilter, setCategoryFilter] = useState<number>()
  const [instructorFilter, setInstructorFilter] = useState<number>()
  const [sortBy, setSortBy] = useState<SortByField>('createdAt')
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc')
  const [priceFilter, setPriceFilter] = useState<string>('')

  // Hàm xử lý price filter để chuyển thành minPrice, maxPrice
  const getPriceRangeFromFilter = (priceFilter: string) => {
    if (!priceFilter) return {}
    
    switch (priceFilter) {
      case 'free':
        return { minPrice: 0, maxPrice: 0 }
      case '0-50000':
        return { minPrice: 0, maxPrice: 50000 }
      case '50000-200000':
        return { minPrice: 50000, maxPrice: 200000 }
      case '200000-500000':
        return { minPrice: 200000, maxPrice: 500000 }
      case '500000-':
        return { minPrice: 500000 }
      default:
        return {}
    }
  }

  const priceRange = getPriceRangeFromFilter(priceFilter)

  const { data, isLoading, refetch } = useCourses({
    page,
    limit: 12,
    search,
    level: levelFilter || undefined,
    categoryId: categoryFilter,
    instructorId: instructorFilter,
    isPublished: true,
    sortBy,
    sortOrder,
    minPrice: priceRange.minPrice,
    maxPrice: priceRange.maxPrice
  })

  const courses: Course[] = data?.data || []
  const total = data?.total || 0
  const pageCount = data?.pageCount || 1

  // Handle search with debounce
  useEffect(() => {
    const timer = setTimeout(() => {
      setPage(1)
      refetch?.()
    }, 500)
    
    return () => clearTimeout(timer)
  }, [search, levelFilter, categoryFilter, instructorFilter, priceFilter, sortBy, sortOrder, refetch])

  const handleSearch = (value: string) => {
    setSearch(value)
  }

  const handleResetFilters = () => {
    setSearch('')
    setLevelFilter('')
    setCategoryFilter(undefined)
    setInstructorFilter(undefined)
    setPriceFilter('')
    setSortBy('createdAt')
    setSortOrder('desc')
    setPage(1)
  }

  const getLevelColor = (level: CourseLevelString) => {
    switch (level) {
      case 'BEGINNER': return 'green'
      case 'INTERMEDIATE': return 'blue'
      case 'ADVANCED': return 'red'
      default: return 'default'
    }
  }

  const getLevelLabel = (level: CourseLevelString) => {
    switch (level) {
      case 'BEGINNER': return 'Cơ bản'
      case 'INTERMEDIATE': return 'Trung cấp'
      case 'ADVANCED': return 'Nâng cao'
      default: return level
    }
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
      minimumFractionDigits: 0
    }).format(price)
  }

  const sortOptions = [
    { value: 'createdAt_desc', label: 'Mới nhất', icon: <FireOutlined /> },
    { value: 'createdAt_asc', label: 'Cũ nhất', icon: <ClockCircleOutlined /> },
    { value: 'price_asc', label: 'Giá thấp', icon: <DollarOutlined /> },
    { value: 'price_desc', label: 'Giá cao', icon: <DollarOutlined /> },
    { value: 'totalViews_desc', label: 'Xem nhiều', icon: <EyeOutlined /> },
    { value: 'enrollmentCount_desc', label: 'Học viên nhiều', icon: <UserOutlined /> },
  ]

  const levelOptions: { value: CourseLevelString; label: string; color: string }[] = [
    { value: 'BEGINNER', label: 'Cơ bản', color: 'green' },
    { value: 'INTERMEDIATE', label: 'Trung cấp', color: 'blue' },
    { value: 'ADVANCED', label: 'Nâng cao', color: 'red' },
  ]

  const priceOptions = [
    { value: 'free', label: 'Miễn phí' },
    { value: '0-50000', label: 'Dưới 50k' },
    { value: '50000-200000', label: '50k - 200k' },
    { value: '200000-500000', label: '200k - 500k' },
    { value: '500000-', label: 'Trên 500k' },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
        <div className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Khám phá khóa học
            </h1>
            <p className="text-xl text-indigo-100 max-w-3xl mx-auto mb-8">
              Học mọi lúc, mọi nơi với hơn 500+ khóa học chất lượng từ các chuyên gia hàng đầu
            </p>
            
            <div className="max-w-3xl mx-auto">
              <Search
                placeholder="Tìm kiếm khóa học theo tên, mô tả..."
                size="large"
                enterButton={
                  <Button 
                    type="primary" 
                    icon={<SearchOutlined />}
                    className="!bg-white !text-indigo-600 hover:!bg-gray-100"
                  >
                    Tìm kiếm
                  </Button>
                }
                onSearch={handleSearch}
                onChange={(e) => setSearch(e.target.value)}
                value={search}
                className="mb-4"
              />
              
              <div className="flex flex-wrap gap-2 justify-center">
                {levelOptions.map((option) => (
                  <Button
                    key={option.value}
                    type={levelFilter === option.value ? 'primary' : 'default'}
                    className={levelFilter === option.value ? 
                      `!bg-white !text-${option.color}-600 border-0` : 
                      '!bg-white/20 !text-white hover:!bg-white/30 border-0'
                    }
                    onClick={() => setLevelFilter(levelFilter === option.value ? '' : option.value)}
                  >
                    {option.label}
                  </Button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Sidebar Filters */}
          <div className="lg:w-1/4">
            <CourseFilters
              levelFilter={levelFilter}
              setLevelFilter={setLevelFilter}
              priceFilter={priceFilter}
              setPriceFilter={setPriceFilter}
              sortBy={sortBy}
              sortOrder={sortOrder}
              setSortBy={setSortBy}
              setSortOrder={setSortOrder}
              onReset={handleResetFilters}
            />
          </div>

          {/* Course List */}
          <div className="lg:w-3/4">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">
                  {total} khóa học
                </h2>
                <p className="text-gray-600">
                  Khám phá các khóa học phù hợp với bạn
                </p>
              </div>
              
              <div className="flex items-center gap-2">
                <Select
                  value={`${sortBy}_${sortOrder}`}
                  onChange={(value) => {
                    const [sort, order] = value.split('_')
                    setSortBy(sort as SortByField)
                    setSortOrder(order as SortOrder)
                  }}
                  className="w-48"
                >
                  {sortOptions.map((option) => (
                    <Option key={option.value} value={option.value}>
                      <div className="flex items-center gap-2">
                        {option.icon}
                        <span>{option.label}</span>
                      </div>
                    </Option>
                  ))}
                </Select>
              </div>
            </div>

            {/* Course Grid */}
            {isLoading ? (
              <div className="flex justify-center items-center h-64">
                <Spin size="large" tip="Đang tải khóa học..." />
              </div>
            ) : courses.length === 0 ? (
              <Empty
                description={
                  <div className="text-center">
                    <div className="text-lg font-medium text-gray-900 mb-2">
                      Không tìm thấy khóa học phù hợp
                    </div>
                    <p className="text-gray-600 mb-4">
                      Thử thay đổi bộ lọc hoặc từ khóa tìm kiếm
                    </p>
                    <Button onClick={handleResetFilters}>
                      Xóa bộ lọc
                    </Button>
                  </div>
                }
                className="py-12"
              />
            ) : (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {courses.map((course) => (
                    <CourseCard key={course.id} course={course} />
                  ))}
                </div>

                {/* Pagination */}
                {pageCount > 1 && (
                  <div className="flex justify-center mt-8">
                    <Pagination
                      current={page}
                      total={total}
                      pageSize={12}
                      onChange={setPage}
                      showSizeChanger={false}
                      showTotal={(total, range) => 
                        `${range[0]}-${range[1]} của ${total} khóa học`
                      }
                      className="custom-pagination"
                    />
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}