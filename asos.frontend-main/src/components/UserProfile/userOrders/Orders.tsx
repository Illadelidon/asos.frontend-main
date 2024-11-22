import {useEffect, useState} from "react";
import "./style.css";
import ProfileDefaultHeader from "../default/ProfileDefaultHeader";
import DefaultSideBar from "../default/DefaultSideBar";
import 'react-datepicker/dist/react-datepicker.css';
import {Link} from "react-router-dom";
import http from "../../../http_common.ts";
import {IOrderInformation, OrderInformationDto, PagedResult} from "../../types.ts";
import {APP_ENV} from "../../../env";

const Orders = () => {

    const baseUrl = APP_ENV.BASE_URL;

    const [getOrder, setOrder] = useState<IOrderInformation[]>([]);

    const [totalOrders, setTotalOrders] = useState<number>(0); // Загальна кількість замовлень
    const [currentPage, setCurrentPage] = useState<number>(1);
    const ordersPerPage = 2; // Кількість замовлень на сторінку

    // Викликаємо API при першому завантаженні і при зміні сторінки
    useEffect(() => {
        fetchOrders(currentPage);
    }, [currentPage]);

    // Функція для отримання замовлень
    const fetchOrders = (page: number) => {

         http.get<PagedResult<OrderInformationDto>>(`api/Order/OrderInfo?pageNumber=${page}&pageSize=${ordersPerPage}`)
            .then(resp => {

                setOrder(resp.data.items); // Тут ми отримуємо масив замовлень
                setTotalOrders(resp.data.totalCount); // Загальна кількість замовлень

                console.log("Прийшли замовлення", resp.data);

            })
            .catch(error => {
                console.error("Помилка при завантаженні замовлень", error);
            });
    };

    // Функція для зміни сторінки
    const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

    return (
        <>
            <div className="centered-div">
                <ProfileDefaultHeader/>
            </div>

            <div className="new-container">
                <DefaultSideBar/>


                {getOrder.length>0 ?(
                        <div className="content-container">

                            <div className="div-with-text">
                                <h2>My Orders</h2>
                            </div>

                            {getOrder.map((order)=>(


                                <div className="Frame161" key={order.id}>

                                    <span className="Order-number">Order pack #{order.id}</span>

                                    <div className="Special-Wrapper">

                                        {/*Сходи з фотографій*/}

                                        {order.names.length >=3 ? (

                                            <div className="Order-Img">
                                                <div className="Frame108-3">
                                                    <img src={`${baseUrl}product/${order.imagePaths[0]}`} alt=""/>
                                                </div>
                                                <div className="Frame109-3">
                                                    <img src={`${baseUrl}product/${order.imagePaths[3]}`} alt=""/>
                                                </div>
                                                <div className="Frame110-3">
                                                    <img src={`${baseUrl}product/${order.imagePaths[5]}`} alt=""/>
                                                </div>
                                            </div>

                                        ) : order.names.length <3 && order.names.length>1 ? (

                                            <div className="Order-Img">
                                                <div className="Frame108-2">
                                                    <img src={`${baseUrl}product/${order.imagePaths[1]}`} alt=""/>
                                                </div>
                                                <div className="Frame109-2">
                                                    <img src={`${baseUrl}product/${order.imagePaths[3]}`} alt=""/>
                                                </div>
                                            </div>

                                        ) : order.names.length <2 ? (

                                            <div className="Order-Img">
                                                <div className="Frame108-1">
                                                    <img src={`${baseUrl}product/${order.imagePaths[0]}`} alt=""/>
                                                </div>
                                            </div>

                                        ) : (
                                            <p>No images available</p>
                                        )}


                                        <div className="Frame160">

                                            <div className="Frame159">

                                                <div className="Frame158">

                                                    {order.names.map((name, index) => (

                                                        <p key={index}>{name}</p>
                                                    ))}

                                                </div>

                                                <Link to={`/user-info/orders/${order.id}`} className="Link-Order-Datails">Show in details  </Link>

                                                <span className="Total-PriceOrder">Total: £{order.totalPrice}</span>

                                            </div>

                                            <div className="Frame157">

                                                {order.status==="Booked" ? (
                                                    <>

                                                        <svg className="h-8 w-8 text-teal-500" width="24" height="24" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">  <path stroke="none" d="M0 0h24v24H0z"/>  <path d="M9 12l2 2l4 -4" />  <path d="M12 3a12 12 0 0 0 8.5 3a12 12 0 0 1 -8.5 15a12 12 0 0 1 -8.5 -15a12 12 0 0 0 8.5 -3" /></svg>
                                                        <p>The product is reserved!</p>
                                                    </>

                                                ) : order.status==="Delivery" ? (

                                                    <>
                                                        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32" fill="none">
                                                            <path d="M21.332 4H1.33203V21.3333H21.332V4Z" stroke="#0D0D0D" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                                            <path d="M21.332 10.6667H26.6654L30.6654 14.6667V21.3334H21.332V10.6667Z" stroke="#0D0D0D" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                                            <path d="M7.33333 28C9.17428 28 10.6667 26.5076 10.6667 24.6666C10.6667 22.8257 9.17428 21.3333 7.33333 21.3333C5.49238 21.3333 4 22.8257 4 24.6666C4 26.5076 5.49238 28 7.33333 28Z" stroke="#0D0D0D" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                                            <path d="M24.6654 28C26.5063 28 27.9987 26.5076 27.9987 24.6666C27.9987 22.8257 26.5063 21.3333 24.6654 21.3333C22.8244 21.3333 21.332 22.8257 21.332 24.6666C21.332 26.5076 22.8244 28 24.6654 28Z" stroke="#0D0D0D" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                                        </svg>

                                                        <p>On your way! Will be delivered in 2 days</p>
                                                    </>

                                                ) : order.status==="Bought" ? (

                                                    <>
                                                        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32" fill="none">
                                                            <path d="M16.0013 29.3333C23.3651 29.3333 29.3346 23.3638 29.3346 16C29.3346 8.63616 23.3651 2.66663 16.0013 2.66663C8.63751 2.66663 2.66797 8.63616 2.66797 16C2.66797 23.3638 8.63751 29.3333 16.0013 29.3333Z" stroke="#0D0D0D" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                                            <path d="M10.668 18.6666C10.668 18.6666 12.668 21.3333 16.0013 21.3333C19.3346 21.3333 21.3346 18.6666 21.3346 18.6666" stroke="#0D0D0D" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                                            <path d="M12 12H12.0133" stroke="#0D0D0D" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                                            <path d="M20 12H20.0133" stroke="#0D0D0D" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                                        </svg>

                                                        <p>Done!</p>
                                                    </>

                                                ) : (
                                                    <p>Done</p>
                                                )}

                                            </div>

                                        </div>

                                    </div>

                                </div>

                            ))}

                            {/* Пагінація */}
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

                        </div>

                    ):(
                        <div className="div-with-empty">
                            <h2>Orders is clear</h2>
                        </div>
                    )};
            </div>
        </>
    )

};

export default Orders;