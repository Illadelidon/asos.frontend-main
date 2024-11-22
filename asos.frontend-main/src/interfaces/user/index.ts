
export interface User {
    email: string;
    firstName: string;
    lastName: string;
    photo: string;
}
export interface ILocation {
    latitude: number;
    longitude: number;
}

export interface UserState {
    location: ILocation | null;
    user: User | null;
    token: string | null;
}

export interface LoginResponse {
    token: string;
}

export interface IChangePassword
{
    currentPassword:string;
    newPassword:string;
}

export enum Gender {
    Male = 1,
    Female = 2
}

// Size як enum
export enum Size {
    XS = 0,
    S = 1,
    M = 2,
    L = 3,
    XL = 4,
    XXL = 5,
    XXXL = 6
}

// Інтерфейс продукту
export interface ViewProduct {
    id: number;
    name: string;
    description: string;
    price: number;
    size: Size; // Використовуємо enum Size
    color: string;
    brand: string;
    category: string;
    gender: Gender; // Використовуємо enum Gender
    lookAfterMe: string;
    aboutMe: string;
    sizeAndFit: string;
    amount: number;
    imagePaths: string[];
}