"use client";
import axios from "axios";
import { storeToRefs } from "pinia";

export default defineNuxtPlugin((NuxtApp) => {
    const runtimeConfig = useRuntimeConfig();
    // const authStore = useAuthStore()
    // const authStore = useAuthStore();
    // const { token } = storeToRefs(authStore);
    const axiosInstance = axios.create({
        baseURL: runtimeConfig.public.API_BASE_URL,
        withCredentials: true,
        headers: {
            'Access-Control-Allow-Origin': '*',
            "Content-Type": "application/json",
        },
        timeout: 60000,
    });
    // if ((token.value || "").length) {
    //     axiosInstance.interceptors.request.use(async (config) => {
    //         config.headers.Authorization = `Bearer ${token.value}`;
    //         return config;
    //     });
    // }

    return {
        provide: {
            axios: axiosInstance,
        },
    };
});
