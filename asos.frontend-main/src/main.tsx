import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import {BrowserRouter} from 'react-router-dom'
import setAuthToken from "./helpers/setAuthToken.ts";
import {GoogleOAuthProvider} from "@react-oauth/google";
import {GOOGLE_CLIENT_ID} from "./utils/getEnvData.ts";
import {Provider} from "react-redux";
import {store} from "./store";
import {IUser} from "./components/authentication/login/type.ts";
import {jwtDecode} from "jwt-decode";
import {AuthUserActionType} from "./components/authentication/type.ts";
import {FavoriteActionType} from "./store/slice/favoriteSlise.ts";
import {BasketActionType} from "./store/slice/basketSlice.tsx";
import {OrderActionType} from "./store/slice/orderSlice.tsx";


// Якщо сторінка перезавантажується на F5, то токен знову перезаписується
if(localStorage.token)
{
    setAuthToken(localStorage.token);
    const user = jwtDecode<IUser>(localStorage.token);
    store.dispatch({type: AuthUserActionType.LOGIN_USER, payload: user});
}

if(localStorage.cart)
{
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');

    store.dispatch({
        type:FavoriteActionType.ADD_FAVORITE,
        payload:cart
    });
}

if(localStorage.basket)
{
    const products = JSON.parse(localStorage.getItem('basket') || '[]');

    store.dispatch({
        type:BasketActionType.ADD_Basket,
        payload:products
    });
}

if(localStorage.order)
{
    const orders = JSON.parse(localStorage.getItem('order') || '[]');

    store.dispatch({
        type:OrderActionType.ADD_Order,
        payload:orders
    });
}


ReactDOM.createRoot(document.getElementById('root')!).render(
   <>
       <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
       <Provider store={store}>
           <BrowserRouter>
               <App />
           </BrowserRouter>
       </Provider>
   </GoogleOAuthProvider>
   </>
)
