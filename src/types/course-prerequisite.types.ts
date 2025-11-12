import { CourseLevel } from "@/enums/course-level.enum"

export interface CoursePrerequisite {
  id: number
  courseId: number
  prerequisiteCourseId: number
  createdAt: string
  updatedAt: string
}

export interface CoursePrerequisiteWithRelations extends CoursePrerequisite {
  course: {
    id: number
    title: string
    slug: string
    thumbnail?: string
    level: CourseLevel
    instructor?: {
      id: number
      name: string
      email: string
    }
  }
  prerequisite: {
    id: number
    title: string
    slug: string
    thumbnail?: string
    level: CourseLevel
    instructor?: {
      id: number
      name: string
      email: string
    }
  }
}

export interface CoursePrerequisiteResponse {
  success: boolean
  message: string
  data: CoursePrerequisiteWithRelations
}

export interface CoursePrerequisiteListResponse {
  success: boolean
  message: string
  data: {
    data: CoursePrerequisiteWithRelations[]
    total: number
    page: number
    pageCount: number
  }
}

export interface CoursePrerequisitesByCourseResponse {
  success: boolean
  message: string
  data: {
    course: {
      id: number
      title: string
      slug: string
    }
    prerequisites: CoursePrerequisiteWithRelations[]
    stats: {
      totalPrerequisites: number
    }
  }
}

export interface RequiredByCoursesResponse {
  success: boolean
  message: string
  data: {
    prerequisiteCourse: {
      id: number
      title: string
      slug: string
    }
    requiredBy: CoursePrerequisiteWithRelations[]
    stats: {
      totalRequiredBy: number
    }
  }
}

export interface CreateCoursePrerequisiteRequest {
  courseId: number
  prerequisiteCourseId: number
}

export interface CreateCoursePrerequisitesRequest {
  courseId: number
  prerequisiteCourseIds: number[]
}

export interface UpdateCoursePrerequisiteRequest {
  courseId?: number
  prerequisiteCourseId?: number
}

export interface CoursePrerequisiteQuery {
  page?: number
  limit?: number
  courseId?: number
  prerequisiteCourseId?: number
}

export interface PrerequisiteChain {
  course: {
    id: number
    title: string
    slug: string
  }
  prerequisites: PrerequisiteChain[]
  depth: number
}

export interface CircularDependencyCheck {
  hasCircular: boolean
  path?: number[]
  message?: string
}

export interface PrerequisiteValidationResult {
  isValid: boolean
  errors: string[]
  circularDependencies: CircularDependencyCheck
}

export interface CoursePrerequisiteStats {
  totalPrerequisites: number
  totalRequiredBy: number
  maxDepth: number
  hasCircularDependencies: boolean
}
export interface DeleteCoursePrerequisiteResponse {
  success: boolean
  message: string
  data: null
}

export interface BulkCreatePrerequisitesResponse {
  success: boolean
  message: string
  data: {
    created: number
    skipped: number
    errors: Array<{
      prerequisiteCourseId: number
      error: string
    }>
  }
}
