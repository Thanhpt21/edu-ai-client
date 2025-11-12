import { CourseCategory } from "./course-category.type"

export interface Category {
  id: number
  name: string
  description: string | null
  createdAt: string
  updatedAt: string
  courses?: CourseCategory[] // Optional: include relations khi cần
}

export interface CategoryResponse {
  data: Category[]
  total: number
  page: number
  pageCount: number
}