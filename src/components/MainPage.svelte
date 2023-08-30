<script lang="ts">
  import { Input, Label, Button } from "flowbite-svelte";
  import { A } from "flowbite-svelte";
  import DownloadInfo from "./DownloadInfo.svelte";
  import { Link } from "svelte-routing";
  import { form, field } from "svelte-forms";
  import { required } from "svelte-forms/validators";
  import { loggedIn, login } from "../stores/auth";
  import axios from "../lib/axios";
  import Cookies from "js-cookie";
  import { toast } from "@zerodevx/svelte-toast";
  import { AxiosError } from "axios";
  import { onMount } from "svelte";

  const username = field("username", "", [required()]);
  const password = field("password", "", [required()]);
  const loginForm = form(username, password);
  const handleLogin = () => {
    const data = loginForm.summary();
    login(data.username, data.password);
  };

  const urlField = field("url", "", [required()]);
  const downloadForm = form(urlField);
  let downloadInfoRef;
  const handleDownload = async () => {
    const data = downloadForm.summary();
    try {
      const { data: res } = await axios.post("downloader/download", data, {
        withCredentials: true,
        headers: {
          "X-CSRF-TOKEN": Cookies.get("csrf_access_token"),
        },
      });
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
</script>

<p class="text-3xl text-center">
  Download and Convert Youtube Videos on the fly~~
</p>
{#if $loggedIn}
  <div class="container max-w-3xl mx-auto w-full">
    <p class="text-xl text-center my-4">
      Input valid Youtube video URL here and let us do the ninjutsu behind the
      screen
    </p>
    <Input
      type="text"
      id="url-input"
      class="w-full"
      placeholder="https://www.youtube.com/watch?v=dQw4w9WgXcQ"
      bind:value={$urlField.value}
    />
    <Button class="mt-2 w-full" type="button" on:click={handleDownload}
      >Download</Button
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
  <form class="max-w-2xl mx-auto" on:submit|preventDefault={handleLogin}>
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
<Link to="about" class="text-center mx-auto w-full"><A>About</A></Link>
