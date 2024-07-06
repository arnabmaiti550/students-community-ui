import axios from "axios";

export default defineNuxtPlugin((NuxtApp) => {
    const runtimeConfig = useRuntimeConfig();
    const axiosInstance = axios.create({
        baseURL: runtimeConfig.public.API_BASE_URL,
        headers: {
            "x-encrypted-key": runtimeConfig.public.APP_TENANT,
            "Content-Type": "application/json",
        },
    });
    return {
        provide: {
            axios: axiosInstance,
        },
    };
});
