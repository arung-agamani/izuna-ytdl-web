import { toast } from "@zerodevx/svelte-toast"
import axiosStatic, { AxiosHeaders } from "axios"
import Cookies from "js-cookie"
import { loggedIn } from "../stores/auth"

const axios = axiosStatic.create({
    baseURL: "/api/",
})

axios.interceptors.request.use((req) => {
    req.headers.set("X-CSRF-TOKEN", Cookies.get("csrf_access_token"))
    return req;
})

axios.interceptors.response.use((res) => {
    if (res.status === 401) {
        toast.push("Login credential error. Please relogin")
        loggedIn.set(false)
    }
    return res
})

export default axios
