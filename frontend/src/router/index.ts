import { createRouter, createWebHistory } from "vue-router";
import NotFound from "../views/NotFound.vue";
import Login from "../views/Login.vue";
import Panel from "../views/Panel.vue";
import { useAuth } from "../stores/auth";

const routes = [
    { path: "/", component: Panel },
    { path: "/login", component: Login },
    { path: "/:pathMatch(.*)*", component: NotFound }
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

router.beforeEach(to => {
    const auth = useAuth();
    if (to.meta.requiresAuth && !auth.user) {
        return "/login";
    }
})


export default router;