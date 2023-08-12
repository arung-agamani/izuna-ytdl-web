import { toast } from "@zerodevx/svelte-toast"
import axiosStatic from "axios"
import Cookies from "js-cookie"
import { loggedIn } from "../stores/auth"

const axios = axiosStatic.create({
    baseURL: "/api/",
    headers: {
        'X-CSRF-TOKEN': Cookies.get("csrf_access_token")
    }
})

axios.interceptors.response.use((res) => {
    if (res.status === 401) {
        toast.push("Login credential error. Please relogin")
        loggedIn.set(false)
    }
    return res
})

export default axios
