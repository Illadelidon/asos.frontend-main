import "./style.css";
import ProfileDefaultHeader from "../default/ProfileDefaultHeader.tsx";
import DefaultSideBar from "../default/DefaultSideBar.tsx";
import {APP_ENV} from "../../../env";
import {useDispatch, useSelector} from "react-redux";
import {useEffect, useState} from "react";
import {Size, ViewProduct} from "../../../interfaces/user";
import http from "../../../http_common.ts";
import {FavoriteActionType} from "../../../store/slice/favoriteSlise.ts";
const FavoriteUser=()=>{

    const baseUrl = APP_ENV.BASE_URL;
    const items = useSelector((store: any) => store.favorite);
    const dispatch = useDispatch();

    const [array, setArray] = useState<number[]>([]);

    useEffect(() => {
        if(items.length > 0)
        {
            const productIds = items.map((item: any) => item);
            setArray(productIds);
        }
    }, [items]);


    const [productsGet, setProducts] = useState<ViewProduct[]>([]);

    useEffect(() => {

        if(array.length > 0)
        {
              http.post("api/Dashboard/ArrayFavorite", array)
                .then(resp => {
                    setProducts(resp.data);
                    console.log("Прийшли товари", resp.data);
                })
                .catch(err => {
                    console.error("Помилка при отриманні товарів", err);
                });
        }
    }, [array]);

    const deleteProductWithFavorite=(productId:number)=>{

        // Отримати поточний кошик з Local Storage
        const cart = JSON.parse(localStorage.getItem('cart') || '[]');

        // Видалити товар з кошика
        const updatedCart = cart.filter((item: any) => item !== productId);

        // Оновити Local Storage
        localStorage.setItem('cart', JSON.stringify(updatedCart));

        // Диспатч на видалення
        dispatch({
            type: FavoriteActionType.ADD_FAVORITE,
            payload: updatedCart,
        });
    };


    return(
        <>
            <div className="centered-div">
                <ProfileDefaultHeader backLink="/user-info"/>
            </div>

           <div className="main-container">
               <DefaultSideBar/>

               <div className="Second-Container">

              <div className="Just-text">
                   <p>favourites</p>
              </div>

                   {items.length>0 ?(

                   <div className="Carts-Container">

                       {productsGet.map((product)=>(

                       <div className="Cart-Favorite" key={product.id}>

                           <div className="Frame92">

                               <div className="Frame87">
                                   <img alt="" src={`${baseUrl}product/${product.imagePaths[0]}`} />
                               </div>

                               <div className="Frame91">

                                   <p className="Name-Favorite">{product.name}</p>

                                   <p className="Brand-Favorite">Brand: <span>{product.brand}</span></p>

                                   <p className="Brand-Favorite">Size: <span>{Size[product.size]}</span></p>

                                   <p className="Brand-Favorite">Color: <span>{product.color}</span></p>

                                   <p className="Price-Favorite">£{product.price}</p>

                               </div>

                           </div>

                           <div className="Frame96">

                               <button className="button-favorite" onClick={()=>{deleteProductWithFavorite(product.id)}}>
                                   <svg  xmlns="http://www.w3.org/2000/svg" width="49" height="48" viewBox="0 0 49 48" fill="none">
                                       <path id="click" d="M22.0621 2.53451C22.3843 1.66389 23.6157 1.66389 23.9379 2.53451L28.9175 15.9917C29.0188 16.2654 29.2346 16.4812 29.5083 16.5825L42.9655 21.5621C43.8361 21.8843 43.8361 23.1157 42.9655 23.4379L29.5083 28.4175C29.2346 28.5188 29.0188 28.7346 28.9175 29.0083L23.9379 42.4655C23.6157 43.3361 22.3843 43.3361 22.0621 42.4655L17.0825 29.0083C16.9812 28.7346 16.7654 28.5188 16.4917 28.4175L3.03451 23.4379C2.16389 23.1157 2.16389 21.8843 3.03451 21.5621L16.4917 16.5825C16.7654 16.4812 16.9812 16.2654 17.0825 15.9917L22.0621 2.53451Z" fill="#0D0D0D" stroke="#0D0D0D" strokeWidth="2"/>
                                   </svg>
                               </button>

                               <span>Remove</span>
                           </div>

                       </div>

                       ))}

                   </div>

                   ):(
                       <p></p>
                   )}
               </div>

           </div>
        </>
    )
}

export default FavoriteUser;