const createTest = async (payload) => {
    const { $axios } = useNuxtApp();
    return await $axios.post(`/api/v1/add-test`, payload);
};
const getTests = async (payload) => {
    const { $axios } = useNuxtApp();
    return await $axios.post(`/api/v1/tests`, payload);
};
const getAttemptedTests = async (payload) => {
    const { $axios } = useNuxtApp();
    return await $axios.post(`/api/v1/tests/attempted`, payload);
}
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
const deleteTest = async (id) => {
    const { $axios } = useNuxtApp();
    return await $axios.delete(`/api/v1/tests/${id}`,);
};
const getTestByIdLtd = async (id) => {
    const { $axios } = useNuxtApp();
    return await $axios.get(`/api/v1/tests-ltd/${id}`,);
};
const submitTest = async (payload) => {
    const { $axios } = useNuxtApp();
    return await $axios.post(`/api/v1/test/submit`, payload);
};
const getTestResult = async (id) => {
    const { $axios } = useNuxtApp();
    return await $axios.get(`/api/v1/test/result/${id}`,);
};
export {
    createTest,
    getTests,
    getMyTests,
    editTest,
    getTestById,
    getTestByIdLtd,
    submitTest,
    getTestResult,
    getAttemptedTests,
    deleteTest
}