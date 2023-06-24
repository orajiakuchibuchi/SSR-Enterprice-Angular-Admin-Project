import { Role } from "./Role";
import { App } from "./App";

export interface Menu {
    id: number;
    name: string;
    icon?: string;
    children: Menu[],
    link: undefined | string;
    roles: Role[],
    app_id: number
}