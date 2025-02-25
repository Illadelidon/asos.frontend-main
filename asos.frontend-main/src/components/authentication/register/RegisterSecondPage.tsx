import {Link, useLocation, useNavigate} from "react-router-dom";
import {CredentialResponse, GoogleLogin} from "@react-oauth/google";
import {useAppDispatch} from "../../../store";
import {useGoogleLoginMutation} from "../../../services/user.ts";
import setAuthToken from "../../../helpers/setAuthToken.ts";
import {jwtDecode} from "jwt-decode";
import {IValidLogin} from "../login/type.ts";
import {AuthUserActionType, IUserToken} from "../type.ts";
import "./style/styleSecondPage.css";
import {IRegisterPage} from "./type.ts";
import * as yup from "yup";
import {useFormik} from "formik";
import http from "../../../http_common.ts";
import axios from "axios";
import {useState} from "react";

const RegisterSecondPage = () => {

    const navigate = useNavigate();

    const location = useLocation();
    const dispatch = useAppDispatch();

// @ts-ignore
    const [googleLogin] = useGoogleLoginMutation();

    const authSuccess = async (credentialResponse: CredentialResponse) => {


        const resp = await googleLogin({
            credential: credentialResponse.credential || "",
        });

        if (resp && "data" in resp && resp.data) {
            const token = resp.data.token as string;

            setAuthToken(token);

            const user = jwtDecode<IUserToken>(token);

            console.log("Вхід успішний", user);

            dispatch({type: AuthUserActionType.LOGIN_USER, payload: user});

            const {from} = location.state || {from: {pathname: "/"}};
            navigate(from);
        } else {
            console.log("Error login. Check login data!");

            dispatch({type: AuthUserActionType.LOGOUT_USER});
        }
    };
    const authError = () => {
        console.log("Error login.");
    };

    const googleButtonText = location.pathname === '/register' ? 'Sign Up with Google' : 'Log In with Google';

    const init: IRegisterPage = {
        firstName: "",
        lastName: "",
        email: "",
        password: ""
    };

    const [valid, setValid] = useState<IValidLogin[]>([]);

    const onFormikSubmit = async (values: IRegisterPage) => {

        const storedFirstName: string | null = localStorage.getItem('firstName');
        const storedLastName: string | null = localStorage.getItem('lastName');

        if (storedFirstName != null)
        {
            // Тепер ми знаємо, що storedFirstName є string
            values.firstName=storedFirstName;
        }

        if (storedLastName != null)
        {
            values.lastName=storedLastName;
        }

        console.log("Надсилаємо дані", values);

        try {
            const result = await http.post("api/Account/register", values
                , {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                }
            );
            console.log("Result server good", result);


            localStorage.removeItem('firstName');
            localStorage.removeItem('lastName');

            navigate("/login");

        }
        catch (error)
        {
            if (axios.isAxiosError(error))
            {
                if (error.response)
                {
                    const errorData = error.response.data;
                    setValid(errorData);
                }
            }
        }
    }

    //Схема валідації даних полів IRegisterPage
    // Validation schema for IRegisterPage fields
    const registerSchema = yup.object({
        email: yup.string()
            .required("Please provide an email")
            .email("Please enter a valid email address"),
        password: yup
            .string()
            .min(5, "Password must be at least 5 characters long")
            .matches(/[0-9a-zA-Z]/, "Password can only contain Latin letters and numbers")
            .required("Password is required")
    });

    //спеціальний хук для валідації. Працює з обєктом init
    const formik = useFormik({
        initialValues: init,
        onSubmit: onFormikSubmit,
        validationSchema: registerSchema
    });

    // handleSubmit метод, що направляє дані після натиснення button
    //handleChange метод, який міняє значення імпутів
    //errors обєкт з formik, який містить помилки
    //setFieldValue для того, щоб записати значення у formik, але для фото
    const {values, touched, errors, handleSubmit, handleChange} = formik;

    return (
        <>
            <div className="Log-In-eye-on">
                <div className="bg">

                    <div className="urbncore">
                        <p>©urbncore 2024.</p>
                    </div>

                    <div className="picture-log-in"></div>

                    <div className="log-in-registr">

                        <div className="Rectangle6">

                            <div className="Frame28">

                                <div className="Frame20">

                                    <div className="Frame19">

                                        <div className="Frame12">

                                            <Link
                                                to="/login"
                                                id="Frame4"
                                            >
                                                <p className="LogIn">Log In</p>
                                            </Link>

                                            <Link
                                                to="/register"
                                                className="Frame3">
                                                <p className="SignUp">Sign Up</p>
                                            </Link>

                                        </div>

                                        <div className="Frame9">
                                            <span className="WelcomeBackTo">Welcome back to</span>

                                            <svg className="groupLetter" width="167" height="27" viewBox="0 0 167 27"
                                                 fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <path
                                                    d="M3.03255 24.1451C1.59255 22.7799 0.872559 20.9497 0.872559 18.6545C0.872559 18.3667 0.895056 17.9387 0.940056 17.363L2.87506 1.21588C2.89756 1.0978 2.95005 0.99448 3.03255 0.913301C3.11505 0.832123 3.21255 0.787842 3.32505 0.787842H8.09505C8.20755 0.787842 8.30506 0.832123 8.37256 0.913301C8.44006 0.99448 8.46256 1.0978 8.44006 1.21588L6.50505 17.363C6.48255 17.4811 6.46755 17.673 6.46755 17.9387C6.46755 18.8981 6.73755 19.6582 7.27755 20.2338C7.81755 20.8094 8.55256 21.0973 9.47506 21.0973C10.4651 21.0973 11.3126 20.7578 12.0176 20.0715C12.7226 19.3851 13.1276 18.4848 13.2476 17.363L15.1826 1.21588C15.2051 1.0978 15.2576 0.99448 15.3401 0.913301C15.4226 0.832123 15.5201 0.787842 15.6326 0.787842H20.4026C20.5151 0.787842 20.6126 0.832123 20.68 0.913301C20.7475 0.99448 20.7701 1.0978 20.7476 1.21588L18.8126 17.363C18.6026 19.1121 18.0551 20.6545 17.1551 21.9902C16.2551 23.3334 15.0925 24.3665 13.66 25.0971C12.2275 25.8278 10.6301 26.1894 8.85256 26.1894C6.40756 26.1894 4.46505 25.5104 3.02505 24.1451H3.03255Z"
                                                    fill="#F5F5F5"/>
                                                <path
                                                    d="M33.0926 25.5768L30.2951 16.0347C30.2501 15.9387 30.1826 15.8944 30.0851 15.8944H27.8726C27.7601 15.8944 27.7001 15.9535 27.7001 16.0716L26.5976 25.4735C26.5751 25.5916 26.5226 25.6949 26.4401 25.7761C26.3576 25.8573 26.2601 25.9016 26.1476 25.9016H21.3776C21.2651 25.9016 21.1676 25.8573 21.1001 25.7761C21.0326 25.6949 21.0101 25.5916 21.0326 25.4735L23.9051 1.21588C23.9051 1.0978 23.9501 0.99448 24.0401 0.913301C24.1301 0.832123 24.2351 0.787842 24.3551 0.787842H34.3151C36.3401 0.787842 37.9451 1.38561 39.1226 2.58115C40.3001 3.77669 40.8851 5.39288 40.8851 7.42235C40.8851 7.65851 40.8626 8.04226 40.8176 8.57361C40.6076 10.175 40.0676 11.5625 39.1901 12.7359C38.3126 13.9093 37.1876 14.7579 35.8001 15.2819C35.6876 15.3336 35.6501 15.4148 35.6951 15.5328L38.9426 25.3997C38.9651 25.4514 38.9801 25.5104 38.9801 25.5768C38.9801 25.7909 38.8451 25.9016 38.5676 25.9016H33.5576C33.3251 25.9016 33.1751 25.7909 33.1076 25.5768H33.0926ZM28.8776 6.05707L28.2926 11.1492C28.2476 11.2673 28.2926 11.3263 28.4276 11.3263H32.1626C33.0626 11.3263 33.8051 11.0385 34.3901 10.4629C34.9751 9.88723 35.2751 9.13448 35.2751 8.20462C35.2751 7.48877 35.0501 6.92052 34.6001 6.49987C34.1501 6.07921 33.5426 5.87257 32.7851 5.87257H29.0876C28.9526 5.87257 28.8776 5.93162 28.8776 6.04969V6.05707Z"
                                                    fill="#F5F5F5"/>
                                                <path
                                                    d="M57.745 13.0532C59.38 14.0347 60.1975 15.5771 60.1975 17.6804C60.1975 17.8944 60.175 18.2634 60.13 18.7947C59.83 21.1858 58.84 22.9717 57.16 24.1378C55.48 25.3112 53.395 25.8942 50.905 25.8942H41.9875C41.875 25.8942 41.7775 25.8499 41.71 25.7687C41.6425 25.6875 41.62 25.5842 41.6425 25.4661L44.515 1.20849C44.515 1.09041 44.56 0.987092 44.65 0.905913C44.74 0.824734 44.845 0.780457 44.965 0.780457H53.605C56.0725 0.780457 57.9475 1.23801 59.2225 2.14573C60.505 3.05346 61.1425 4.51467 61.1425 6.522C61.1425 6.78767 61.12 7.20095 61.075 7.77658C60.775 10.1455 59.68 11.8281 57.79 12.8318C57.655 12.9056 57.64 12.972 57.7525 13.0458L57.745 13.0532ZM53.8225 19.9755C54.385 19.4515 54.67 18.7209 54.67 17.7837C54.67 17.09 54.4525 16.5586 54.01 16.1896C53.575 15.8206 52.9375 15.6361 52.105 15.6361H48.5125C48.4 15.6361 48.34 15.6952 48.34 15.8133L47.755 20.588C47.755 20.7061 47.815 20.7652 47.9275 20.7652H51.49C52.48 20.7652 53.26 20.4995 53.8225 19.9755ZM49.48 6.05707L48.9625 10.5809C48.9175 10.699 48.9625 10.758 49.0975 10.758H52.42C53.3425 10.758 54.07 10.5514 54.595 10.1308C55.1275 9.7101 55.45 9.11971 55.5625 8.35221C55.6525 7.56256 55.48 6.95003 55.045 6.522C54.61 6.09397 53.9275 5.87995 53.005 5.87995H49.6825C49.5475 5.87995 49.4725 5.93899 49.4725 6.05707H49.48Z"
                                                    fill="#F5F5F5"/>
                                                <path
                                                    d="M78.6775 0.913301C78.76 0.832123 78.8575 0.787842 78.97 0.787842H83.74C83.8525 0.787842 83.95 0.832123 84.0175 0.913301C84.085 0.99448 84.1075 1.0978 84.085 1.21588L81.2125 25.4735C81.19 25.5916 81.1375 25.6949 81.055 25.7761C80.9725 25.8573 80.875 25.9016 80.7625 25.9016H76.2025C75.97 25.9016 75.82 25.8056 75.7525 25.6137L69.67 11.9093C69.625 11.8355 69.58 11.806 69.535 11.8208C69.49 11.8355 69.4675 11.8872 69.4675 11.9831L67.915 25.4735C67.8925 25.5916 67.84 25.6949 67.7575 25.7761C67.675 25.8573 67.5775 25.9016 67.465 25.9016H62.695C62.5825 25.9016 62.485 25.8573 62.4175 25.7761C62.35 25.6949 62.3275 25.5916 62.35 25.4735L65.2225 1.21588C65.2225 1.0978 65.2675 0.99448 65.3575 0.913301C65.4475 0.832123 65.5525 0.787842 65.6725 0.787842H70.27C70.48 0.787842 70.615 0.88378 70.6825 1.07566L76.765 14.7432C76.7875 14.817 76.825 14.8465 76.87 14.8317C76.915 14.817 76.9525 14.7653 76.975 14.6694L78.5275 1.21588C78.55 1.0978 78.6025 0.99448 78.685 0.913301H78.6775Z"
                                                    fill="#F5F5F5"/>
                                                <path
                                                    d="M89.2226 25.075C87.8276 24.337 86.7476 23.2817 85.9751 21.9164C85.2026 20.5511 84.8201 18.9718 84.8201 17.1785V9.42965C84.8201 7.65848 85.2026 6.10132 85.9751 4.75081C86.7476 3.40029 87.8276 2.35235 89.2226 1.61436C90.6176 0.876372 92.2376 0.5 94.0826 0.5C95.9276 0.5 97.5476 0.854234 98.9426 1.55532C100.338 2.26379 101.418 3.25269 102.19 4.53679C102.963 5.81351 103.345 7.29687 103.345 8.96472C103.345 9.0828 103.308 9.17873 103.225 9.25253C103.143 9.32633 103.045 9.36323 102.933 9.36323L98.0201 9.68794C97.7426 9.68794 97.6076 9.55511 97.6076 9.29681C97.6076 8.17507 97.2851 7.27473 96.6401 6.60316C95.9951 5.93159 95.1401 5.59949 94.0826 5.59949C93.0251 5.59949 92.1701 5.93897 91.5251 6.6253C90.8801 7.30424 90.5576 8.19721 90.5576 9.29681V17.4442C90.5576 18.5438 90.8801 19.4294 91.5251 20.1009C92.1701 20.7725 93.0251 21.1046 94.0826 21.1046C95.1401 21.1046 95.9951 20.7725 96.6401 20.1009C97.2851 19.4294 97.6076 18.5438 97.6076 17.4442C97.6076 17.1785 97.7426 17.0531 98.0201 17.0531L102.933 17.304C103.045 17.304 103.143 17.3409 103.225 17.4147C103.308 17.4885 103.345 17.5696 103.345 17.6656C103.345 19.363 102.955 20.8611 102.19 22.1526C101.418 23.444 100.338 24.4403 98.9426 25.1488C97.5476 25.8572 95.9276 26.2041 94.0826 26.2041C92.2376 26.2041 90.6176 25.8351 89.2226 25.0897V25.075Z"
                                                    fill="#F5F5F5"/>
                                                <path
                                                    d="M110.342 25.1266C108.925 24.3518 107.822 23.2522 107.042 21.8426C106.255 20.433 105.865 18.7947 105.865 16.9276V9.75436C105.865 7.93891 106.255 6.3301 107.042 4.92793C107.822 3.52575 108.925 2.44091 110.342 1.66602C111.76 0.891135 113.402 0.5 115.27 0.5C117.137 0.5 118.787 0.891135 120.212 1.66602C121.645 2.44091 122.747 3.53313 123.535 4.92793C124.315 6.3301 124.712 7.93891 124.712 9.75436V16.9276C124.712 18.7947 124.322 20.433 123.535 21.8426C122.747 23.2522 121.645 24.3518 120.212 25.1266C118.78 25.9015 117.137 26.2927 115.27 26.2927C113.402 26.2927 111.76 25.9015 110.342 25.1266ZM117.948 20.0862C118.63 19.3482 118.967 18.3519 118.967 17.1047V9.68056C118.967 8.46288 118.63 7.47398 117.948 6.72123C117.265 5.96849 116.372 5.59211 115.27 5.59211C114.167 5.59211 113.305 5.96849 112.622 6.72123C111.94 7.47398 111.602 8.46288 111.602 9.68056V17.1047C111.602 18.3519 111.94 19.3408 112.622 20.0862C113.305 20.8316 114.182 21.2006 115.27 21.2006C116.357 21.2006 117.273 20.8316 117.948 20.0862Z"
                                                    fill="#F5F5F5"/>
                                                <path
                                                    d="M140.193 25.5768L136.113 16.0347C136.068 15.9387 136 15.8944 135.903 15.8944H133.623C133.51 15.8944 133.45 15.9535 133.45 16.0716V25.4735C133.45 25.5916 133.413 25.6949 133.33 25.7761C133.248 25.8573 133.15 25.9016 133.038 25.9016H128.125C128.013 25.9016 127.915 25.8573 127.833 25.7761C127.75 25.6949 127.713 25.5916 127.713 25.4735V1.21588C127.713 1.0978 127.75 0.99448 127.833 0.913301C127.915 0.832123 128.013 0.787842 128.125 0.787842H138.393C139.915 0.787842 141.25 1.11256 142.405 1.75461C143.56 2.40404 144.453 3.31914 145.083 4.49992C145.713 5.6807 146.035 7.0386 146.035 8.57361C146.035 10.1086 145.653 11.5625 144.895 12.7359C144.138 13.9093 143.073 14.7579 141.715 15.2819C141.603 15.3336 141.565 15.4148 141.61 15.5328L146.17 25.3997C146.215 25.4957 146.238 25.5695 146.238 25.6137C146.238 25.8056 146.11 25.9016 145.855 25.9016H140.665C140.433 25.9016 140.275 25.7909 140.178 25.5768H140.193ZM133.45 6.05707V11.1492C133.45 11.2673 133.51 11.3263 133.623 11.3263H137.463C138.318 11.3263 139.008 11.0828 139.54 10.5883C140.073 10.0939 140.335 9.44444 140.335 8.63265C140.335 7.82086 140.073 7.12715 139.54 6.62532C139.008 6.12349 138.318 5.87257 137.463 5.87257H133.623C133.51 5.87257 133.45 5.93162 133.45 6.04969V6.05707Z"
                                                    fill="#F5F5F5"/>
                                                <path
                                                    d="M166.008 5.7545C165.925 5.83568 165.828 5.87996 165.715 5.87996H154.863C154.75 5.87996 154.69 5.93899 154.69 6.05707V10.4702C154.69 10.5883 154.75 10.6474 154.863 10.6474H161.815C161.928 10.6474 162.025 10.6916 162.108 10.7728C162.19 10.854 162.228 10.9573 162.228 11.0754V15.2745C162.228 15.3926 162.19 15.4959 162.108 15.5771C162.025 15.6583 161.928 15.7026 161.815 15.7026H154.863C154.75 15.7026 154.69 15.7616 154.69 15.8797V20.6176C154.69 20.7356 154.75 20.7947 154.863 20.7947H165.715C165.828 20.7947 165.925 20.839 166.008 20.9201C166.09 21.0013 166.128 21.1046 166.128 21.2227V25.4588C166.128 25.5768 166.09 25.6802 166.008 25.7613C165.925 25.8425 165.828 25.8868 165.715 25.8868H149.365C149.253 25.8868 149.155 25.8425 149.073 25.7613C148.99 25.6802 148.953 25.5768 148.953 25.4588V1.21588C148.953 1.0978 148.99 0.99448 149.073 0.913301C149.155 0.832123 149.253 0.787842 149.365 0.787842H165.715C165.828 0.787842 165.925 0.832123 166.008 0.913301C166.09 0.99448 166.128 1.0978 166.128 1.21588V5.45192C166.128 5.57 166.09 5.67332 166.008 5.7545Z"
                                                    fill="#F5F5F5"/>
                                            </svg>

                                        </div>


                                    </div>

                                    <div className="Frame14">

                                        <span className="LogInWithGoogle">{googleButtonText}</span>

                                        <div className="Frame13">


                                            <GoogleLogin
                                                useOneTap
                                                locale="uk"
                                                size="large"
                                                width="300px"
                                                onSuccess={authSuccess}
                                                onError={authError}

                                            />
                                        </div>

                                    </div>

                                </div>

                                <div className="Frame27">

                                    <div className="Frame26">

                                        <form onSubmit={handleSubmit}>
                                            <div className="Frame57">

                                                <div className="Frame54">

                                                    <div className="SignUpWithEmail-Div">
                                                        <span
                                                            className="SignUpWithEmail-Text">or Sign Up with Email</span>
                                                    </div>

                                                    <div className="Frame53">

                                                        <div className="Frame11-2">

                                                            <label className="Label-FirstName">Email</label>

                                                            <input
                                                                className="Input-FirstName"
                                                                type="text"
                                                                value={values.email}
                                                                name={"email"}
                                                                onChange={handleChange}
                                                            />

                                                            {errors.email && touched.email ? (
                                                                <>
                                                                    <div className="ErorButton-Div-False">
                                                                        <button>
                                                                            <svg xmlns="http://www.w3.org/2000/svg"
                                                                                 width="24" height="25"
                                                                                 viewBox="0 0 24 25" fill="none">
                                                                                <path
                                                                                    d="M12 22.5C17.5228 22.5 22 18.0228 22 12.5C22 6.97715 17.5228 2.5 12 2.5C6.47715 2.5 2 6.97715 2 12.5C2 18.0228 6.47715 22.5 12 22.5Z"
                                                                                    stroke="#FF5050" strokeWidth="2"
                                                                                    strokeLinecap="round"
                                                                                    strokeLinejoin="round"/>
                                                                                <path d="M15 9.5L9 15.5"
                                                                                      stroke="#FF5050" strokeWidth="2"
                                                                                      strokeLinecap="round"
                                                                                      strokeLinejoin="round"/>
                                                                                <path d="M9 9.5L15 15.5"
                                                                                      stroke="#FF5050" strokeWidth="2"
                                                                                      strokeLinecap="round"
                                                                                      strokeLinejoin="round"/>
                                                                            </svg>
                                                                        </button>
                                                                    </div>

                                                                    <div className="Frame33-3">
                                                                        <div className="Polygon3-3">
                                                                            <svg id="open"
                                                                                 xmlns="http://www.w3.org/2000/svg"
                                                                                 width="26" height="30"
                                                                                 viewBox="0 0 26 30" fill="none">
                                                                                <path
                                                                                    d="M0 15L25.5 0.277568L25.5 29.7224L0 15Z"
                                                                                    fill="#2E38A2"/>
                                                                            </svg>
                                                                        </div>
                                                                        <div className="Frame32">
                                                                            <span
                                                                                className="Text-Error">{errors.email}</span>
                                                                        </div>
                                                                    </div>
                                                                </>
                                                            ) : (
                                                                <div className="ErorButton-Div-Ok">
                                                                    <button>
                                                                        <svg xmlns="http://www.w3.org/2000/svg"
                                                                             width="24" height="25" viewBox="0 0 24 25"
                                                                             fill="none">
                                                                            <path
                                                                                d="M16.5 9.03845L10.3077 15.5385L8 13.1408"
                                                                                stroke="#0D0D0D" strokeWidth="2"
                                                                                strokeLinecap="round"
                                                                                strokeLinejoin="round"/>
                                                                            <path
                                                                                d="M12 22.0385C17.5228 22.0385 22 17.5613 22 12.0385C22 6.5156 17.5228 2.03845 12 2.03845C6.47715 2.03845 2 6.5156 2 12.0385C2 17.5613 6.47715 22.0385 12 22.0385Z"
                                                                                stroke="#0D0D0D" strokeWidth="2"
                                                                                strokeLinecap="round"
                                                                                strokeLinejoin="round"/>
                                                                        </svg>
                                                                    </button>
                                                                </div>
                                                            )}


                                                        </div>

                                                        <div className="Frame16">

                                                            <label className="Label-LastName">Password</label>

                                                            <input
                                                                className="Input-LastName"
                                                                type="text"
                                                                value={values.password}
                                                                name={"password"}
                                                                onChange={handleChange}
                                                            />


                                                            {errors.password && touched.password ? (
                                                                <>

                                                                    <div className="ErorButton-Div-False2">

                                                                        <button>
                                                                            <svg xmlns="http://www.w3.org/2000/svg"
                                                                                 width="24" height="25"
                                                                                 viewBox="0 0 24 25" fill="none">
                                                                                <path
                                                                                    d="M12 22.5C17.5228 22.5 22 18.0228 22 12.5C22 6.97715 17.5228 2.5 12 2.5C6.47715 2.5 2 6.97715 2 12.5C2 18.0228 6.47715 22.5 12 22.5Z"
                                                                                    stroke="#FF5050" strokeWidth="2"
                                                                                    strokeLinecap="round"
                                                                                    strokeLinejoin="round"/>
                                                                                <path d="M15 9.5L9 15.5"
                                                                                      stroke="#FF5050" strokeWidth="2"
                                                                                      strokeLinecap="round"
                                                                                      strokeLinejoin="round"/>
                                                                                <path d="M9 9.5L15 15.5"
                                                                                      stroke="#FF5050" strokeWidth="2"
                                                                                      strokeLinecap="round"
                                                                                      strokeLinejoin="round"/>
                                                                            </svg>
                                                                        </button>
                                                                    </div>

                                                                    <div className="Frame33-2">

                                                                        <div className="Polygon2">
                                                                            <svg id="open"
                                                                                 xmlns="http://www.w3.org/2000/svg"
                                                                                 width="26" height="30"
                                                                                 viewBox="0 0 26 30" fill="none">
                                                                                <path
                                                                                    d="M-7.43094e-07 15L25.5 0.277568L25.5 29.7224L-7.43094e-07 15Z"
                                                                                    fill="#2E38A2"/>
                                                                            </svg>
                                                                        </div>

                                                                        <div className="Frame32-2">
                                                                            <span
                                                                                className="Text-Error">{errors.password}</span>
                                                                        </div>
                                                                    </div>
                                                                </>
                                                            ) : (
                                                                <div className="ErorButton-Div-Ok-2">
                                                                    <button>
                                                                        <svg xmlns="http://www.w3.org/2000/svg"
                                                                             width="24" height="25" viewBox="0 0 24 25"
                                                                             fill="none">
                                                                            <path
                                                                                d="M16.5 9.03845L10.3077 15.5385L8 13.1408"
                                                                                stroke="#0D0D0D" strokeWidth="2"
                                                                                strokeLinecap="round"
                                                                                strokeLinejoin="round"/>
                                                                            <path
                                                                                d="M12 22.0385C17.5228 22.0385 22 17.5613 22 12.0385C22 6.5156 17.5228 2.03845 12 2.03845C6.47715 2.03845 2 6.5156 2 12.0385C2 17.5613 6.47715 22.0385 12 22.0385Z"
                                                                                stroke="#0D0D0D" strokeWidth="2"
                                                                                strokeLinecap="round"
                                                                                strokeLinejoin="round"/>
                                                                        </svg>
                                                                    </button>
                                                                </div>
                                                            )}

                                                            <div className="Frame30">

                                                                <div className="Div-Button-Next-Step">

                                                                    <button className="Button-Next-Step">Sign Up</button>

                                                                    {valid.length > 0 &&
                                                                        (
                                                                            <div className="error">
                                                                                {valid.map((err, index) => (
                                                                                    <p id="errorSpan" key={index}>{err.errorMessage}</p>
                                                                                ))}
                                                                            </div>
                                                                        )}

                                                                    <div className="Steps1">
                                                                        <span>Steps: 2 out of 2</span>
                                                                    </div>

                                                                </div>

                                                            </div>


                                                        </div>
                                                    </div>

                                                </div>
                                            </div>
                                        </form>


                                    </div>

                                </div>


                            </div>


                        </div>

                    </div>

                </div>
            </div>

        </>
    )
}

export default RegisterSecondPage;