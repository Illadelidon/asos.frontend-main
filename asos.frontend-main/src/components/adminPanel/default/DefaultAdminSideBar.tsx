import { ChangeEventHandler, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../store";
import http from "../../../http_common";
import { AuthUserActionType } from "../../authentication/type";
import "../../UserProfile/Style-UserProfile.scss";
import { MdOutlinePhotoCamera } from "react-icons/md";
import { FaEdit } from "react-icons/fa";
import { LuPackage } from "react-icons/lu";
import { BsArrowReturnLeft } from "react-icons/bs";
import { PiStarFour } from "react-icons/pi";
import { FiHome } from "react-icons/fi";
import { FiCreditCard } from "react-icons/fi";
import { FiMessageCircle } from "react-icons/fi";
import { GoPeople } from "react-icons/go";
import { IoGiftOutline } from "react-icons/io5";
import { IoIosInformationCircleOutline } from "react-icons/io";
import { PiSignOutFill } from "react-icons/pi";
import { API_URL } from "../../../utils/getEnvData.ts";
import setAuthToken from "../../../helpers/setAuthToken.ts";
import {jwtDecode} from "jwt-decode";
import {Link} from "react-router-dom";
import {IEditUser} from "../../UserProfile/types.ts";

const DefaultAdminSideBar = () => {

    const dispatch = useDispatch();
    const currentUser = useSelector((state: RootState) => state.auth.user);

    const baseUrl = API_URL;

    const init: IEditUser = {
        id: 0,
        firstName: "",
        lastName: "",
        email: "",
        image: "",
        birthday:""
    };

    const [user, setUser] = useState<IEditUser>(init);
    const [selectedImage, setSelectedImage] = useState<string | null>(null);

    useEffect(() => {
        if (currentUser) {
            setUser(currentUser);
        }
    }, [currentUser]);

    const beforeUpload = (file: File) => {
        const isImage = /^image\/\w+/.test(file.type);
        if (!isImage) {
            console.log('Оберіть файл зображення!');
            return false;
        }
        const isLt10M = file.size / 1024 / 1024 < 10; // Можливо, ви мали на увазі 10MB замість 2MB
        if (!isLt10M) {
            console.log('Розмір файлу не повинен перевищувати 10MB!');
            return false;
        }
        console.log("is select", isImage && isLt10M);
        return isImage && isLt10M;
    };

    const handleChangeImage: ChangeEventHandler<HTMLInputElement> = async (e) => {
        const files = e.target.files;

        if (!files || files.length === 0) {
            return;
        }
        const file = files[0];

        if (!beforeUpload(file)) {
            return;
        }

        // Оновлення стану для відображення вибраного зображення
        const imageUrl = URL.createObjectURL(file);
        setSelectedImage(imageUrl);

        try {
            const formData = new FormData();
            formData.append('Image', file);

            const resp = await http.post(`api/uploadAvatar/UpdateAvatar`, formData, {
                headers: {
                    "Content-Type": "multipart/form-data"
                }
            });

            const result = resp.data;

            dispatch({
                type: AuthUserActionType.UPDATE_USER,
                payload: {
                    image: result.image
                }
            });

            const token = result.token as string;

            setAuthToken(token);

            const user = jwtDecode<IEditUser>(token);

            console.log("Фото оновилося", user);

            dispatch({type: AuthUserActionType.LOGIN_USER, payload: user});


        }
        catch (error)
        {
            console.error('Помилка з фото User:', error);
        }
    };

    return (
        <div className="main-container">
            <div>
                <div className="img-div">
                    <div className="image-container">
                        <label htmlFor="pickFoto" className="image-label">
                            {selectedImage ? (
                                <div className="placeholder">
                                    <img src={selectedImage} alt="Selected" className="avatar-image" />
                                </div>
                            ) : (
                                <div className="placeholder">
                                    {user.image ? (
                                        <img src={`${baseUrl}avatars/${user.image}`} alt="User avatar" className="avatar-image" />
                                    ) : (
                                        <MdOutlinePhotoCamera size={32} />
                                    )}
                                </div>
                            )}
                        </label>
                        <input
                            id="pickFoto"
                            accept="image/*"
                            type="file"
                            name="image"
                            onChange={handleChangeImage}
                            className="file-input"
                            style={{ display: 'none' }} // Приховуємо вхідний файл
                        />
                    </div>
                    <div className="divtext-sidebar">
                        <div className="text-container">
                            <p className="text-hi">Hi there,</p>
                            <p className="text-name">{`${user.firstName} ${user.lastName}`}</p>
                        </div>

                        <Link className="edit-button" to="/admin">
                            <FaEdit size={24} />
                        </Link>

                    </div>
                </div>

                <div className="second-block">

                    <Link to="/admin/users" className="button-in-block">
                        <GoPeople size={24} />
                        <p className="text-name">Users</p>
                    </Link>

                    <Link to="/admin" className="button-in-block">
                        <BsArrowReturnLeft size={24} />
                        <p className="text-name">Returns</p>
                    </Link>

                    <Link className="button-in-block" to="/admin/createProduct">
                        <LuPackage size={24} />
                        <p className="text-name">Add Product</p>
                    </Link>

                    <Link className="button-in-block" to="/admin/allproducts">
                        <FiHome size={24} />
                        <p className="text-name">All products</p>
                    </Link>

                    <Link className="button-in-block" to="/admin/createCategory">
                        <PiStarFour size={24} />
                        <p className="text-name">Add Category</p>
                    </Link>
                    <Link className="button-in-block" to="/admin/allcategory">
                        <FiCreditCard size={24} />
                        <p className="text-name">All Category</p>
                    </Link>

                    <Link className="button-in-block"
                    to="/admin/status"
                    >
                        <FiMessageCircle size={24} />
                        <p className="text-name">Orders Status</p>
                    </Link>
                    <button className="button-in-block">
                        <IoGiftOutline size={24} />
                        <p className="text-name">Gift Cards</p>
                    </button>
                    <button className="button-in-block">
                        <IoIosInformationCircleOutline size={24} />
                        <p className="text-name">Help Centre</p>
                    </button>
                </div>
                <Link to="/logout"
                      className="sign-out-button"
                      onClick={(e) => {
                          e.preventDefault();
                          localStorage.removeItem("token");
                          window.location.href="/";
                      }}

                >
                    <PiSignOutFill size={24} />
                    <p className="text-name">Sign Out</p>
                </Link>
            </div>
        </div>
    );
};

export default DefaultAdminSideBar;
