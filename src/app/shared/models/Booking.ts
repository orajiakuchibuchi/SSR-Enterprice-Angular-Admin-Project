import { User } from "./User";

export interface Booking {
    id: number;
    country: string;
    status: string;
    name: string;
    postal: string;
    start: Date | string;
    end: Date | string;
    description: string;
    frequency: string;
    color: string;
    date:string;
    icon: string;
    extra_service: string[] | string;
    cleaner: number | null;
    pricing: number | null;
    payment: any;
    user:User;
    created_at: string | Date;
    updated_at: string | Date;
}