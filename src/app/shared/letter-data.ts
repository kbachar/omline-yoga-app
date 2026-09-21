export interface LetterData {
    id: string;
    title: string;
    content: string;
    createdAt: Date;
    createdBy: string;
    updatedAt: Date;
    updatedBy: string;
    image: string;
    showLogo: boolean;
    sentTo: Array<{ name: string; email: string; date: Date }>;
}