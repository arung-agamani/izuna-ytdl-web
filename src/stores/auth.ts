import { writable } from "svelte/store";
import axios from "../lib/axios";
import { toast } from "@zerodevx/svelte-toast";
import { AxiosError } from "axios";

export const store = writable(null);
export const loggedIn = writable(false);
export const userInfo = writable({identity: ""});

export const login = async (username: string, password: string) => {
    try {
        const res = await axios.post("user/login", { username, password })
        loggedIn.set(true)
        // toast.push("Logged in!")
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
        const res = await axios.post("user/logout", {}, {withCredentials: true})
        loggedIn.set(false)
        toast.push(res.data.message)
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
      const res = await axios.get("user/me", { withCredentials: true });
      userInfo.set(res.data);
      loggedIn.set(true);
    } catch (error) {
      if (error instanceof AxiosError) {
        if (error.response.status !== 401) {
          // excempt unauthorized error from showing toast
          toast.push("Error on getting user/me endpoint");
          console.error(error);
          // } else {
          //   toast.push("You're not logged in. Please (re)login");
        }
      }
      loggedIn.set(false);
    }
}