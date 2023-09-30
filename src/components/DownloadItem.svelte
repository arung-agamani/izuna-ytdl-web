<script lang="ts">
    import {
        Button,
        Accordion,
        AccordionItem,
        Badge,
        P,
    } from "flowbite-svelte";
    import apiAxios from "../lib/axios";

    export let item: {
        downloaded_bytes: number | undefined;
        total_bytes: number | undefined;
        state: string;
        title: string;
        url: string;
        id: string;
    };

    function downloadURI(uri: string, name: string) {
        var link = document.createElement("a");
        link.download = name;
        link.href = uri;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }

    const downloadFile = async (id: string, name: string) => {
        try {
            const { data: res } = await apiAxios.get(
                `downloader/retrieve?id=${id}`
            );
            downloadURI(res, name);
        } catch (error) {
            alert("Error happened when fetching user's downloaded info");
            console.error(error);
        }
    };

    let percent = 0;
    $: if (item.downloaded_bytes === null) {
        percent = 0;
    } else {
        percent = (item.downloaded_bytes / item.total_bytes) * 100;
    }
    $: pStr = parseFloat(`${percent}`).toFixed(2);
</script>

<AccordionItem
    class="flex items-center justify-between w-full font-medium text-left group-first:rounded-t-xl border-gray-200 dark:border-gray-700 group-last:rounded-b-xl"
>
    <span slot="header">
        <div
            class={`inline ${
                item.state === "1" ? "bg-white animate-pulse" : ""
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
                {item.state === "0"
                    ? "Queued"
                    : item.state === "1"
                    ? "Pending"
                    : item.state === "2"
                    ? "Done"
                    : item.state === "3"
                    ? "Failed"
                    : item.state === "4"
                    ? "Too Long"
                    : item.state === "5"
                    ? "Download Error"
                    : item.state === "6"
                    ? "Not Found"
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
    <p>
        {#if item.state === "1"}
            Item is being processed. Please wait...
            {#if percent !== null}
                {pStr}%
            {/if}
        {/if}
        {#if item.state === "2"}
            Processing done! You can now download the item using the download
            button below
        {/if}
        {#if ["3", "4", "5", "6"].includes(item.state)}
            Error happened when processing request resulting in failed task.
            <br />
            {item.state === "3"
                ? "Unknown Error"
                : item.state === "4"
                ? "The video given is too long. Maximum 10 minutes"
                : item.state === "5"
                ? "Error occured during download. Most probably you've supplied the wrong link or wrong ID"
                : item.state === "6"
                ? "Error occured during download. Video not found with the given link or ID"
                : "Undefined state"}
        {/if}
    </p>
    {#if item.state === "2"}
        <Button
            class="mt-2 mx-auto"
            type="button"
            on:click={() => {
                downloadFile(item.id, item.title);
            }}>Download</Button
        >
    {/if}
</AccordionItem>
