import ProfileDefaultHeader from "../../UserProfile/default/ProfileDefaultHeader.tsx";
import DefaultAdminSideBar from "../default/DefaultAdminSideBar.tsx";
import {useEffect, useState} from "react";
import http from "../../../http_common.ts";
import {IGetAllCategory} from "../../types.ts";


const AllCategory=()=> {
    const [categories, setCategories] = useState<IGetAllCategory[]>([]); // Змінили на "categories"

    const [totalCategories, setTotalCategories] = useState<number>(0); // Загальна кількість категорій
    const [currentPage, setCurrentPage] = useState<number>(1); // Номер поточної сторінки
    const categoriesPerPage = 10; // Кількість категорій на сторінку

    useEffect(() => {
        fetchCategories(currentPage); // Викликаємо функцію отримання категорій при зміні сторінки
    }, [currentPage]);

    const fetchCategories = (page: number) => {
        http.get(`api/Dashboard/GetAllPageCategory?pageNumber=${page}&pageSize=${categoriesPerPage}`)
            .then(resp => {
                setCategories(resp.data.items);  // Категорії для поточної сторінки
                setTotalCategories(resp.data.totalCount);  // Загальна кількість категорій
            })
            .catch(error => {
                console.error("Error fetching categories", error);
            });
    };

    const handleDelete = async (id: number) => {
        try {
            await http.delete(`api/Dashboard/DeleteCategory/${id}`);
            setCategories(categories.filter(category => category.id !== id));  // Оновлюємо список після видалення
        } catch (error) {
            console.error("Error deleting category", error);
        }
    };

    const paginate = (pageNumber: number) => setCurrentPage(pageNumber);  // Функція для зміни сторінки

    return (
        <>
            <div className="centered-div">
                <ProfileDefaultHeader backLink="/admin"/>
            </div>

            <div className="main-container">
                <DefaultAdminSideBar />

                <div className="Frame185">
                    <div className="UsersDiv">
                        <p>Categories</p>
                    </div>

                    {categories.map(category => ( // Використовуємо "categories"
                        <div className="ProductsDiv" key={category.id}>
                            <div className="">
                                <p>{category.id}</p>
                            </div>
                            <div className="Name-SecondName">
                                <p>{category.name}</p>
                            </div>

                            <button type="button"
                                    className="text-white bg-gradient-to-r from-red-400 via-red-500 to-red-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-red-300 dark:focus:ring-red-800 shadow-lg shadow-red-500/50 dark:shadow-lg dark:shadow-red-800/80 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2"
                                    onClick={() => handleDelete(category.id)}>
                                Delete
                            </button>
                        </div>
                    ))}

                    {/* Пагінація */}
                    <nav aria-label="Page navigation example" className="plagins">
                        <ul className="inline-flex -space-x-px text-sm">
                            <li>
                                <button
                                    className="flex items-center justify-center px-3 h-8 ms-0 leading-tight text-gray-500 bg-white border border-e-0 border-gray-300 rounded-s-lg hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
                                    onClick={() => paginate(currentPage - 1)}  // Перехід на попередню сторінку
                                    disabled={currentPage === 1}>
                                    Previous
                                </button>
                            </li>
                            {[...Array(Math.ceil(totalCategories / categoriesPerPage))].map((_, index) => (
                                <li key={index}>
                                    <button
                                        className={`flex items-center justify-center px-3 h-8 leading-tight ${currentPage === index + 1 ? 'text-blue-600 bg-blue-50 hover:bg-blue-100 hover:text-blue-700' : 'text-gray-500 bg-white hover:bg-gray-100 hover:text-gray-700'} border border-gray-300 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white`}
                                        onClick={() => paginate(index + 1)}>
                                        {index + 1}
                                    </button>
                                </li>
                            ))}
                            <li>
                                <button
                                    className="flex items-center justify-center px-3 h-8 leading-tight text-gray-500 bg-white border border-gray-300 rounded-e-lg hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
                                    onClick={() => paginate(currentPage + 1)}  // Перехід на наступну сторінку
                                    disabled={currentPage === Math.ceil(totalCategories / categoriesPerPage)}>
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


export default AllCategory;