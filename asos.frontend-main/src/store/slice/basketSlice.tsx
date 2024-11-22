export interface ICartItem {
    productId: number;
}

const initState: ICartItem[] = [];

export enum BasketActionType {
    ADD_Basket = "ADD_ITEM_BASKET"
}
export const basketSlice = (state=initState, action: any): ICartItem[] => {
    switch(action.type)
    {
        case BasketActionType.ADD_Basket: {

            return [...action.payload];
        }
    }

    return state;
}

export default basketSlice;
