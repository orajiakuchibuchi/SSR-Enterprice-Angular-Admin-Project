import {Document} from './Document';

export interface JobPosition{
    id: any;
    title: string;
    code: string;
    description: string;
    job_type: string;
    created_at: string | Date;
    updated_at: string | Date;
    responsibility: string;
    base_earning: number;
    max_earning: number;
    promotable: boolean;
    department_id: string;
    commission: any;
    salary: any;
    working_hours: any;
    pay_type: any;
    required_documents: string[],
    optional_documents:string[]
}