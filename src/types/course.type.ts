// src/courses/types/course.types.ts

import { CourseLevel, CourseLevelType } from "@/enums/course-level.enum"
export type SortByField = 'createdAt' | 'title' | 'price' | 'totalViews'
export type SortOrder = 'asc' | 'desc'
export type CourseLevelString = 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED'

export interface Course {
  id: number
  title: string
  slug: string
  description: string | null
  thumbnail: string | null
  level: CourseLevel
  price: number | null
  isPublished: boolean
  instructorId: number
  totalViews: number
  createdAt: string
  updatedAt: string

   instructor?: any
  categories?: any[]
  tags?: any[]
  prerequisites?: any[]
  requiredBy?: any[]
  lessons?: any[]
  stats?: {
    lessonCount: number
    enrollmentCount: number
    reviewCount: number
  }
}

export interface CourseWithBasicRelations extends Course {
  instructor: {
    id: number
    name: string
    email: string
    avatar?: string
  }
  categories: {
    category: {
      id: number
      name: string
      description: string | null
    }
  }[]
  tags: {
    tag: {
      id: number
      name: string
      description: string | null
    }
  }[]
  _count?: {
    lessons: number
    enrollments: number
    reviews: number
  }
}

export interface CourseWithFullRelations extends CourseWithBasicRelations {
  lessons: {
    id: number
    title: string
    order: number
    durationMin?: number
    videoUrl?: string
  }[]
  prerequisites: {
    prerequisite: {
      id: number
      title: string
      slug: string
      thumbnail?: string
    }
  }[]
  requiredBy: {
    course: {
      id: number
      title: string
      slug: string
      thumbnail?: string
    }
  }[]
  quizzes?: {
    id: number
    title: string
    description?: string
    questionCount: number
  }[]
  assignments?: {
    id: number
    title: string
    dueDate?: string
    maxScore?: number
  }[]
}

export interface CourseResponse {
  success: boolean
  message: string
  data: CourseWithBasicRelations
}

export interface CourseDetailResponse {
  success: boolean
  message: string
  data: CourseWithFullRelations
}

export interface CourseListResponse {
  success: boolean
  message: string
  data: {
    data: CourseWithBasicRelations[]
    total: number
    page: number
    pageCount: number
  }
}

export interface CourseStats {
  lessonCount: number
  enrollmentCount: number
  reviewCount: number
  completionRate?: number
  averageRating?: number
  totalDuration?: number
}

export interface CourseWithStats extends CourseWithBasicRelations {
  stats: CourseStats
}

export interface CreateCourseRequest {
  title: string
  slug: string
  description?: string
  thumbnail?: string
  level?: CourseLevel
  price?: number
  isPublished?: boolean
  instructorId: number
  categoryIds?: number[]
  tagIds?: number[]
  prerequisiteIds?: number[]
}

export interface UpdateCourseRequest {
  title?: string
  slug?: string
  description?: string
  thumbnail?: string
  level?: CourseLevel
  price?: number
  isPublished?: boolean
  instructorId?: number
  categoryIds?: number[]
  tagIds?: number[]
  prerequisiteIds?: number[]
}

export interface CourseQuery {
  page?: number
  limit?: number
  search?: string
  level?: CourseLevelType
  isPublished?: boolean
  instructorId?: number
  categoryId?: number
  tagId?: number
  sortBy?: SortByField
  sortOrder?: SortOrder
  minPrice?: number
  maxPrice?: number
}
export interface TogglePublishResponse {
  success: boolean
  message: string
  data: {
    id: number
    isPublished: boolean
  }
}

export interface CourseProgress {
  courseId: number
  completedLessons: number
  totalLessons: number
  completionPercentage: number
  lastAccessed?: string
  nextLesson?: {
    id: number
    title: string
    order: number
  }
}

export interface CourseInstructor {
  id: number
  name: string
  email: string
  avatar?: string
  bio?: string
  totalCourses?: number
  totalStudents?: number
}

export interface CourseReviewSummary {
  averageRating: number
  totalReviews: number
  ratingDistribution: {
    1: number
    2: number
    3: number
    4: number
    5: number
  }
}