export interface IUserToken
{
    id:number,
    firstName: string,
    lastName: string,
    email: string,
    phoneNumber?: string,
    image:string,
    roles:string,
    birthday:string,
    country:number,
    town:string,
    address:string,
    postCode:number
}
export interface IAuthUser {
    isAuth: boolean
    user?: IUserToken
}

export enum AuthUserActionType {
    LOGIN_USER = "AUTH_LOGIN_USER",
    LOGOUT_USER = "AUTH_LOGOUT_USER",
    UPDATE_USER = "UPDATE_USER"
}