import {useEffect, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../../../store";
import * as yup from "yup";
import {useFormik} from "formik";
import http from "../../../http_common";
import "../Style-UserProfile.scss";
import ProfileDefaultHeader from "../default/ProfileDefaultHeader";
import DefaultSideBar from "../default/DefaultSideBar";
import {AuthUserActionType, IUserToken} from "../../authentication/type.ts";
import 'react-datepicker/dist/react-datepicker.css';
import setAuthToken from "../../../helpers/setAuthToken.ts";
import {jwtDecode} from "jwt-decode";
import {IEditAddressUser} from "../types.ts";

const AddressPage = () => {

    const dispatch = useDispatch();

    const init: IEditAddressUser = {
        id:0,
        firstName: "",
        lastName: "",
        phoneNumber: "",
        country:0,
        town:"",
        address:"",
        postCode:0
    };

    const currentUser = useSelector((state: RootState) => state.auth.user);

    const changeSchema = yup.object({

        phoneNumber: yup
            .string()
            .required("Phone number cannot be empty")
            .min(2, "Телефон повиннен містити мінімум 5 символів"),

        address: yup
            .string()
            .required("Address cannot be empty")
            .min(2, "Адреса повинно містити мінімум 2 символи")
            .max(20, "Прізвище повинно містити не більше 20 символів"),

        town: yup
            .string()
            .required("Town cannot be empty")
            .min(2, "Місто повинно містити мінімум 2 символи")
            .max(20, "Прізвище повинно містити не більше 20 символів"),
    });

    interface Country {
        id: number;
        nameCountry: string;
    }

    const[Countries, setCountries]=useState<Country[]>([]);

    useEffect(() => {

        http.get("api/Country/GetAllCountries").then(resp=>{

            setCountries(resp.data);
            console.log("Прийшли країни", resp.data);
        })

    }, []);


    const [countryId, setCountryId] = useState<number>(1);

    const handleCountryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const newValue = Number(e.target.value);
        console.log("Прийшло значення:", newValue);
        setCountryId(newValue);
    };

    const onFormikSubmit = async (values: IEditAddressUser) => {

        if(countryId!=null)
        {
            values.country=countryId;
        }

        console.log("Відправляємо на сервер", values);
        try {
            const result = await http.put("api/Account/edit-adrress", values, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });

            dispatch({
                type: AuthUserActionType.UPDATE_USER,
                payload: {
                    firstName: values.firstName,
                    lastName: values.lastName,
                    phoneNumber: values.phoneNumber,
                    country:values.country,
                    town:values.town,
                    address:values.address,
                    postCode:values.postCode
                },
            });

            const token = result.data.token as string;

            setAuthToken(token);

            const user = jwtDecode<IUserToken>(token);

            console.log("Оновлений користувач", user);

            dispatch({type: AuthUserActionType.LOGIN_USER, payload: user});
        }
        catch (error)
        {
            console.error("Помилка при відправці на сервер:", error);
        }
    };

    const formik = useFormik({
        initialValues: init,
        onSubmit: onFormikSubmit,
        validationSchema: changeSchema,
    });

    const {values, touched, errors, handleSubmit, handleChange, setFieldValue} = formik;

    useEffect(() => {

        console.log("Прийшов користувач", currentUser);

        if (currentUser)
        {
            setFieldValue("id", currentUser.id);
            setFieldValue("firstName", currentUser.firstName);
            setFieldValue("lastName", currentUser.lastName);
            setFieldValue("phoneNumber", currentUser.phoneNumber);
            setFieldValue("town", currentUser.town);
            setFieldValue("address", currentUser.address);
            setFieldValue("postCode", currentUser.postCode);

            if(currentUser.country)
            {
                setCountryId(currentUser.country);
            }

        }
    }, [currentUser]);



    return (
        <>
            <div className="centered-div">
                <ProfileDefaultHeader backLink="/user-info"/>
            </div>

            <div className="main-container">
                <DefaultSideBar/>
                <div className="content-container">
                    <div className="div-with-text">
                        <h2>Address Information</h2>
                        <p>
                            You`ve already saved the address. Make sure your details are valid.<br/>
                        </p>
                        <p className="blue-text">(*Indicates a required field).</p>
                    </div>

                    <div className="containerChange">
                        <form onSubmit={handleSubmit} className="form">
                            <div className="form-row">
                                <div className="input-group">
                                    <label className="blue-text label">First Name:</label>
                                    <input
                                        className={`input ${touched.firstName && errors.firstName ? 'border-red-500' : 'border-gray-300'}`}
                                        type="text"
                                        name="firstName"
                                        value={values.firstName}
                                        onChange={handleChange}
                                    />

                                </div>
                                <div className="input-group">
                                    <label className="blue-text label">Last Name:</label>
                                    <input
                                        className={`input ${touched.lastName && errors.lastName ? 'border-red-500' : 'border-gray-300'}`}
                                        type="text"
                                        name="lastName"
                                        value={values.lastName}
                                        onChange={handleChange}
                                    />
                                </div>
                            </div>

                            <div className="form-row">
                                <div className="input-group">
                                    <label className="blue-text label">Mobile:</label>
                                    <input
                                        className={`input ${touched.phoneNumber && errors.phoneNumber ? 'border-red-500' : 'border-gray-300'}`}
                                        type="text"
                                        name="phoneNumber"
                                        value={values.phoneNumber}
                                        onChange={handleChange}
                                    />
                                    {touched.phoneNumber && errors.phoneNumber ? (
                                        <div className="text-red-500 text-xs mt-1">{errors.phoneNumber}</div>
                                    ) : null}
                                </div>

                                <div className="input-group">
                                    <label className="blue-text label margin10 ">Country:</label>

                                    <select className="input border-gray-300 small"

                                      value={countryId}

                                     onChange={(e) => {
                                                console.log("Зміна селектора", e.target.value);
                                                handleCountryChange(e);
                                            }}

                                    >
                                        {Countries.map((country) => (
                                            <option key={country.id} value={country.id} >
                                                {country.nameCountry}
                                            </option>
                                        ))}
                                    </select>

                                </div>

                                <div className="input-group">
                                    <label className="blue-text label margin10">City:</label>
                                    <input
                                        type="text"
                                        name="town"
                                        value={values.town}
                                        onChange={handleChange}
                                        className="input border-gray-300 small"
                                    />

                                    {touched.town && errors.town ? (
                                        <div className="text-red-500 text-xs mt-1">{errors.town}</div>
                                    ) : null}

                                </div>


                            </div>


                            <div className="form-row">
                                <div className="input-group">
                                    <label className="blue-text label">Address:</label>
                                    <input
                                        className={`input 'border-red-500' : 'border-gray-300'}`}
                                        type="text"
                                        name="address"
                                        value={values.address}
                                        onChange={handleChange}
                                    />

                                    {touched.address && errors.address ? (
                                        <div className="text-red-500 text-xs mt-1">{errors.address}</div>
                                    ) : null}

                                </div>

                                <div className="input-group">
                                    <label className="blue-text label">PostCode:</label>
                                    <input
                                        className={`input  'border-red-500' : 'border-gray-300'}`}
                                        type="number"
                                        name="postCode"
                                        value={values.postCode}
                                        onChange={handleChange}
                                    />
                                </div>
                            </div>


                            <div className="form-row button-container">
                                <button type="submit" className="button save-button">Update</button>
                            </div>
                        </form>


                    </div>
                </div>
            </div>
        </>
    )
        ;
};

export default AddressPage;
