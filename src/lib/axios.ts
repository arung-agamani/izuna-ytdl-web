import axiosStatic from "axios"
import Cookies from "js-cookie"

const axios = axiosStatic.create({
    baseURL: "/api/",
    headers: {
        'X-CSRF-TOKEN': Cookies.get("csrf_access_token")
    }
})

export default axios
