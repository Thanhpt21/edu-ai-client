export interface CourseTag {
  courseId: number
  tagId: number
  createdAt: string
  updatedAt: string
  course: {
    id: number
    title: string
    slug: string
  }
}