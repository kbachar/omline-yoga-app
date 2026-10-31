export interface EventData {
  id: string; 
  eventName: string;
  location: string;
  date: Date;
  time: string;
  link: string;
  imageUrl: string;
  description: string;
  approved: boolean;
  createDate?: Date;
  status: string;
  errorMessage: string;
}
