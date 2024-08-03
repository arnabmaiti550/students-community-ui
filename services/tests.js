const createTest = async (payload) => {
    const { $axios } = useNuxtApp();
    return await $axios.post(`/api/v1/add-test`, payload);
};
const getTests = async (payload) => {
    const { $axios } = useNuxtApp();
    return await $axios.post(`/api/v1/tests`, payload);
};
const getMyTests = async () => {
    const { $axios } = useNuxtApp();
    return await $axios.get(`/api/v1/mytests`,);
};
const editTest = async (payload) => {
    const { $axios } = useNuxtApp();
    return await $axios.put(`/api/v1/tests/${payload.id}`, payload.payload);
};
const getTestById = async (id) => {
    const { $axios } = useNuxtApp();
    return await $axios.get(`/api/v1/tests/${id}`,);
};

export {
    createTest,
    getTests,
    getMyTests,
    editTest,
    getTestById
}