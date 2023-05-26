import { Role } from "./Role";

export interface Menu {
    id: number;
    name: string;
    icon?: string;
    children: Menu[],
    link: undefined | string;
    roles: Role[]
}