// src/enums/assignment-file-type.enum.ts
export enum AssignmentFileType {
  PDF = 'application/pdf',
  DOC = 'application/msword',
  DOCX = 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  XLS = 'application/vnd.ms-excel',
  XLSX = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  PPT = 'application/vnd.ms-powerpoint',
  PPTX = 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
  TXT = 'text/plain',
  JPEG = 'image/jpeg',
  JPG = 'image/jpeg',
  PNG = 'image/png',
  GIF = 'image/gif',
  ZIP = 'application/zip',
  RAR = 'application/x-rar-compressed',
  SEVENZ = 'application/x-7z-compressed'
}

// Helper function để lấy file extension
export function getFileExtension(fileType: AssignmentFileType): string {
  const extensions: Record<AssignmentFileType, string> = {
    [AssignmentFileType.PDF]: 'pdf',
    [AssignmentFileType.DOC]: 'doc',
    [AssignmentFileType.DOCX]: 'docx',
    [AssignmentFileType.XLS]: 'xls',
    [AssignmentFileType.XLSX]: 'xlsx',
    [AssignmentFileType.PPT]: 'ppt',
    [AssignmentFileType.PPTX]: 'pptx',
    [AssignmentFileType.TXT]: 'txt',
    [AssignmentFileType.JPEG]: 'jpg',
    [AssignmentFileType.PNG]: 'png',
    [AssignmentFileType.GIF]: 'gif',
    [AssignmentFileType.ZIP]: 'zip',
    [AssignmentFileType.RAR]: 'rar',
    [AssignmentFileType.SEVENZ]: '7z'
  }
  return extensions[fileType] || 'unknown'
}

// Helper function để lấy icon cho file type
export function getFileTypeIcon(fileType: AssignmentFileType): string {
  const icons: Record<AssignmentFileType, string> = {
    [AssignmentFileType.PDF]: '📕',
    [AssignmentFileType.DOC]: '📄',
    [AssignmentFileType.DOCX]: '📄',
    [AssignmentFileType.XLS]: '📊',
    [AssignmentFileType.XLSX]: '📊',
    [AssignmentFileType.PPT]: '📽️',
    [AssignmentFileType.PPTX]: '📽️',
    [AssignmentFileType.TXT]: '📝',
    [AssignmentFileType.JPEG]: '🖼️',
    [AssignmentFileType.PNG]: '🖼️',
    [AssignmentFileType.GIF]: '🖼️',
    [AssignmentFileType.ZIP]: '📦',
    [AssignmentFileType.RAR]: '📦',
    [AssignmentFileType.SEVENZ]: '📦'
  }
  return icons[fileType] || '📎'
}

// Helper function để kiểm tra file type
export function isAcceptedFileType(mimeType: string): boolean {
  const acceptedTypes = Object.values(AssignmentFileType)
  return acceptedTypes.includes(mimeType as AssignmentFileType)
}

// Max file size
export const MAX_ASSIGNMENT_FILE_SIZE = 50 * 1024 * 1024 // 50MB