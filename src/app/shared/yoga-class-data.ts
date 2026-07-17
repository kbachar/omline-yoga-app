export interface YogaClassData {
  id: string | null; 
  title: string;
  teacherId?: string;
  classLength: string;
  description: string;
  difficulty: string;
  videoLink: string;
  yogaStyle: string;
  teacherName?: string;
  yogaStyleColor?: string;
  approved?: boolean;
  createDate?: Date
}
