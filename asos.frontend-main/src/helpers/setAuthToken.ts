import http from "../http_common.ts";

const setAuthToken=(token:string)=>{

    if(token)
    {
        http.defaults.headers.common["Authorization"]=`Bearer ${token}`;
        localStorage.token=token;
    }
    else
    {
        delete http.defaults.headers.common["Authorization"];
        localStorage.removeItem("token");
    }
}

export default setAuthToken;