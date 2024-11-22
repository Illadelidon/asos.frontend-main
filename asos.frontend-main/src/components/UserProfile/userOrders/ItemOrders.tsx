import {useEffect, useState} from "react";
import {IOrderItem} from "../../types.ts";
import {useParams} from "react-router-dom";
import http from "../../../http_common.ts";
import ProfileDefaultHeader from "../default/ProfileDefaultHeader.tsx";
import DefaultSideBar from "../default/DefaultSideBar.tsx";
import { FiPackage } from "react-icons/fi";
import {APP_ENV} from "../../../env";
import {Size} from "../../../interfaces/user";
import "./itemOrders-style.css";

const ItemOrders=()=>
{

    const baseUrl = APP_ENV.BASE_URL;
    const { id } = useParams();

    const [getProduct, setProduct] = useState<IOrderItem[]>([]);

    const [totalOrders, setTotalOrders] = useState<number>(0); // Загальна кількість замовлень
    const [currentPage, setCurrentPage] = useState<number>(1);
    const ordersPerPage = 4; // Кількість замовлень на сторінку

    // Викликаємо API при першому завантаженні і при зміні сторінки
    useEffect(() =>
    {
        fetchOrders(currentPage);

    }, [currentPage]);

    const fetchOrders = (page: number) => {

        http.get(`/api/Order/OrderById?id=${id}&pageNumber=${page}&pageSize=${ordersPerPage}`).then(resp=>{

            setProduct(resp.data.items);
            setTotalOrders(resp.data.totalCount);
        })
    };

    const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

    console.log("Такі продукти",getProduct);

    return (
        <>
            <div className="centered-div">
                <ProfileDefaultHeader backLink="/user-info/orders" />
            </div>

            <div className="new-container">
                <DefaultSideBar />

                <section className="Section-Cart-OrderItem">

                {getProduct.length>0 ? (


                        getProduct.map((product) => (
                        <div className="orderBox" key={product.id}>
                            <img
                                src={`${baseUrl}product/${product.imagePaths[0]}`}
                                alt=""
                                className="Rectangle1"
                            />
                            <div className="orderDetails">
                                <h3>{product.name}</h3>
                                <p>Brand: {product.brand}</p>
                                <p>Size: {Size[product.size]}</p>
                                <p>Colour: {product.color}</p>

                                <div className="priceAndIcon">
                                    <p className="pricetext">${product.price}</p>
                                    <div className="iconWrapper">
                                        <FiPackage size={32} />
                                        <p className="texticon">packed</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))
) :
    (

                    <h2>Product don't pick</h2>
                )}

                    <nav aria-label="Page navigation example" className="plagins">
                        <ul className="inline-flex -space-x-px text-sm">
                            <li>
                                <button
                                    className="flex items-center justify-center px-3 h-8 ms-0 leading-tight text-gray-500 bg-white border border-e-0 border-gray-300 rounded-s-lg hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
                                    onClick={() => paginate(currentPage - 1)}
                                    disabled={currentPage === 1}
                                >
                                    Previous
                                </button>
                            </li>
                            {[...Array(Math.ceil(totalOrders / ordersPerPage))].map((_, index) => (
                                <li key={index}>
                                    <button
                                        className={`flex items-center justify-center px-3 h-8 leading-tight ${currentPage === index + 1 ? 'text-blue-600 bg-blue-50 hover:bg-blue-100 hover:text-blue-700' : 'text-gray-500 bg-white hover:bg-gray-100 hover:text-gray-700'} border border-gray-300 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white`}
                                        onClick={() => paginate(index + 1)}
                                    >
                                        {index + 1}
                                    </button>
                                </li>
                            ))}
                            <li>
                                <button
                                    className="flex items-center justify-center px-3 h-8 leading-tight text-gray-500 bg-white border border-gray-300 rounded-e-lg hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
                                    onClick={() => paginate(currentPage + 1)}
                                    disabled={currentPage === Math.ceil(totalOrders / ordersPerPage)}
                                >
                                    Next
                                </button>
                            </li>
                        </ul>
                    </nav>

                </section>
            </div>
        </>
    );
};

export default ItemOrders;