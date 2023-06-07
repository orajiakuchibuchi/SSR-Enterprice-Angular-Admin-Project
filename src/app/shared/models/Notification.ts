export interface Notification {
    id: number;
    title: string;
    message: string;
    status: 'seen' | 'unseen';
    userID: number;
    created_at: string | Date;
    updated_at: string | Date;
}