// course-level.enum.ts
export const CourseLevel = {
  BEGINNER: 'beginner',
  INTERMEDIATE: 'intermediate', 
  ADVANCED: 'advanced'
} as const;

export type CourseLevel = typeof CourseLevel[keyof typeof CourseLevel];

export const CourseLevelDisplay = {
  [CourseLevel.BEGINNER]: 'Cơ bản',
  [CourseLevel.INTERMEDIATE]: 'Trung cấp', 
  [CourseLevel.ADVANCED]: 'Nâng cao'
} as const;

export const CourseLevelValues = Object.values(CourseLevel);

export const isValidCourseLevel = (level: string): level is CourseLevel => {
  return CourseLevelValues.includes(level as CourseLevel);
};