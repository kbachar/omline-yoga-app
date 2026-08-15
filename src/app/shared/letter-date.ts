export interface LetterData {
    id: string;
    title: string;
    content: string;
    createdAt: Date;
    createdBy: string;
    updatedAt: Date;
    updatedBy: string;
    recipients: Array<{ name: string; email: string; date: Date }>;
    sent: boolean;
    image: string;
    showLogo: boolean;
}