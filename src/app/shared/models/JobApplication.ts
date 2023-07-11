import { File } from './File';

export interface JobApplication {
    firstName: string,
    lastName: string,
    country: string,
    phone: number,
    email: string,
    requiredUploads: any,
    optionalUploads: any,
    coverLetterTypeContent: any,
    referredBy: any,
    code: string,
    created_at: any,
    updated_at: any,
    opening_code: any,
    status: string,
    public_url: string,
    private_url: string,
    id: number,
    uploaded_at: any,
    uploads: File[]
}