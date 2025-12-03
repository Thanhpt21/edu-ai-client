// src/types/course-category.type.ts
export interface CourseCategory {
  courseId: number
  categoryId: number
  createdAt: string
  updatedAt: string
  course: {
    id: number
    title: string
    slug: string
  }
}