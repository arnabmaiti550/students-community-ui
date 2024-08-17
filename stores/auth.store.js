import { defineStore } from "pinia";
import {
    loginApi,
    getMe,
    logout,
    registerApi,
    updateProfile,
    getUserById
} from '@/services/auth'

export const useAuthStore = defineStore("authStore", {
    state: () => ({
        googleInfo: {},
        userInfo: {},
        userById: {},
        token: '',
        loggedIn: false,
    }),
    getters: {},
    actions: {

        async loginAction(payload) {
            try {
                const resp = await loginApi(payload);
                this.googleInfo = payload;
                this.token = resp.data?.token;

                if (this.token) {

                    this.signInConfigure()
                    await this.getUserInfo()
                    this.loggedIn = true
                }
                return resp.data;
            } catch (error) {
                throw Error(
                    error?.response?.data?.error ||
                    `Api failed with error: ${error.message}`
                );
            }
        },
        async registerAction(payload) {
            try {
                const resp = await registerApi(payload);
                this.token = resp.data?.token;

                this.signInConfigure();
                await this.getUserInfo()
                this.loggedIn = true
                return resp.data;
            } catch (error) {
                throw Error(
                    error?.response?.data?.error ||
                    `Api failed with error: ${error.message}`
                );
            }
        },
        async updateProfileAction(payload) {
            try {
                const resp = await updateProfile(payload);

                return resp.data;
            } catch (error) {
                throw Error(
                    error?.response?.data?.error ||
                    `Api failed with error: ${error.message}`
                );
            }
        },
        async logoutAction() {
            try {
                const resp = await logout();
                this.token = '';

                this.loggedIn = false
                return resp.data;
            } catch (error) {
                throw Error(
                    error?.response?.data?.error ||
                    `Api failed with error: ${error.message}`
                );
            }
        },


        signInConfigure() {
            const { $axios } = useNuxtApp();
            const runtimeConfig = useRuntimeConfig();

            if ((this.token || "").length) {
                $axios.interceptors.request.use(async (config) => {
                    config.headers.Authorization = `Bearer ${this.token}`;
                    return config;
                });
            }
        },
        async getUserInfo() {
            try {
                const resp = await getMe();
                this.loggedIn = true;
                this.userInfo = resp.data.data;
                return resp.data;
            } catch (error) {
                throw Error(
                    error?.response?.data?.error ||
                    `Api failed with error: ${error.message}`
                );
            }
        },
        async getUserInfoById(id) {
            try {
                const resp = await getUserById(id);

                this.userById = resp.data.data;
                return resp.data;
            } catch (error) {
                throw Error(
                    error?.response?.data?.error ||
                    `Api failed with error: ${error.message}`
                );
            }
        },
    },
    persist: {
        storage: persistedState.sessionStorage,
    },
})