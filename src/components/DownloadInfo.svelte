<script lang="ts">
    import { Button, Accordion, AccordionItem, Badge } from "flowbite-svelte";
    import { onDestroy, onMount } from "svelte";
    import { get } from "svelte/store";
    import { getCurrentUser, loggedIn, logout } from "../stores/auth";
    import { pollLock } from "../stores/poll";
    import apiAxios from "../lib/axios";
    import DownloadItem from "./DownloadItem.svelte";

    let downloadData = null;
    let lastSync = null;

    interface Task {
        id: string;
        pk: string;
        state: string;
        title: string;
        url: string;
        created_at: string;
        created_by: string;
    }

    export const fetchDownloadData = async () => {
        if (get(pollLock)) {
            return;
        }
        try {
            const { data: res } = await apiAxios.get("downloader/tasks");
            downloadData = res;
            const sortedData = downloadData as Array<Task>;
            sortedData.sort((a, b) => {
                const da = new Date(a.created_at).getTime();
                const db = new Date(b.created_at).getTime();
                if (da > db) return -1;
                if (da == db) return 0;
                if (da < db) return 1;
            });
            sortedData.reverse();
            lastSync = new Date();
            // check if there is pending state
            const tasks = downloadData as Array<Task>;
            if (tasks.find((x) => x.state === "1" || x.state === "0")) {
                const pendingTimeout = setTimeout(() => {
                    pollLock.set(null);
                    fetchDownloadData();
                    // console.log("Setting lock to false")
                    // pollLock.set(false)
                    // console.log(get(pollLock))
                }, 5000);
                pollLock.set(pendingTimeout);
            } else {
                pollLock.set(null);
            }
        } catch (error) {
            alert("Error happened when fetching user's donwloaded info");
            console.error(error);
            pollLock.set(null);
        }
    };

    onMount(async () => {
        await getCurrentUser();
        if (loggedIn) {
            fetchDownloadData();
        }
    });

    onDestroy(() => {
        console.log("Destroying download info view and states");
        lastSync = null;
        downloadData = null;
    });
</script>

<div class="mx-auto my-4">
    <div class="flex">
        <Button
            class="mt-2 mb-4 mr-2"
            type="button"
            on:click={fetchDownloadData}
        >
            Fetch Data
        </Button>
        <div class="flex flex-col self-center flex-grow">
            <span class="text-2xl">User's Downloads</span>
            <span class="text-md"
                >Last synced: {lastSync
                    ? lastSync.toLocaleString()
                    : "Not data"}</span
            >
        </div>
        <!-- <div class="flex-grow" /> -->
        <Button class="mt-2 mb-4 mr-2" type="button" on:click={logout}>
            Logout
        </Button>
    </div>

    {#if downloadData && downloadData.length > 0}
        <Accordion>
            {#each downloadData as item}
                <DownloadItem {item} />
            {/each}
        </Accordion>
    {/if}
</div>
