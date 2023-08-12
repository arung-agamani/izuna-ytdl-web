<script lang="ts">
    import izunaLogo from "./assets/favicon_izuna.png";
    import {
        Navbar,
        NavBrand,
        NavHamburger,
        NavLi,
        NavUl,
        Toast,
    } from "flowbite-svelte";
    import { SvelteToast, toast } from "@zerodevx/svelte-toast";
    import { Input, Label, Button } from "flowbite-svelte";
    import { loggedIn, login } from "./stores/auth";
    import { form, field } from "svelte-forms";
    import { required } from "svelte-forms/validators";
    import { Router, Link, Route } from "svelte-routing";
    import Cookies from "js-cookie";
    // Pages and Components
    import Signup from "./components/Signup.svelte";
    import { onMount } from "svelte";
    import DownloadInfo from "./components/DownloadInfo.svelte";
    import axios from "./lib/axios";
    import { AxiosError } from "axios";

    const username = field("username", "", [required()]);
    const password = field("password", "", [required()]);
    const loginForm = form(username, password);
    const handleLogin = () => {
        const data = loginForm.summary();
        login(data.username, data.password);
    };

    const urlField = field("url", "", [required()]);
    const downloadForm = form(urlField);
    const handleDownload = async () => {
        const data = downloadForm.summary();
        try {
            const { data: res } = await axios.post(
                "downloader/download",
                data,
                {
                    withCredentials: true,
                    headers: {
                        "X-CSRF-TOKEN": Cookies.get("csrf_access_token"),
                    },
                }
            );
            toast.push(res.message);
            if (downloadInfoRef) {
                downloadInfoRef.fetchDownloadData();
            }
        } catch (error) {
            if (error instanceof AxiosError) {
                if (error.response.status === 400) {
                    toast.push(error.response.data.message);
                    return;
                } else if (error.response.status === 429) {
                    toast.push(error.response.data.message);
                    return;
                }
            }
            toast.push("Something went wrong when downloading");
        }
    };

    onMount(async () => {
        try {
            const res = await axios.get("user/me", { withCredentials: true });
            loggedIn.set(true);
        } catch (error) {
            if (error instanceof AxiosError) {
                if (error.response.status !== 401) {
                    // excempt unauthorized error from showing toast
                    toast.push("Error on getting user/me endpoint");
                    console.error(error);
                } else {
                    toast.push("You're not logged in. Please (re)login");
                }
            }
            loggedIn.set(false);
        }
    });
    export let url = "/";
    let downloadInfoRef;
</script>

<SvelteToast />
<main class="mx-2">
    <Navbar let:hidden let:toggle>
        <NavBrand class="mx-auto">
            <img src={izunaLogo} alt="" class="h-16 mr-4" />
            <span class="text-xl font-bold">Izuna-YTDL</span>
        </NavBrand>
        <!-- <NavHamburger on:click={toggle} /> -->
        <NavUl {hidden} />
    </Navbar>
    <div class="container mx-auto">
        <!-- <Toast>Awoo</Toast> -->
        <p class="text-3xl text-center">
            Download and Convert Youtube Videos on the fly~~
        </p>
        <Router {url}>
            <Route path="/">
                {#if $loggedIn}
                    <div class="container max-w-3xl mx-auto w-full">
                        <p class="text-xl text-center my-4">
                            Input valid Youtube video URL here and let us do the
                            ninjutsu behind the screen
                        </p>
                        <Input
                            type="text"
                            id="url-input"
                            class="w-full"
                            placeholder="https://www.youtube.com/watch?v=dQw4w9WgXcQ"
                            bind:value={$urlField.value}
                        />
                        <Button
                            class="mt-2 w-full"
                            type="button"
                            on:click={handleDownload}>Download</Button
                        >
                        <DownloadInfo bind:this={downloadInfoRef} />
                    </div>
                {:else}
                    <p class="text-xl text-center my-4">
                        You are not logged in. Please login first or <Link
                            class="text-blue-600 hover:text-blue-300 hover:cursor-pointer"
                            to="signup">signup</Link
                        >
                    </p>
                    <form
                        class="max-w-2xl mx-auto"
                        on:submit|preventDefault={handleLogin}
                    >
                        <Label>Username</Label>
                        <Input
                            type="text"
                            id="username-input"
                            class="max-w-2xl mx-auto"
                            bind:value={$username.value}
                        />
                        <Label class="mt-2">Password</Label>
                        <Input
                            type="password"
                            id="password-input"
                            class="max-w-2xl mx-auto"
                            bind:value={$password.value}
                        />
                        <Button class="mt-2" type="submit">Login</Button>
                    </form>
                {/if}
            </Route>
            <Route path="/signup"><Signup /></Route>
        </Router>
    </div>
</main>
