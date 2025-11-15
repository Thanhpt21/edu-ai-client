// src/types/category.type.ts
import { CourseCategory } from "./course-category.type"

export interface Category {
  id: number
  name: string
  description: string | null
  createdAt: string
  updatedAt: string
  courses?: CourseCategory[] // Optional: include relations khi cần
}

// Interface cho API response với stats
export interface CategoryWithStats extends Omit<Category, 'courses'> {
  courseCount: number
  courses?: Array<{
    course: {
      id: number
      title: string
      slug: string
      thumbnail?: string
      description?: string
      level?: string
      price?: number
      isPublished?: boolean
      instructor?: {
        id: number
        name: string
        email: string
      }
    }
  }>
}

// Interface cho list response
export interface CategoryListResponse {
  data: CategoryWithStats[]
  total: number
  page: number
  pageCount: number
}

// Interface cho detail response
export interface CategoryDetailResponse {
  data: CategoryWithStats
}