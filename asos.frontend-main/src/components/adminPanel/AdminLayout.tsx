import {Outlet, useNavigate} from "react-router-dom";
import DefaultHeader from "../containers/default/DefaultHeader.tsx";
import {useSelector} from "react-redux";
import {useEffect} from "react";

const AdminLayout = () => {

    const navigate = useNavigate();
    const {isAuth, user} = useSelector((store: any) => store.auth);
    const isAdmin = user?.roles === "Admin";

    useEffect(() => {
        if(isAuth)
        {
            if(!isAdmin)
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
            {isAdmin && <Outlet/> }
        </>
    );
};

export default AdminLayout;