import ProfileDefaultHeader from "../../UserProfile/default/ProfileDefaultHeader.tsx";
import DefaultAdminSideBar from "../default/DefaultAdminSideBar.tsx";
import {useEffect, useState} from "react";
import {ChangeOrderStatus} from "./type.ts";
import http from "../../../http_common.ts";
import {Link} from "react-router-dom";
import {APP_ENV} from "../../../env";
import "./style.css";

const Status=()=>{

    const baseUrl = APP_ENV.BASE_URL;

    const [orders, setOrders] = useState<ChangeOrderStatus[]>([]);

    useEffect(() => {

        http.get(`api/Order/GetAllOrders`)
            .then(resp => {
                setOrders(resp.data);
                console.log("Прийшли замовлення",resp.data as ChangeOrderStatus);

            })
            .catch(error => {
                console.error("Error fetching products", error);
            });

    }, []);

    return(
        <>
            <div className="centered-div">
                <ProfileDefaultHeader backLink="/admin"/>
            </div>

            <div className="main-container">

                <DefaultAdminSideBar />

                {orders.length > 0 ? (
                    <div className="bg-white p-8 rounded-md w-full">
                        <div className="-mx-4 sm:-mx-8 px-4 sm:px-8 py-4 overflow-x-auto">
                            <div className="inline-block min-w-full shadow rounded-lg overflow-hidden my-style">
                                <table className="min-w-full leading-normal">
                                    <thead>
                                    <tr>
                                        <th
                                            className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                            Name
                                        </th>
                                        <th
                                            className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                            Products count
                                        </th>
                                        <th
                                            className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                            Created at
                                        </th>
                                        <th
                                            className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                            Price
                                        </th>
                                        <th
                                            className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                            Status
                                        </th>
                                        <th
                                            className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                            Action
                                        </th>
                                    </tr>
                                    </thead>
                                    <tbody>

                                    {orders.map((order) => (
                                        <tr key={order.id}>
                                            <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                                                <div className="flex items-center">
                                                    <div className="flex-shrink-0 w-10 h-10">
                                                        <img className="w-full h-full rounded-full"
                                                             src={
                                                                 order.imageUser
                                                                     ? `${baseUrl}avatars/${order.imageUser}`
                                                                     : `${baseUrl}avatars/user404.png`
                                                             }
                                                             alt={order.userName} />
                                                    </div>
                                                    <div className="ml-3">
                                                        <p className="text-gray-900 whitespace-no-wrap">
                                                            {order.userName}
                                                        </p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-5 py-5 border-b border-gray-200 bg-white text-xl w-1/2">
                                                <p className="text-red-600 whitespace-no-wrap text-center">
                                                    {order.names.length}
                                                </p>
                                            </td>
                                            <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm w-1/2">
                                                <p className="text-gray-900 whitespace-no-wrap">
                                                    {order.dateCrated}
                                                </p>
                                            </td>
                                            <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                                                <p className="text-gray-900 whitespace-no-wrap">
                                                    £{order.totalPrice}
                                                </p>
                                            </td>
                                            <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                                    <span className="relative inline-block px-3 py-1 font-semibold text-green-900 leading-tight">
                                        <span aria-hidden className="absolute inset-0 bg-green-200 opacity-50 rounded-full"></span>
                                        <span className="relative">{order.status}</span>
                                    </span>
                                            </td>
                                            <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                                                <Link
                                                    to={`/admin/changestatus/${order.id}`}
                                                    className="focus:outline-none text-white bg-yellow-400 hover:bg-yellow-500 focus:ring-4 focus:ring-yellow-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:focus:ring-yellow-900"
                                                >
                                                    Edit
                                                </Link>
                                            </td>
                                        </tr>
                                    ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                ) : (
                    <h2>Orders is clear</h2>
                )}
            </div>
        </>
    )
}

export default Status;