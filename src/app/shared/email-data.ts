export interface EmailData {
    id: string;
    title: string;
    content: string;
    updatedAt: Date;
    updatedBy: string;
    read: boolean;
    from: string;
    recipients: string[];
}