// src/types/assignment.type.ts

import { AssignmentStatus } from '@/enums/assignment-status.enum'
import { CourseLevel } from '@/enums/course-level.enum'

export interface Assignment {
  id: number
  title: string
  description: string | null
  fileUrl: string | null
  dueDate: string | null
  maxScore: number
  courseId: number | null
  lessonId: number | null
  status: AssignmentStatus
  createdAt: string
  updatedAt: string
  
  // Relations (optional)
  course?: {
    id: number
    title: string
    slug: string
    thumbnail: string | null
    level: CourseLevel
    instructor?: {
      id: number
      name: string
      email: string
    }
  }
  
  lesson?: {
    id: number
    title: string
    order: number
    courseId: number
  }
  
  submissions?: AssignmentSubmission[]
  
  stats?: {
    totalSubmissions: number
    gradedSubmissions: number
    averageScore: number
  }
  
  _count?: {
    submissions: number
  }
}

export interface AssignmentSubmission {
  id: number
  assignmentId: number
  userId: number
  fileUrl: string | null
  content: string | null
  score: number | null
  feedback: string | null
  submittedAt: string | null
  gradedAt: string | null
  
  // Relations
  assignment?: Assignment
  user?: {
    id: number
    name: string
    email: string
    avatar: string | null
  }
}

export interface AssignmentQueryParams {
  page?: number
  limit?: number
  search?: string
  courseId?: number
  lessonId?: number
  status?: AssignmentStatus
  sortBy?: 'createdAt' | 'dueDate' | 'title' | 'maxScore'
  sortOrder?: 'asc' | 'desc'
}

export interface CreateAssignmentData {
  title: string
  description?: string
  fileUrl?: string
  dueDate?: string
  maxScore?: number
  courseId?: number | null
  lessonId?: number | null
  status?: AssignmentStatus
}

export interface UpdateAssignmentData {
  title?: string
  description?: string
  fileUrl?: string | null
  dueDate?: string | null
  maxScore?: number
  courseId?: number | null
  lessonId?: number | null
  status?: AssignmentStatus
}

export interface AssignmentStats {
  totalAssignments: number
  publishedAssignments: number
  draftAssignments: number
  closedAssignments: number
  totalSubmissions: number
  gradedSubmissions: number
  averageScore: number
  upcomingAssignments: number
  overdueAssignments: number
}



export interface AssignmentResponse {
  success: boolean
  message: string
  data: Assignment | Assignment[] | PaginatedAssignments | null
}

export interface PaginatedAssignments {
  data: Assignment[]
  total: number
  page: number
  limit: number
  pageCount: number
}

export interface AssignmentFilterOptions {
  courseId?: number
  lessonId?: number
  status?: AssignmentStatus
  search?: string
  fromDate?: string
  toDate?: string
  minScore?: number
  maxScore?: number
}