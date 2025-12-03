// src/enums/assignment-status.enum.ts
export enum AssignmentStatus {
  DRAFT = 'DRAFT',
  PUBLISHED = 'PUBLISHED',
  CLOSED = 'CLOSED'
}

// Helper function để lấy label của status
export function getAssignmentStatusLabel(status: AssignmentStatus): string {
  const labels: Record<AssignmentStatus, string> = {
    [AssignmentStatus.DRAFT]: 'Nháp',
    [AssignmentStatus.PUBLISHED]: 'Đã công bố',
    [AssignmentStatus.CLOSED]: 'Đã đóng'
  }
  return labels[status] || status
}

// Helper function để lấy color của status
export function getAssignmentStatusColor(status: AssignmentStatus): string {
  const colors: Record<AssignmentStatus, string> = {
    [AssignmentStatus.DRAFT]: 'orange',
    [AssignmentStatus.PUBLISHED]: 'green',
    [AssignmentStatus.CLOSED]: 'red'
  }
  return colors[status] || 'default'
}