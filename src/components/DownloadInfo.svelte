<script lang="ts">
    import { Button, Accordion, AccordionItem, Badge } from "flowbite-svelte";
    import { onMount } from "svelte";
    import { loggedIn, logout } from "../stores/auth";
    import axios from "../lib/axios";

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
        try {
            // const res = await fetch(
            //     "http://howlingmoon.awoo/api/downloader/info",
            //     {
            //         method: "GET",
            //         credentials: "include",
            //     }
            // ).then((r) => r.json());
            const { data: res } = await axios.get("downloader/info", {
                withCredentials: true,
            });
            downloadData = res;
            const sortedData = downloadData.data as Array<Task>;
            sortedData.sort((a, b) => {
                const da = new Date(a.created_at).getTime();
                const db = new Date(b.created_at).getTime();
                if (da > db) return -1;
                if (da == db) return 0;
                if (da < db) return 1;
            });
            lastSync = new Date();
            // check if there is pending state
            const tasks = downloadData.data as Array<Task>;
            if (tasks.find((x) => x.state === "1")) {
                setTimeout(() => {
                    fetchDownloadData();
                }, 2000);
            }
        } catch (error) {
            alert("Error happened when fetching user's donwloaded info");
            console.error(error);
        }
    };

    function downloadURI(uri, name) {
        var link = document.createElement("a");
        link.download = name;
        link.href = uri;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }

    const downloadFile = async (id: string, name: string) => {
        try {
            // const res = await fetch(
            //     `http://howlingmoon.awoo/api/downloader/retrieve?id=${id}`,
            //     {
            //         method: "GET",
            //         credentials: "include",
            //     }
            // ).then((r) => r.text());
            const { data: res } = await axios.get(
                `downloader/retrieve?id=${id}`,
                { withCredentials: true }
            );
            downloadURI(res, name);
        } catch (error) {
            alert("Error happened when fetching user's donwloaded info");
            console.error(error);
        }
    };

    onMount(async () => {
        if (loggedIn) {
            fetchDownloadData();
        }
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

    {#if downloadData && downloadData.data.length > 0}
        <Accordion>
            {#each downloadData.data as item}
                <AccordionItem>
                    <span slot="header">
                        <div
                            class={`inline ${
                                item.state === "1"
                                    ? "bg-white animate-pulse"
                                    : ""
                            }`}
                        >
                            <Badge
                                border
                                color={item.state === "1"
                                    ? "yellow"
                                    : item.state === "2"
                                    ? "green"
                                    : "dark"}
                            >
                                {item.state === "1"
                                    ? "Pending"
                                    : item.state === "2"
                                    ? "Done"
                                    : "Not defined"}
                            </Badge>
                        </div>
                        <span>{item.title || item.url}</span>
                    </span>
                    <p>
                        Source: <a
                            href={item.url}
                            class="text-blue-500 hover:cursor-pointer hover:text-blue-300"
                            >{item.url}</a
                        >
                    </p>
                    <Button
                        class="mt-2 mx-auto"
                        type="button"
                        on:click={() => {
                            downloadFile(item.id, item.title);
                        }}>Download</Button
                    >
                </AccordionItem>
            {/each}
        </Accordion>
    {/if}
</div>