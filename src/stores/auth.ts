import { writable } from "svelte/store";
import apiAxios from "../lib/axios";
import { toast } from "@zerodevx/svelte-toast";
import { AxiosError } from "axios";

export const loggedIn = writable(false);
export const userInfo = writable({username: ""});

export const login = async (username: string, password: string) => {
    try {
        let body = new FormData();
        body.append("grant_type", "password")
        body.append("username", username)
        body.append("password", password)
        const res = await apiAxios.post("user/token", body)
        const access_token = res.data.access_token;
        localStorage.setItem("access_token", access_token)
        loggedIn.set(true)
    } catch (error) {
        console.error(error)
        loggedIn.set(false)
        if (error instanceof AxiosError) {
            if (error.response.status === 400) {
                toast.push(error.response.data.message)
            } else {
                toast.push(error.response.data.message || `Unknown error with status ${error.response.status}`)
            }
            return
        }
        toast.push("Something went wrong when logging in")
    }
};

export const logout = async () => {
    try {
        const res = await apiAxios.post("user/logout", {})
        localStorage.setItem("access_token", null)
        loggedIn.set(false)
        toast.push("Logged out successfully")
    } catch (error) {
        console.error(error)
        if (error instanceof AxiosError) {
            toast.push("Something went wrong with request: AxiosError thrown")
            return
        }
        toast.push("Something went wrong when logging out")
    }
}

export const getCurrentUser = async() => {
    try {
      const res = await apiAxios.get("user/me");
      userInfo.set(res.data);
      loggedIn.set(true);
    } catch (error) {
      if (error instanceof AxiosError) {
        if (error.response.status !== 401) {
          // excempt unauthorized error from sowing toast
          toast.push("Error on getting user/me endpoint");
          console.error(error);
          // } else {
          //   toast.push("You're not logged in. Please (re)login");
        }
      }
      loggedIn.set(false);
    }
}