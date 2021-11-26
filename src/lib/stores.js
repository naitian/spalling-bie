import { writable } from "svelte/store";

const toastTimeout = 600;

export const toast = writable(null);
export const addToast = (message, style = "refuse") => {
  toast.set(null);
  toast.set({ message, style });
  setTimeout(() => toast.set(null), toastTimeout);
};


export const found = writable([]);
