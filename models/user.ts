export interface User {
    id: number;
    name: string;
    email: string;
    password_hash: string;
    photo_url?: string;
    points?: number;
    level?: number;
    created_at: string;
    bio?: string;
}