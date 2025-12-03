// src/lesson-progress/types/lesson-progress.types.ts

export interface LessonProgress {
  id: number
  userId: number
  lessonId: number
  completed: boolean
  completedAt: string | null
  createdAt: string
  updatedAt: string
}

export interface LessonProgressWithRelations extends LessonProgress {
  user: {
    id: number
    name: string
    email: string
    avatar?: string
  }
  lesson: {
    id: number
    title: string
    order: number
    durationMin?: number
    videoUrl?: string
    course: {
      id: number
      title: string
      slug: string
      thumbnail?: string
    }
  }
}

// src/lesson-progress/types/lesson-progress.types.ts

export interface LessonProgressResponse {
  success: boolean
  message: string
  data: LessonProgressWithRelations
}

export interface LessonProgressListResponse {
  success: boolean
  message: string
  data: {
    data: LessonProgressWithRelations[]
    total: number
    page: number
    pageCount: number
  }
}

export interface UserLessonProgressResponse {
  success: boolean
  message: string
  data: LessonProgressWithRelations | null
}

export interface CourseProgressResponse {
  success: boolean
  message: string
  data: {
    course: {
      id: number
      title: string
      slug: string
      thumbnail?: string
    }
    progress: LessonProgressWithRelations[]
    stats: {
      totalLessons: number
      completedLessons: number
      completionPercentage: number
      totalDuration: number
      completedDuration: number
    }
  }
}

export interface BulkProgressResponse {
  success: boolean
  message: string
  data: {
    processed: number
    completed: number
    errors: Array<{
      lessonId: number
      error: string
    }>
  }
}

// src/lesson-progress/types/lesson-progress.types.ts

export interface CreateLessonProgressRequest {
  userId: number
  lessonId: number
  completed?: boolean
}

export interface UpdateLessonProgressRequest {
  completed?: boolean
}

export interface MarkLessonCompletedRequest {
  userId: number
  lessonId: number
}

export interface MarkLessonIncompleteRequest {
  userId: number
  lessonId: number
}

export interface LessonProgressQuery {
  page?: number
  limit?: number
  userId?: number
  lessonId?: number
  courseId?: number
  completed?: boolean
}

export interface BulkProgressUpdateRequest {
  userId: number
  lessonIds: number[]
  completed: boolean
}

// src/lesson-progress/types/lesson-progress.types.ts

export interface LessonProgressStats {
  totalStudents: number
  completedStudents: number
  completionPercentage: number
  averageCompletionTime?: number
  completionTrends?: {
    date: string
    completed: number
  }[]
}

export interface UserProgressOverview {
  userId: number
  totalCourses: number
  completedCourses: number
  totalLessons: number
  completedLessons: number
  overallCompletion: number
  recentActivity: {
    lessonId: number
    lessonTitle: string
    courseTitle: string
    completedAt: string
  }[]
}

export interface CourseProgressAnalytics {
  courseId: number
  courseTitle: string
  totalEnrollments: number
  totalCompletions: number
  completionRate: number
  averageTimeToComplete?: number
  lessonCompletionRates: Array<{
    lessonId: number
    lessonTitle: string
    completed: number
    total: number
    completionRate: number
  }>
}

export interface NextLessonRecommendation {
  nextLesson?: {
    id: number
    title: string
    order: number
    courseId: number
  }
  courseProgress: {
    completed: number
    total: number
    percentage: number
  }
  recommendedBecause: 'sequential' | 'popular' | 'recent'
}
// src/lesson-progress/types/lesson-progress.types.ts

export interface ProgressSyncResult {
  success: boolean
  data?: LessonProgressWithRelations
  error?: string
}

export interface ProgressValidation {
  isValid: boolean
  errors: string[]
  canComplete: boolean
  prerequisitesCompleted?: boolean
}

export interface LessonCompletionEvent {
  userId: number
  lessonId: number
  courseId: number
  completedAt: string
  totalLessons: number
  completedLessons: number
  isCourseCompleted: boolean
}
export interface DeleteProgressResponse {
  success: boolean
  message: string
  data: null
}

export interface ProgressSummary {
  userId: number
  lessonId: number
  completed: boolean
  completedAt: string | null
  lessonTitle: string
  courseTitle: string
  courseId: number
}
