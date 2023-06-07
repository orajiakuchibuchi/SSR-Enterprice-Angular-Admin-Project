export interface Plan {
    id: number;
    name: string;
    suggestion: string;
    amount: number;
    icon:string;
    features: string[];
    created_at: string | Date;
    updated_at: string | Date;
}
