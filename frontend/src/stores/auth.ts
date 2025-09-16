import type { User } from "../types/user";
import { defineStore } from "pinia";

export const useAuth = defineStore(`auth`, {
    state: () => ({
        user: null as null | User,
        redirectedToStar: (JSON.parse(window.localStorage.getItem(`redirection-href`)!)?.redirectedToStar) || false,
    }),
    actions: {
        login(name: string, id: number) {
            this.user = { id, name };
        },
        logout() {
            this.user = null;
        },
        markAsRedirected() {
            this.redirectedToStar = true;
            window.localStorage.setItem(`redirection-href`, JSON.stringify({
                redirectedToStar: true,
            }));
        }
    }
})