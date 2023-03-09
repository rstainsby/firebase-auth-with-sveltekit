export interface User {
    uid: string,
    expiry_time: number,
    email: string | undefined,
    phone_number: string | undefined,
    roles: string[];
}