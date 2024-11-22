export interface IOrderProduct{
    productId:number;
    count:number;
    price: number;
    amount:number;
}

export enum OrderActionType {
    ADD_Order = "ADD_ITEM_ORDER"
}

const initState: IOrderProduct[] =[];
export const orderSlice = (state=initState, action: any): IOrderProduct[] => {

    switch(action.type)
    {
        case OrderActionType.ADD_Order: {

            return [...action.payload];
        }
    }

    return state;
}

export default orderSlice;