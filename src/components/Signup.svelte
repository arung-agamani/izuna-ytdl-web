<script lang="ts">
    import { Label, Input, Button } from "flowbite-svelte";
    import { field, form } from "svelte-forms";
    import { required } from "svelte-forms/validators";
    import { Link, link } from "svelte-routing";
    import axios from "../lib/axios";
    import { toast } from "@zerodevx/svelte-toast";
    import { AxiosError } from "axios";
    const username = field("username", "", [required()]);
    const password = field("password", "", [required()]);
    const signupCode = field("signup_code", "", [required()]);
    const register = form(username, password, signupCode);
    const handleLogin = async () => {
        const data = register.summary();
        // try {
        //     const res = await fetch('http://howlingmoon.awoo/api/user/register', {
        //         method: "POST",
        //         headers: { "Content-Type": "application/json"},
        //         body: JSON.stringify(data),
        //     }).then(r => r.json())
        //     console.log(res)

        // } catch (error) {
        //     console.error(error)
        // }
        try {
            const res = await axios.post("user/register", data);
            toast.push("Registration complete! Please return to login page.");
        } catch (error) {
            console.error(error);
            if (error instanceof AxiosError) {
                if (error.response.status === 400) {
                    if (error.response.data.message === "validation error") {
                        toast.push(
                            `Invalid data supplied on : ${Object.keys(
                                error.response.data.errors
                            ).join(", ")}`
                        );
                    } else {
                        toast.push(error.response.data.message);
                    }
                } else {
                    toast.push(
                        error.response.data.message ||
                            `Unknown error with status ${error.response.status}`
                    );
                }
                return;
            }
            toast.push("Something went wrong when registering in");
        }
    };
</script>

<p class="text-xl text-center my-4">
    This is where you can signup. <a
        href="/"
        class="text-blue-600 hover:text-blue-300 hover:cursor-pointer"
        use:link>Back to main page</a
    >
</p>
<form class="max-w-2xl mx-auto" on:submit|preventDefault={handleLogin}>
    <Label>Username - 3 characters minimal, only lowercase alphabet</Label>
    <Input
        type="text"
        id="username-input"
        class="max-w-2xl mx-auto"
        bind:value={$username.value}
    />
    <Label class="mt-2"
        >Password - 8 characters minimal, alphanumeric uppercase/lowercase</Label
    >
    <Input
        type="password"
        id="password-input"
        class="max-w-2xl mx-auto"
        bind:value={$password.value}
    />
    <Label class="mt-2"
        >Signup Code - 32 characters alphabet uppercase only</Label
    >
    <Input
        type="text"
        id="signupcode-input"
        class="max-w-2xl mx-auto"
        bind:value={$signupCode.value}
    />
    <Button class="mt-2" type="submit">Signup</Button>
</form>
