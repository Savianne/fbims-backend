export interface IUser {
    name: string;
    avatar: string,
    email:string,
    UID: string,
    congregation: string,
    role: "admin" | "main admin"
}