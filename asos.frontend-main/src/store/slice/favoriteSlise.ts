export interface ICartItem
{
    id:number;
}

const initState: ICartItem[] =[];

export enum FavoriteActionType {
    ADD_FAVORITE = "ADD_ITEM_PRODUCT"
}

export const favoriteSlice = (state=initState, action: any): ICartItem[] => {
    switch(action.type)
    {
        case FavoriteActionType.ADD_FAVORITE: {

            return [...action.payload];
        }
    }

    return state;
}

export default favoriteSlice;