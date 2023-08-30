<script lang="ts">
    import izunaLogo from "./assets/favicon_izuna.png";
    import { A, Navbar, NavBrand } from "flowbite-svelte";
    import { SvelteToast } from "@zerodevx/svelte-toast";
    import { Router, Link, Route } from "svelte-routing";

    // Pages and Components
    import Signup from "./pages/Signup.svelte";
    import About from "./pages/About.svelte";
    import MainPage from "./pages/MainPage.svelte";

    export let url = "";
</script>

<SvelteToast />
<main class="mx-2">
    <Navbar let:hidden let:toggle>
        <NavBrand class="mx-auto">
            <img src={izunaLogo} alt="" class="h-16 mr-4" />
            <span class="text-xl font-bold">Izuna-YTDL</span>
        </NavBrand>
    </Navbar>
    <div class="container mx-auto text-center">
        <Router {url}>
            <Route path="/">
                <MainPage />
            </Route>
            <Route path="/signup"><Signup /></Route>
            <Route path="/about">
                <About />
                <Link to="/" class="text-center mx-auto w-full">
                    <A>Main Page</A>
                </Link>
            </Route>
        </Router>
    </div>
</main>
