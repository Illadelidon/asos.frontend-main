export interface GetProductByIdDto {
    id: number;
    name: string;
    description: string;
    price: number;
    size: string;
    color: string;
    brandName: string;
    categoryName: string;
    gender: string;
    sizeAndFit: string;
    lookAfterMe: string;
    aboutMe: string;
    amount: number;
    imageUrls: string[];
}

export interface IOrderItem{
    id: number,
    name: string;
    description: string;
    price: number;
    size:number;
    color:string;
    brand:string;
    category: string;
    gender:number;
    lookAfterMe:string;
    aboutMe:string;
    sizeAndFit:string;
    amount:number;
    imagePaths: string[];
}

export interface PagedResult<T> {
    items: T[];
    totalCount: number;
    pageSize: number;
    currentPage: number;
}

export interface OrderInformationDto {
    id: number;
    names: string[];
    status: string;
    totalPrice: number;
    imagePaths: string[];
}


export interface IOrderInformation{
    id:number,
    names:string[],
    status:string,
    totalPrice:number,
    imagePaths:string[]
}

export interface ICategoryName {
    id: number,
    name: string,
}
export interface IProductCreate {
    id: number,
    name: string;
    description: string;
    categoryId: number;
    price: number;
    size:number;
    color:string;
    brandId:number;
    SubCategoryId:number;
    gender:number;
    aboutMe:string;
    lookAfterMe:string;
    sizeAndFit:string;
    amount:number;
    imageUrls: File[];
    imageUrlsToRemove: string[];
}
export interface ICategoryCreate{
    Name:string;
}
export interface IGetAllCategory{
    id:number;
    name:string;
}
export interface IGetAllProducts{
    id: number,
    name: string;
    Description: string;
    categoryId: string;
    price: number;
    Size:number;
    color:string;
    brandId:string;
    SubCategoryId:number;
    Gender:number;
    AboutMe:string;
    LookAfterMe:string;
    SizeAndFit:string;
    Amount:number;
    imageUrls: File[];
}
export interface IUploadedFile {
    lastModified: number;
    lastModifiedDate: Date;
    name: string;
    originFileObj: File;
    percent: number;
    size: number;
    thumbUrl: string;
    type: string;
    uid: string;
}
export interface IBrandName {
    id: number,
    name: string,
}
export interface ISizeName {
    label: string;
    value: number;
}
export interface IGenderName {
    label: string;
    value: number;
}
export interface ISubCategoryName {
    id: number;
    categoryId: number;
    name: string;
}
export interface IProduct {
    id: number,
    Name: string;
    Description: string;
    CategoryId: number;
    Price: number;
    Size:number;
    Color:string;
    BrandId:number;
    SubCategoryId:number;
    Gender:number;
    AboutMe:string;
    LookAfterMe:string;
    SizeAndFit:string;
    Amount:number;
    ImageUrls: File[];
}
