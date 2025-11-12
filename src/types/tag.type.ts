import { CourseTag } from "./course-tag.type"

export interface Tag {
  id: number
  name: string
  description: string | null
  createdAt: string
  updatedAt: string
  courses?: CourseTag[] // Optional: include relations khi cần
}

export interface TagResponse {
  data: Tag[]
  total: number
  page: number
  pageCount: number
}