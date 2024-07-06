const loginApi = async (payload) => {
    const { $axios } = useNuxtApp();
    return await $axios.post(`/api/v1/auth/login`, payload);
};
const registerApi = async (payload) => {
    const { $axios } = useNuxtApp();
    return await $axios.post(`/api/v1/auth/register`, payload);
};
const getMe = async (payload) => {
    const { $axios } = useNuxtApp();
    return await $axios.get(`/api/v1/auth/me`, payload);
};
const logout = async (payload) => {
    const { $axios } = useNuxtApp();
    return await $axios.get(`/api/v1/auth/logout`, payload);
};

export {
    loginApi,
    getMe,
    logout,
    registerApi
}