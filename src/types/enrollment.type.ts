// src/enrollments/types/enrollment.types.ts

export interface Enrollment {
  id: number
  userId: number
  courseId: number
  enrolledAt: string
  progress: number | null
  createdAt: string
  updatedAt: string
}

export interface EnrollmentWithBasicRelations extends Enrollment {
  user: {
    id: number
    name: string
    email: string
    avatar?: string
  }
  course: {
    id: number
    title: string
    slug: string
    thumbnail?: string
    level: string
    price: number | null
    instructor: {
      id: number
      name: string
      email: string
    }
    totalLessons: number
  }
}

export interface EnrollmentWithFullRelations extends EnrollmentWithBasicRelations {
  courseProgress?: {
    completedLessons: number
    totalLessons: number
    completionPercentage: number
    lastAccessed?: string
  }
  recentActivity?: {
    lessonId: number
    lessonTitle: string
    completedAt: string
  }[]
}

// src/enrollments/types/enrollment.types.ts

export interface EnrollmentResponse {
  success: boolean
  message: string
  data: EnrollmentWithBasicRelations
}

export interface EnrollmentDetailResponse {
  success: boolean
  message: string
  data: EnrollmentWithFullRelations
}

export interface EnrollmentListResponse {
  success: boolean
  message: string
  data: {
    data: EnrollmentWithBasicRelations[]
    total: number
    page: number
    pageCount: number
  }
}

export interface UserEnrollmentsResponse {
  success: boolean
  message: string
  data: EnrollmentWithBasicRelations[]
}

export interface CourseEnrollmentsResponse {
  success: boolean
  message: string
  data: EnrollmentWithBasicRelations[]
}

export interface CheckEnrollmentResponse {
  success: boolean
  message: string
  data: EnrollmentWithBasicRelations | null
}

export interface EnrollmentStats {
  totalEnrollments: number
  activeEnrollments: number
  completedEnrollments: number
  averageProgress: number
  enrollmentTrends?: {
    date: string
    enrollments: number
  }[]
}

export interface CreateEnrollmentRequest {
  userId: number
  courseId: number
  progress?: number
}

export interface UpdateEnrollmentRequest {
  progress?: number
}

export interface EnrollmentQuery {
  page?: number
  limit?: number
  userId?: number
  courseId?: number
  search?: string
  minProgress?: number
  maxProgress?: number
  sortBy?: 'enrolledAt' | 'progress' | 'userName' | 'courseTitle'
  sortOrder?: 'asc' | 'desc'
}

export interface BulkEnrollmentRequest {
  userIds: number[]
  courseId: number
}

export interface EnrollmentProgressUpdate {
  enrollmentId: number
  progress: number
  completedLessons: number
  totalLessons: number
}

export interface UserEnrollmentStats {
  userId: number
  totalEnrollments: number
  completedCourses: number
  inProgressCourses: number
  averageProgress: number
  totalLearningTime?: number
  favoriteCategories?: {
    categoryId: number
    categoryName: string
    enrollmentCount: number
  }[]
}

export interface CourseEnrollmentStats {
  courseId: number
  courseTitle: string
  totalEnrollments: number
  activeEnrollments: number
  completionRate: number
  averageProgress: number
  averageCompletionTime?: number
  enrollmentGrowth: {
    period: string
    growth: number
  }[]
}

export interface EnrollmentAnalytics {
  period: string
  totalEnrollments: number
  completedEnrollments: number
  averageProgress: number
  popularCourses: Array<{
    courseId: number
    courseTitle: string
    enrollmentCount: number
  }>
  userEngagement: {
    activeUsers: number
    averageProgress: number
    completionRate: number
  }
}

export interface EnrollmentTrend {
  date: string
  enrollments: number
  completions: number
  averageProgress: number
}

export interface EnrollmentValidation {
  isValid: boolean
  errors: string[]
  canEnroll: boolean
  prerequisitesCompleted?: boolean
  hasAccess?: boolean
}

export interface EnrollmentCompletionEvent {
  enrollmentId: number
  userId: number
  courseId: number
  completedAt: string
  progress: number
  totalLearningTime?: number
}

export interface EnrollmentBulkResult {
  success: boolean
  data?: {
    created: number
    failed: number
    enrollments: EnrollmentWithBasicRelations[]
    errors: Array<{
      userId: number
      error: string
    }>
  }
  error?: string
}

export interface EnrollmentWithProgress extends EnrollmentWithBasicRelations {
  progressDetail: {
    completedLessons: number
    totalLessons: number
    completionPercentage: number
    lastLessonCompleted?: string
    nextLesson?: {
      id: number
      title: string
      order: number
    }
  }
}
export interface DeleteEnrollmentResponse {
  success: boolean
  message: string
  data: null
}

export interface UpdateProgressResponse {
  success: boolean
  message: string
  data: EnrollmentWithBasicRelations
}