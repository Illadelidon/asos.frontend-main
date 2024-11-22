import ProfileDefaultHeader from "../../UserProfile/default/ProfileDefaultHeader.tsx";
import DefaultAdminSideBar from "../default/DefaultAdminSideBar.tsx";
import {useEffect, useState} from "react";
import http from "../../../http_common.ts";
import {IGetAllProducts} from "../../types.ts";
import {useNavigate} from "react-router-dom";


const AllProducts = () => {
    const [products, setProducts] = useState<IGetAllProducts[]>([]);
    const [totalProducts, setTotalProducts] = useState<number>(0); // Загальна кількість продуктів
    const [currentPage, setCurrentPage] = useState<number>(1); // Номер поточної сторінки
    const productsPerPage = 10; // Кількість продуктів на сторінку

    const [categories, setCategories] = useState<{ id: string, name: string }[]>([]);
    const [brands, setBrands] = useState<{ id: string, name: string }[]>([]);
    const navigate = useNavigate();

    useEffect(() => {
        fetchProducts(currentPage);
    }, [currentPage]);

    const fetchProducts = (page: number) => {
        http.get(`api/Dashboard/GetAllProductsForAdmin?pageNumber=${page}&pageSize=${productsPerPage}`)
            .then(resp => {
                setProducts(resp.data.items); // Продукти для поточної сторінки
                setTotalProducts(resp.data.totalCount); // Загальна кількість продуктів
                console.log("Прийшли продукти",resp.data.items);
            })
            .catch(error => {
                console.error("Error fetching products", error);
            });
    };

    useEffect(() => {
        http.get("api/Dashboard/GetAllCategory").then(resp => {
            setCategories(resp.data);
        });
    }, []);

    useEffect(() => {
        http.get("api/Dashboard/GetAllBrand").then(resp => {
            setBrands(resp.data);
        });
    }, []);

    const handleDelete = async (id: number) => {
        try {
            await http.delete(`api/Dashboard/DeleteProduct/${id}`);
            setProducts(products.filter(product => product.id !== id));
        } catch (error) {
            console.error("Error deleting product", error);
        }
    };

    const handleEdit = (id: number) => {
        navigate(`/admin/editProduct/${id}`);
    };

    const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

    const categoryMap = new Map(categories.map(cat => [cat.id, cat.name]));
    const brandMap = new Map(brands.map(cat => [cat.id, cat.name]));

    return (
        <>
            <div className="centered-div">
                <ProfileDefaultHeader backLink="/admin"/>
            </div>

            <div className="main-container">
                <DefaultAdminSideBar />

                <div className="Frame185">
                    <div className="UsersDiv">
                        <p>Products</p>
                    </div>

                    {products.map(product => (
                        <div className="ProductsDiv" key={product.id}>
                            <div className="">
                                <p>{product.id}</p>
                            </div>
                            <div className="Name-SecondName">
                                <p>{product.name}</p>
                            </div>

                            <div className="Role-Div">
                                <p>{categoryMap.get(product.categoryId) || 'Unknown Category'}</p>
                            </div>
                            <div className="Role-Div">
                                <p>{brandMap.get(product.brandId) || 'Unknown Category'}</p>
                            </div>

                            <div className="Role-Div">
                                <p>{product.price}$</p>
                            </div>
                            <div>
                                <button type="button" onClick={() => handleEdit(product.id)}
                                        className="text-gray-900 bg-gradient-to-r from-lime-200 via-lime-400 to-lime-500 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-lime-300 dark:focus:ring-lime-800 shadow-lg shadow-lime-500/50 dark:shadow-lg dark:shadow-lime-800/80 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2">
                                    Edit
                                </button>
                                <button type="button" onClick={() => handleDelete(product.id)}
                                        className="text-white bg-gradient-to-r from-red-400 via-red-500 to-red-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-red-300 dark:focus:ring-red-800 shadow-lg shadow-red-500/50 dark:shadow-lg dark:shadow-red-800/80 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2">
                                    Delete
                                </button>
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
                            {[...Array(Math.ceil(totalProducts / productsPerPage))].map((_, index) => (
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
                                    disabled={currentPage === Math.ceil(totalProducts / productsPerPage)}
                                >
                                    Next
                                </button>
                            </li>
                        </ul>
                    </nav>
                </div>
            </div>
        </>
    );
}
export default AllProducts;