import "./style.css";
import ProfileDefaultHeader from "../../UserProfile/default/ProfileDefaultHeader.tsx";
import DefaultAdminSideBar from "../default/DefaultAdminSideBar.tsx";
import {APP_ENV} from "../../../env";
import {useEffect, useState} from "react";
import {IUser} from "../../authentication/login/type.ts";
import http from "../../../http_common.ts";

const Users=()=>{

    const baseUrl = APP_ENV.BASE_URL;

    const [response, setResponse] = useState<string>("");
    const [users, setUsers] = useState<IUser[]>([]);
    const [totalUsers, setTotalUsers] = useState<number>(0); // для зберігання загальної кількості користувачів
    const [currentPage, setCurrentPage] = useState<number>(1);
    const usersPerPage = 5;

    useEffect(() => {
        fetchUsers(currentPage);
    }, [currentPage, response]);

    const fetchUsers = (page: number) => {
        http.get(`api/Account/GetAllUsers?pageNumber=${page}&pageSize=${usersPerPage}`)
            .then(resp => {
                setUsers(resp.data.items);
                setTotalUsers(resp.data.totalCount);
                console.log("Прийшли юзери", resp.data.items);
            })
            .catch(error => {
                console.error("Error fetching users", error);
            });
    };
    const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

    const handleBlockUserClick = async (userId:number) => {
        try {
            const response = await http.post("api/Account/BlockUser", {userId});
            // Обробка відповіді, якщо необхідно
            console.log("User заблокований", response.data);
            setResponse(response.data);

        } catch (error)
        {
            console.error("Error blocking user", error);
        }
    };

    const handleUnblockUserClick = async (userId:number) => {
        try {
            const response = await http.post("api/Account/UnBlockUser", {userId});
            // Обробка відповіді, якщо необхідно
            console.log("User розблокований", response.data);
            setResponse(response.data);

        } catch (error)
        {
            console.error("Error unblocking user", error);
        }
    };

    return(
        <>

            <div className="centered-div">
                <ProfileDefaultHeader backLink="/admin"/>
            </div>

            <div className="main-container">

                <DefaultAdminSideBar/>

            <div className="Frame185">

                <div className="UsersDiv">
                     <p>Custumers</p>
                </div>

                {users.map(user => (

                    <div className="CustumersDiv"  key={user.id}>
                            <img
                                className="h-full w-full rounded-full object-center"
                                src={
                                    user.image
                                        ? `${baseUrl}avatars/${user.image}`
                                        : `${baseUrl}avatars/user404.png`
                                }
                                alt="Users foto"
                            />

                        <div className="Name-SecondName">
                            <p>{user.firstName} {user.lastName}</p>
                            <p>{user.email}</p>
                        </div>

                        {user.lockoutEnabled ? (
                            <span
                                className="inline-flex items-center gap-1 rounded-full bg-red-400 px-2 py-1 text-xs font-semibold text-black">

                                <span className="h-2 w-2 rounded-full bg-red-600"></span>
                                            Block
                               </span>
                        ) : (
                            <span className="inline-flex items-center gap-1 rounded-full bg-green-100 px-2 py-1 text-xs font-semibold text-green-600">

                             <span className="h-2 w-2 rounded-full bg-green-600"></span>

                                Active
                            </span>
                        )}

                        <div className="Role-Div">
                        <p>{user.roles}</p>
                        </div>

                        {user.phoneNumber ? (

                            <p className="Phone-P">{user.phoneNumber}</p>
                        ) : (
                            <p className="Phone-P">000-000-000</p>
                        )}

                        <div className="Buttons-Div">
                        {user.lockoutEnabled ? (
                            <button
                                type="button"
                                className="text-white bg-gradient-to-r from-green-400 via-green-500 to-green-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-green-300 dark:focus:ring-green-800 shadow-lg shadow-green-500/50 dark:shadow-lg dark:shadow-green-800/80 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2"
                                onClick={() => handleUnblockUserClick(user.id)}
                            >Unblock</button>

                        ) : (
                            <button type="button"
                            className="text-white bg-gradient-to-r from-red-400 via-red-500 to-red-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-red-300 dark:focus:ring-red-800 shadow-lg shadow-red-500/50 dark:shadow-lg dark:shadow-red-800/80 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2"
                            onClick={() => handleBlockUserClick(user.id)}
                            >Block</button>
                        )}
                        </div>

                    </div>
                ))}

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
                        {[...Array(Math.ceil(totalUsers / usersPerPage))].map((_, index) => (
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
                                disabled={currentPage === Math.ceil(totalUsers / usersPerPage)}
                            >
                                Next
                            </button>
                        </li>
                    </ul>
                </nav>

            </div>

            </div>
        </>
    )
}

export default Users;