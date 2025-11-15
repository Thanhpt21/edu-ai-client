// src/types/tag.type.ts
import { CourseTag } from "./course-tag.type"

export interface Tag {
  id: number
  name: string
  description: string | null
  createdAt: string
  updatedAt: string
  courses?: CourseTag[] // Optional: include relations khi cần
}

// Interface cho API response với stats
export interface TagWithStats extends Omit<Tag, 'courses'> {
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
export interface TagListResponse {
  data: TagWithStats[]
  total: number
  page: number
  pageCount: number
}

// Interface cho detail response
export interface TagDetailResponse {
  data: TagWithStats
}