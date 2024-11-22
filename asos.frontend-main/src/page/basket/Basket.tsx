import "./style.css";
import {Link} from "react-router-dom";
import {useEffect, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../../store";
import http from "../../http_common.ts";
import {Size, ViewProduct} from "../../interfaces/user";
import {APP_ENV} from "../../env";
import {BasketActionType} from "../../store/slice/basketSlice.tsx";
import {IOrderProduct, OrderActionType} from "../../store/slice/orderSlice.tsx";


const Basket=()=>{

    const baseUrl = APP_ENV.BASE_URL;
    const dispatch = useDispatch();
    const userStatus = useSelector((state:RootState) => state.auth.isAuth);

    const basket = useSelector((state:RootState) => state.basket);

    const [array, setArray] = useState<number[]>([]);

    const [productGet, productSet] = useState<ViewProduct[]>([]);

    // Використовуємо об'єкт для кількості товарів, де ключ - productId
    const [quantities, setQuantities] = useState<{ [key: number]: number }>({});

    const [flag, setFlag]=useState<boolean>(true);

    useEffect(() => {

        if(basket.length > 0)
        {
            // @ts-ignore
            const productIds = basket.map((item:any) => item);
            setArray(productIds);

            console.log("Ця функція діє?",  productIds);
        }
    }, [basket]);

    useEffect(() => {

        if(array.length>0 && userStatus)
        {
            http.post("api/Basket/GetBasketItems", array).then(resp=>{

                productSet(resp.data);

                console.error("Спрацювало №1", resp.data);

                // Ініціалізуємо кількості для кожного продукту
                const initialQuantities: { [key: number]: number } = {};

                //@ts-ignore
                resp.data.forEach((product: any) => {
                    initialQuantities[product.id] = 1; // або інше значення за замовчуванням
                });
                setQuantities(initialQuantities);

            }).catch(err => {
                console.error("Помилка при отриманні товарів", err);
            });
        }
        else if(array.length>0 && !userStatus)
        {
            http.post("api/Basket/GetBasketItemLogout", array).then(resp=>{

                productSet(resp.data);

                console.error("Спрацювало №2", resp.data);

                // Ініціалізуємо кількості для кожного продукту
                const initialQuantities: { [key: number]: number } = {};
                //@ts-ignore
                resp.data.forEach((product: any) => {
                    initialQuantities[product.id] = 1; // або інше значення за замовчуванням
                });
                setQuantities(initialQuantities);

            }).catch(err => {
                console.error("Помилка при отриманні товарів", err);
            });
        }

    }, [array]);

    const deleteProductWithBasket = async (productId: number) => {

        if (userStatus)
        {
            try {
                // Видаляємо товар із кошика через API
                const response = await http.delete(`api/Basket/DeleteBasket/${productId}`);

                const array = response.data;

                console.error("Прийшло", response.data)

                localStorage.setItem('basket', JSON.stringify(array));

                dispatch({ type: BasketActionType.ADD_Basket, payload: array });


            }
            catch (error)
            {
                console.error("Помилка при видаленні товару або повторній авторизації:", error);
            }
        }
        else
        {
            // Якщо авторизація не вдалася, оновлюємо локальний кошик
            const cart = JSON.parse(localStorage.getItem('basket') || '[]');
            const updatedCart = cart.filter((item: number) => item !== productId);

            localStorage.setItem('basket', JSON.stringify(updatedCart));
            dispatch({ type: BasketActionType.ADD_Basket, payload: updatedCart });
        }
    };

    // Функція для зменшення кількості конкретного товару
    const handleDecrement = (productId: number) => {
        setQuantities(prevQuantities => ({
            ...prevQuantities,
            [productId]: prevQuantities[productId] > 1 ? prevQuantities[productId] - 1 : 1
        }));
    };

    // Функція для збільшення кількості конкретного товару
    const handleIncrement = (productId: number) => {
        setQuantities(prevQuantities => ({
            ...prevQuantities,
            [productId]: prevQuantities[productId] + 1
        }));
    };

    const [totalPrice, setTotalPrice] = useState(0);

    // Рахуємо загальну ціну
    useEffect(() =>
    {
        const total = productGet.reduce((sum, product) => sum + product.price * (quantities[product.id] || 1), 0);
        setTotalPrice(total);
    }, [productGet, quantities]);

    const handleCheckout = () =>{

        if(userStatus)
        {

            const orderItems: IOrderProduct[] = productGet.map(product => ({
                productId: product.id,
                count: quantities[product.id], // кількість товару
                price: product.price,
                amount:totalPrice// ціна за одиницю
            }));

            try {

                http.post("api/Basket/PushOrderWhenLogin", orderItems);

                localStorage.removeItem('order');

                dispatch({
                    type:OrderActionType.ADD_Order,
                    payload:[]
                });

                localStorage.removeItem("basket");

                dispatch({
                    type:BasketActionType.ADD_Basket,
                    payload:[]
                });

                setFlag(false);

            }
            catch (error)
            {
                console.log("Помилка закидання у кошик", error);
            }
        }
        else
        {
            const order = JSON.parse(localStorage.getItem('order') || '[]');

            const orderItems: IOrderProduct[] = productGet.map(product => ({
                productId: product.id,
                count: quantities[product.id], // кількість товару
                price: product.price,
                amount:totalPrice// ціна за одиницю
            }));

            //@ts-ignore
            orderItems.forEach((item: any) => {
                order.push(item);
            });

            // Збереження даних замовлення у localStorage
            localStorage.setItem('order', JSON.stringify(order));

            dispatch({
                type:OrderActionType.ADD_Order,
                payload:order
            });

            localStorage.removeItem("basket");

            dispatch({
                type:BasketActionType.ADD_Basket,
                payload:[]
            });

            setFlag(false);
            }
        };

    return (
       <>
        {flag ?(

        <>
            {basket.length > 0 ? (
                <>
                    <div className="Cart-Text">
                        <span>cart</span>
                    </div>

                    <section className="Basick-section">

                        <div className="Cart-Basket">
                            {productGet.map((product) => (
                                <div className="CartBasketItem" key={product.id}>

                                    <div className="Frame92">

                                        <div className="FrameImage">
                                            <img alt="" src={`${baseUrl}product/${product.imagePaths[0]}`}/>
                                        </div>

                                        <div className="Frame91-3">
                                            <span className="Name-Item">{product.name}</span>
                                            <span className="Brand-Item">Brand: <span>{product.brand}</span></span>
                                            <span className="Brand-Item">Size: <span>{Size[product.size]}</span></span>
                                            <span className="Brand-Item">Color: <span>{product.color}</span></span>
                                            <span className="Price-Item">£{product.price}</span>
                                        </div>

                                    </div>

                                    <div className="Frame575">

                                        <button className="hover-red" onClick={() => {
                                            deleteProductWithBasket(product.id)
                                        }}>
                                            <svg xmlns="http://www.w3.org/2000/svg" width="35" height="35"
                                                 viewBox="0 0 32 32" fill="none">
                                                <path d="M24 8L8 24" stroke="#0D0D0D" strokeWidth="3"
                                                      strokeLinecap="round" strokeLinejoin="round"/>
                                                <path d="M8 8L24 24" stroke="#0D0D0D" strokeWidth="3"
                                                      strokeLinecap="round" strokeLinejoin="round"/>
                                            </svg>
                                        </button>

                                        {/* Інкремент/Декремент для кожного товару */}
                                        <form className="max-w-xs mx-auto castom">
                                            <label
                                                htmlFor="quantity-input"
                                                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                                            >
                                                Choose quantity:
                                            </label>
                                            <div className="relative flex items-center max-w-[8rem]">
                                                <button
                                                    type="button"
                                                    onClick={() => handleDecrement(product.id)}
                                                    className="bg-gray-100 dark:bg-gray-700 dark:hover:bg-gray-600 dark:border-gray-600 hover:bg-gray-200 border border-gray-300 rounded-s-lg p-3 h-11 focus:ring-gray-100 dark:focus:ring-gray-700 focus:ring-2 focus:outline-none"
                                                >
                                                    <svg
                                                        className="w-3 h-3 text-gray-900 dark:text-white"
                                                        aria-hidden="true"
                                                        xmlns="http://www.w3.org/2000/svg"
                                                        fill="none"
                                                        viewBox="0 0 18 2"
                                                    >
                                                        <path
                                                            stroke="currentColor"
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                            strokeWidth="2"
                                                            d="M1 1h16"
                                                        />
                                                    </svg>
                                                </button>
                                                <input
                                                    type="text"
                                                    id="quantity-input"
                                                    value={quantities[product.id] || 1}
                                                    readOnly
                                                    className="bg-gray-50 border-x-0 border-gray-300 h-11 text-center text-gray-900 text-sm focus:ring-blue-500 focus:border-blue-500 block w-full py-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => handleIncrement(product.id)}
                                                    className="bg-gray-100 dark:bg-gray-700 dark:hover:bg-gray-600 dark:border-gray-600 hover:bg-gray-200 border border-gray-300 rounded-e-lg p-3 h-11 focus:ring-gray-100 dark:focus:ring-gray-700 focus:ring-2 focus:outline-none"
                                                >
                                                    <svg
                                                        className="w-3 h-3 text-gray-900 dark:text-white"
                                                        aria-hidden="true"
                                                        xmlns="http://www.w3.org/2000/svg"
                                                        fill="none"
                                                        viewBox="0 0 18 18"
                                                    >
                                                        <path
                                                            stroke="currentColor"
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                            strokeWidth="2"
                                                            d="M9 1v16M1 9h16"
                                                        />
                                                    </svg>
                                                </button>
                                            </div>
                                        </form>

                                    </div>

                                </div>
                            ))}
                        </div>

                        <div className="Frame446">

                            <div className="Frame445">

                                <div className="Cart-Total">

                                    <div className="Frame444">

                                        <div className="Frame443">

                                            <div className="Frame435">
                                                <span>Total:</span>
                                                <span>£{totalPrice.toFixed(2)}</span>
                                                {/* Два нулі після коми */}
                                            </div>

                                            <div className="Frame442">

                                                <div className="Frame437">

                                                    <div className="Frame436">
                                                        <span>delivery</span>

                                                        <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25"
                                                             viewBox="0 0 25 25" fill="none">
                                                            <path
                                                                d="M12.5 22.5C18.0228 22.5 22.5 18.0228 22.5 12.5C22.5 6.97715 18.0228 2.5 12.5 2.5C6.97715 2.5 2.5 6.97715 2.5 12.5C2.5 18.0228 6.97715 22.5 12.5 22.5Z"
                                                                stroke="#707070" strokeWidth="2" strokeLinecap="round"
                                                                strokeLinejoin="round"/>
                                                            <path d="M12.5 16.5V12.5" stroke="#707070" strokeWidth="2"
                                                                  strokeLinecap="round" strokeLinejoin="round"/>
                                                            <path d="M12.5 8.5H12.51" stroke="#707070" strokeWidth="2"
                                                                  strokeLinecap="round" strokeLinejoin="round"/>
                                                        </svg>

                                                    </div>

                                                    <div className="Frame365">
                                                        <p>Standart Delivery (Free)</p>

                                                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="9"
                                                             viewBox="0 0 14 9" fill="none">
                                                            <path d="M1.5 1L7 7L12.5 1" stroke="#707070" strokeWidth="2"
                                                                  strokeLinecap="round"/>
                                                        </svg>

                                                    </div>
                                                </div>

                                                <div className="Frame441">
                                                    <span>we accept</span>

                                                    <div className="Frame440">

                                                        <div className="Frame438">
                                                            <button className="CreditCart1"></button>
                                                            <button className="CreditCart2"></button>
                                                            <button className="CreditCart3"></button>
                                                            <button className="CreditCart4"></button>
                                                        </div>

                                                        <div className="Frame438-2">
                                                            <button className="CreditCart5"></button>
                                                            <button className="CreditCart6"></button>
                                                            <button className="CreditCart7"></button>
                                                            <button className="CreditCart8"></button>
                                                        </div>

                                                    </div>

                                                </div>

                                                <Link to="" className="Got-Text">Got a discount code? Click here to
                                                    add.</Link>

                                            </div>

                                        </div>

                                    </div>

                                </div>

                                <button className="Checkout" onClick={handleCheckout}>checkout</button>

                            </div>

                        </div>
                    </section>
                </>
            ) : (
                <h2 className="Favorite-Clear">Basket is clear</h2>
            )}
        </>
        ):(
            <h2 className="Order-Done">Done. You need authorized</h2>
        )}
       </>
)

}

export default Basket;