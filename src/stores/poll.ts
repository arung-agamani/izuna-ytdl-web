import { writable } from "svelte/store";

export const pollLock = writable<any>(null);
