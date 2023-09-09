<script lang="ts">
  import { Input, Button } from "flowbite-svelte";
  import { A } from "flowbite-svelte";
  import DownloadInfo from "../components/DownloadInfo.svelte";
  import { Link } from "svelte-routing";
  import { form, field } from "svelte-forms";
  import { required } from "svelte-forms/validators";
  import { getCurrentUser, loggedIn, userInfo } from "../stores/auth";
  import apiAxios from "../lib/axios";
  import Cookies from "js-cookie";
  import { toast } from "@zerodevx/svelte-toast";
  import { AxiosError } from "axios";
  import { onMount } from "svelte";
  import Login from "../components/Login.svelte";

  const urlField = field("url", "", [required()]);
  const downloadForm = form(urlField);

  let downloadInfoRef: DownloadInfo;
  const handleDownload = async () => {
    const data = downloadForm.summary();
    try {
      const { data: res } = await apiAxios.post("downloader/download", data);
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
    await getCurrentUser();
  });
</script>

<p class="text-3xl text-center">
  Download and Convert Youtube Videos on the fly~~
</p>
{#if $loggedIn}
  <div class="container max-w-3xl mx-auto w-full">
    <p class="text-xl text-center my-4">
      Welcome {$userInfo.identity}
    </p>
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
  <Login />
{/if}
<Link to="about" class="text-center mx-auto w-full"><A>About</A></Link>
