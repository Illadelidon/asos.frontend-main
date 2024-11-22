import {Outlet, useNavigate} from "react-router-dom";
import DefaultHeader from "../containers/default/DefaultHeader.tsx";
import {useSelector} from "react-redux";
import {useEffect} from "react";

const UserLayout = () => {

    const navigate = useNavigate();
    const {isAuth, user} = useSelector((store: any) => store.auth);
    const isUser = user?.roles === "User";

    useEffect(() => {
        if(isAuth)
        {
            if(!isUser)
            {
                navigate("/pages/403");
            }
        }
        else
        {
            navigate('/login');
        }
    },[]);


    return (
        <>
            <DefaultHeader />
            {isUser && <Outlet/> }
        </>
    );
};

export default UserLayout;