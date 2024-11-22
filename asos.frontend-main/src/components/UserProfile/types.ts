
export interface IEditUser
{
    id:number,
    firstName: string,
    lastName: string,
    email: string,
    image:string,
    birthday:string;
}

export interface IEditAddressUser
{
    id:number,
    firstName: string,
    lastName: string,
    phoneNumber?: string,
    country:number,
    town:string,
    address:string,
    postCode:number
}