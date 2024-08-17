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
const updateProfile = async (payload) => {
    const { $axios } = useNuxtApp();
    return await $axios.put(`/api/v1/auth/updatedetails`, payload);
};
const logout = async (payload) => {
    const { $axios } = useNuxtApp();
    return await $axios.get(`/api/v1/auth/logout`, payload);
};
const getUserById = async (id) => {
    const { $axios } = useNuxtApp();
    return await $axios.get(`/api/v1/auth/user/${id}`,);
};
export {
    loginApi,
    getMe,
    logout,
    registerApi,
    updateProfile,
    getUserById
}