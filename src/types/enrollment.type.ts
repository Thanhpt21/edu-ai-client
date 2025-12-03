import { User } from './user.type'
import { Course } from './course.type'

export interface Enrollment {
  id: number
  userId: number
  courseId: number
  enrolledAt: string // ISO date string
  progress?: number
}

// Interface cho enrollment với relations
export interface EnrollmentWithDetails extends Enrollment {
  user: {
    id: number
    name: string
    email: string
    avatar?: string
    role: string // 👈 THÊM ROLE VÀO ĐÂY
    roles?: Array<{ // 👈 THÊM ROLES NẾU CÓ
      userId: number
      roleId: number
      role: {
        id: number
        name: string
        description?: string
      }
    }>
  }
  course: {
    id: number
    title: string
    slug: string
    thumbnail?: string
    level: string
    price: number
    totalLessons: number
    instructor: {
      id: number
      name: string
      email: string
    }
  }
}

// Interface cho list response
export interface EnrollmentListResponse {
  data: EnrollmentWithDetails[]
  total: number
  page: number
  pageCount: number
}

// Interface cho enrollment stats
export interface EnrollmentStats {
  total: number
  completed: number
  inProgress: number
  averageProgress: number
}

// Interface cho pagination params
export interface EnrollmentQueryParams {
  page?: number
  limit?: number
  userId?: number
  courseId?: number
  search?: string
}

// Interface cho create enrollment
export interface CreateEnrollmentData {
  userId: number
  courseId: number
  progress?: number
}

// Interface cho update enrollment
export interface UpdateEnrollmentData {
  progress?: number
}

// Interface cho enrollment check
export interface EnrollmentCheckResponse {
  isEnrolled: boolean
  enrollment?: EnrollmentWithDetails
}