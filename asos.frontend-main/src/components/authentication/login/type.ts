import {IOrderProduct} from "../../../store/slice/orderSlice.tsx";

export interface LoginResponse {
    token: string;
    baskets?: number[]; // Масив ID продуктів у кошику
}

export interface GoogleLoginRequest {
    credential: string;
    baskets: number[];
    orders:IOrderProduct[]|null;
}

export interface ILoginPage
{
    email:string;
    password:string;
    baskets:number[];
    orders:IOrderProduct[];
}

export interface ILoginPageError
{
    isSuccess:boolean;
    error:string;
    token:string;
    baskets:[];
}

export interface IValidLogin
{
    propertyName:string,
    errorMessage:string;
}

export interface IUser
{
    id:number,
    firstName: string,
    lastName: string,
    email: string,
    phoneNumber?: string,
    image:string,
    roles:string,
    birthday:string;
    lockoutEnabled:boolean
}
