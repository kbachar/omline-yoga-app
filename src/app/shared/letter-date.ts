export interface LetterData {
    title: string;
    content: string;
    createdAt: Date;
    createdBy: string;
    updatedAt: Date;
    updatedBy: string;
    recipients: [];
    sent: boolean;
}