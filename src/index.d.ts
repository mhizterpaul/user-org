export type User = {
    userId?: string;
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    phone?: string;
}

export type Org = {
    orgId?: string;
    name: string;
    description?: string;
}