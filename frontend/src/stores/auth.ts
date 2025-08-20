import type { User } from "../types/user";
import { defineStore } from "pinia";

export const useAuth = defineStore(`auth`, {
    state: () => ({
        user: null as null | User
    }),
    actions: {
        login(name: string, id: number) {
            this.user = { id, name };
        },
        logout() {
            this.user = null;
        }
    }
})