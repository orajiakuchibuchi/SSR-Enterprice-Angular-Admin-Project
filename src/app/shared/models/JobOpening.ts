export interface JobOpening{
    id: any;
    title: string;
    code: string;
    info: string;
    position: any;
    views:number,
    applications:number,
    deadline: any;
    status: string;
    public_url: any;
    private_url: any;
    created_at: string | Date;
    updated_at: string | Date;
}