import {  Bounce } from 'react-toastify';
const toastifyOptions = (autoCloseTime) => ({
    position: "top-right",
    autoClose: autoCloseTime,
    hideProgressBar: false,
    closeOnClick: false,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    theme: "light",
    transition: Bounce,
})

export {
    toastifyOptions
}