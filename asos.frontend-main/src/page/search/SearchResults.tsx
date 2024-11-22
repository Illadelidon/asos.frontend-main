import {useEffect, useState} from "react";
import {Link, useLocation} from "react-router-dom";
import http from "../../http_common.ts";
import {GetProductByIdDto} from "../../components/types.ts";
import {APP_ENV} from "../../env";
import "./style.css";

const SearchResults=()=>{

    const baseUrl = APP_ENV.BASE_URL;
    const [products, setProducts] = useState<GetProductByIdDto[]>([]);
    const location = useLocation();

    // Отримуємо параметр "query" з URL
    const queryParams = new URLSearchParams(location.search);
    const query = queryParams.get('query');
    const [notFound, setNotFound] = useState('');

    useEffect(() => {

            http.get(`api/Dashboard/SearchProducts?name=${query}`).then(resp => {

                setProducts(resp.data);
                setNotFound('');

                console.log("Було знайдено", resp.data);
            }).catch(err => {

                if (err.response && err.response.status === 404)
                {
                    setNotFound('No products found');
                    setProducts([]);
                } else
                {
                    setNotFound('Сталася помилка під час пошуку');
                }
            });

    }, [query]);


    return(
        <>
            {products.length>0 ?(

                products.map((item)=>(

                    <div className="relative overflow-x-auto shadow-md sm:rounded-lg" key={item.id}>
                        <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                            <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                            <tr>
                                <th scope="col" className="px-16 py-3">
                                    <span className="sr-only">Image</span>
                                </th>
                                <th scope="col" className="px-6 py-3 text-blue-600">
                                    Product
                                </th>
                                <th scope="col" className="px-6 py-3 text-green-600">
                                    Color
                                </th>
                                <th scope="col" className="px-6 py-3 text-red-600">
                                    Size
                                </th>
                                <th scope="col" className="px-6 py-3 text-yellow-300">
                                    Price
                                </th>
                            </tr>
                            </thead>
                            <tbody>
                            <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                                <td className="p-4">

                                    <Link  to={`/product/${item.id}`}>
                                    <img src={`${baseUrl}product/${item.imageUrls[0]}`} className="w-16 md:w-32 max-w-full max-h-full custom" alt={item.name}/>
                                    </Link>

                                    </td>
                                <td className="px-6 py-4 font-semibold text-gray-900 dark:text-white italic">
                                    {item.name}
                                </td>
                                <td className="px-6 py-4 font-semibold text-gray-900 dark:text-white">
                                    {item.color}
                                </td>
                                <td className="px-6 py-4 font-semibold text-gray-900 dark:text-white">
                                    {item.size}
                                </td>
                                <td className="px-6 py-4 font-semibold text-gray-900 dark:text-white">
                                    £{item.price}
                                </td>
                            </tr>
                            </tbody>
                        </table>
                    </div>
                ))

            ):(

                <h2 id="Error-Found">{notFound}</h2>

            )}



        </>
    )
};

export default SearchResults;