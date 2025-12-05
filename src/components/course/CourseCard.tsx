'use client'

import { Card, Button, Tag, Rate, Avatar, Tooltip, Badge } from 'antd'
import { 
  EyeOutlined, 
  ShoppingCartOutlined, 
  UserOutlined, 
  BookOutlined, 
  ClockCircleOutlined,
  DollarOutlined,
  StarOutlined,
  FireOutlined,
  CheckCircleOutlined
} from '@ant-design/icons'
import { useRouter } from 'next/navigation'
import { Course } from '@/types/course.type'
import Image from 'next/image'

interface CourseCardProps {
  course: Course
  compact?: boolean
}

export default function CourseCard({ course, compact = false }: CourseCardProps) {
  const router = useRouter()

  const handleViewCourse = () => {
    router.push(`/courses/${course.id}`)
  }

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'BEGINNER': return 'green'
      case 'INTERMEDIATE': return 'blue'
      case 'ADVANCED': return 'red'
      default: return 'default'
    }
  }

  const getLevelLabel = (level: string) => {
    switch (level) {
      case 'BEGINNER': return 'Cơ bản'
      case 'INTERMEDIATE': return 'Trung cấp'
      case 'ADVANCED': return 'Nâng cao'
      default: return level
    }
  }

  const formatPrice = (price: number) => {
    if (price === 0) return 'Miễn phí'
    
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
      minimumFractionDigits: 0
    }).format(price)
  }

  const formatNumber = (num: number) => {
    if (num >= 1000) return `${(num / 1000).toFixed(1)}k`
    return num.toString()
  }

  return (
    <Card
      hoverable
      className="course-card !border-gray-200 !rounded-xl !overflow-hidden !shadow-sm hover:!shadow-lg transition-all duration-300"
      cover={
        <div className="relative h-48 bg-gray-100 overflow-hidden">
          {course.thumbnail ? (
            <img
              src={course.thumbnail}
              alt={course.title}
              className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-indigo-500 to-purple-600">
              <BookOutlined className="text-4xl text-white opacity-80" />
            </div>
          )}
          
          {/* Course level badge */}
          <div className="absolute top-3 left-3">
            <Tag color={getLevelColor(course.level)} className="!font-semibold">
              {getLevelLabel(course.level)}
            </Tag>
          </div>
          
          {/* Instructor */}
          <div className="absolute bottom-3 left-3">
            <div className="flex items-center bg-white/90 backdrop-blur-sm px-2 py-1 rounded-lg">
              <Avatar 
                size="small" 
                src={course.instructor?.avatar}
                icon={<UserOutlined />}
                className="!bg-indigo-100 !text-indigo-600"
              />
              <span className="ml-2 text-sm font-medium text-gray-700">
                {course.instructor?.name}
              </span>
            </div>
          </div>
          
          {/* Stats overlay */}
          <div className="absolute top-3 right-3 flex gap-1">
            {course.stats?.enrollmentCount && course.stats.enrollmentCount > 0 && (
              <Badge 
                count={formatNumber(course.stats.enrollmentCount)} 
                style={{ backgroundColor: '#1890ff' }}
                size="small"
              />
            )}
          </div>
        </div>
      }
      onClick={handleViewCourse}
    >
      <div className="space-y-3">
        {/* Course title and categories */}
        <div>
          <h3 className="font-bold text-lg text-gray-900 mb-2 line-clamp-2 hover:text-indigo-600">
            {course.title}
          </h3>
          
          <div className="flex flex-wrap gap-1 mb-2">
            {course.categories?.slice(0, 2).map((category) => (
              <Tag key={category.id} color="blue" className="!text-xs">
                {category.name}
              </Tag>
            ))}
            {course.categories && course.categories.length > 2 && (
              <Tooltip title={course.categories.slice(2).map(c => c.name).join(', ')}>
                <Tag className="!text-xs">+{course.categories.length - 2}</Tag>
              </Tooltip>
            )}
          </div>
          
          {/* Description */}
          {course.description && !compact && (
            <p className="text-gray-600 text-sm line-clamp-2 mb-3">
              {course.description}
            </p>
          )}
        </div>

        {/* Stats row */}
        <div className="flex items-center justify-between text-sm text-gray-500">
          <div className="flex items-center gap-4">
            {/* Lessons count */}
            <div className="flex items-center">
              <BookOutlined className="mr-1" />
              <span>{course.stats?.lessonCount || 0} bài học</span>
            </div>
            
            {/* Rating */}
            {course.stats?.reviewCount && course.stats.reviewCount > 0 && (
              <div className="flex items-center">
                <StarOutlined className="mr-1 text-yellow-500" />
                <span>4.5</span>
                <span className="ml-1">({course.stats.reviewCount})</span>
              </div>
            )}
          </div>
          
          {/* Views */}
          {course.totalViews && course.totalViews > 0 && (
            <div className="flex items-center">
              <EyeOutlined className="mr-1" />
              <span>{formatNumber(course.totalViews)}</span>
            </div>
          )}
        </div>

        {/* Price and action */}
        <div className="flex items-center justify-between pt-3 border-t border-gray-100">
          <div className="flex items-center">
            <span className={`text-xl font-bold ${course.price === 0 ? 'text-green-600' : 'text-orange-600'}`}>
              {formatPrice(course.price || 0)}
            </span>
            {course.price === 0 && (
              <Tag color="green" className="ml-2 !font-semibold">
                FREE
              </Tag>
            )}
          </div>
          
          <Button 
            type="primary" 
            size="small"
            onClick={(e) => {
              e.stopPropagation()
              handleViewCourse()
            }}
            icon={<EyeOutlined />}
            className="!bg-indigo-600 hover:!bg-indigo-700"
          >
            Xem chi tiết
          </Button>
        </div>
      </div>
    </Card>
  )
}