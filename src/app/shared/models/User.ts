export interface User {
    id?: number;
    firstName?: string;
    lastName?: string;
    phone?: number;
    country?: string;
    email: string;
    password?: string;
    authToken?: string;
    status?: string;
    role?: string[];
}