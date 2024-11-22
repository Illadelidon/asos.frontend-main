// const REMOTE_HOST_NAME: string = import.meta.env.VITE_BASE_URL as string;
//
// console.log("Хост",REMOTE_HOST_NAME);
// const APP_ENV={
//     BASE_URL:REMOTE_HOST_NAME
// }
//
// export { APP_ENV };

const BASE_URL: string = import.meta.env.VITE_API_URL as string;

const APP_ENV={
    BASE_URL:BASE_URL
}

export { APP_ENV };