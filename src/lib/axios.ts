import { toast } from "@zerodevx/svelte-toast"
import axiosStatic from "axios"
import { loggedIn } from "../stores/auth"

const apiAxios = axiosStatic.create({
    baseURL: "/api/",
})

apiAxios.interceptors.request.use((req) => {
    const accessToken = localStorage.getItem("access_token")
    if (accessToken != null) {
        req.headers.set("Authorization", `Bearer ${accessToken}`)
    }
    return req;
})

apiAxios.interceptors.response.use((res) => {
    if (res.status === 401) {
        toast.push("Login credential error. Please relogin")
        loggedIn.set(false)
    }
    return res
})

export default apiAxios
