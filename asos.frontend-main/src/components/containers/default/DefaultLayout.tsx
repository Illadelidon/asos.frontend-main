import { Outlet } from "react-router-dom";
import DefaultHeader from "./DefaultHeader";

const DefaultLayout = () => {
    return (
        <>
            <DefaultHeader />
                {/* Сюди підставляється компонет один із групи комеонетів, які відносяться до даного Layout */}
                <Outlet/>
        </>
    );
};

export default DefaultLayout;