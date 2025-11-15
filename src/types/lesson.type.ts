// src/lessons/types/lesson.types.ts

export interface Lesson {
  id: number
  title: string
  content: string | null
  videoUrl: string | null
  order: number
  courseId: number
  totalViews: number
  durationMin: number | null
  createdAt: string
  updatedAt: string
  course?: any
  heygenVideos?: any[]
  stats?: {
    progressCount: number
    heygenVideoCount: number
  }
}

export interface LessonWithBasicRelations extends Lesson {
  course: {
    id: number
    title: string
    slug: string
    thumbnail?: string
    instructor?: {
      id: number
      name: string
      email: string
    }
  }
  _count?: {
    progress: number
    quizzes: number
    assignments: number
    heygenVideos: number
  }
}

export interface LessonWithFullRelations extends LessonWithBasicRelations {
  heygenVideos: {
    id: number
    videoId: string
    title: string
    status: string
    videoUrl: string | null
    thumbnailUrl: string | null
    duration: number | null
    createdAt: string
  }[]
  quizzes?: {
    id: number
    title: string
    description: string | null
    duration: number | null
    isPublished: boolean
    _count?: {
      questions: number
      attempts: number
    }
  }[]
  assignments?: {
    id: number
    title: string
    description: string | null
    dueDate: string | null
    maxScore: number | null
    isPublished: boolean
    _count?: {
      submissions: number
    }
  }[]
  progress?: {
    id: number
    userId: number
    completed: boolean
    completedAt: string | null
    user?: {
      id: number
      name: string
      email: string
    }
  }[]
}

// src/lessons/types/lesson.types.ts

export interface LessonResponse {
  success: boolean
  message: string
  data: LessonWithBasicRelations
}

export interface LessonDetailResponse {
  success: boolean
  message: string
  data: LessonWithFullRelations
}

export interface LessonListResponse {
  success: boolean
  message: string
  data: {
    data: LessonWithBasicRelations[]
    total: number
    page: number
    pageCount: number
  }
}

export interface LessonsByCourseResponse {
  success: boolean
  message: string
  data: LessonWithBasicRelations[]
}

export interface LessonStats {
  progressCount: number
  quizCount: number
  assignmentCount: number
  heygenVideoCount: number
  completionRate?: number
  averageWatchTime?: number
}

// src/lessons/types/lesson.types.ts

export interface CreateLessonRequest {
  title: string
  content?: string
  videoUrl?: string
  order?: number
  courseId: number
  durationMin?: number
}

export interface UpdateLessonRequest {
  title?: string
  content?: string
  videoUrl?: string
  order?: number
  courseId?: number
  durationMin?: number
}

export interface LessonQuery {
  page?: number
  limit?: number
  search?: string
  courseId?: number
  hasVideo?: boolean
  hasContent?: boolean
}

export interface ReorderLessonsRequest {
  lessons: Array<{
    id: number
    order: number
  }>
}

export interface ReorderLessonsResponse {
  success: boolean
  message: string
  data: LessonWithBasicRelations[]
}

// src/lessons/types/lesson.types.ts

export interface LessonProgress {
  lessonId: number
  completed: boolean
  completedAt: string | null
  watchTime?: number
  lastPosition?: number
}

export interface LessonNavigation {
  previousLesson?: {
    id: number
    title: string
    order: number
  }
  currentLesson: {
    id: number
    title: string
    order: number
  }
  nextLesson?: {
    id: number
    title: string
    order: number
  }
  courseProgress: {
    completedLessons: number
    totalLessons: number
    completionPercentage: number
  }
}

export interface LessonCompletionStats {
  totalStudents: number
  completedStudents: number
  completionPercentage: number
  averageCompletionTime?: number
}

// src/lessons/types/lesson.types.ts

export interface LessonWithProgress extends LessonWithBasicRelations {
  userProgress?: LessonProgress
  stats: LessonStats
}

export interface LessonBulkCreateRequest {
  lessons: Array<{
    title: string
    content?: string
    videoUrl?: string
    order?: number
    durationMin?: number
  }>
  courseId: number
}

export interface LessonBulkCreateResponse {
  success: boolean
  message: string
  data: {
    created: number
    failed: number
    lessons: LessonWithBasicRelations[]
    errors: Array<{
      lessonTitle: string
      error: string
    }>
  }
}

export interface LessonSearchResult {
  id: number
  title: string
  content: string | null
  course: {
    id: number
    title: string
    slug: string
  }
  relevance: number
}