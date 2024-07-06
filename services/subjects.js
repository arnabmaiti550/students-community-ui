const getDepartmentTree = async () => {
    const { $axios } = useNuxtApp();
    return await $axios.get(`/api/v1/departments-tree`,);
};
const getDepartments = async () => {
    const { $axios } = useNuxtApp();
    return await $axios.get(`/api/v1/departments`,);
};
const getSubjects = async (id) => {
    const { $axios } = useNuxtApp();
    return await $axios.get(`/api/v1/subjects/${id}`,);
};
const getTopics = async (id) => {
    const { $axios } = useNuxtApp();
    return await $axios.get(`/api/v1/topics/${id}`,);
};
const getTopicDetails = async (id) => {
    const { $axios } = useNuxtApp();
    return await $axios.get(`/api/v1/topic/${id}`,);
};
export {
    getDepartmentTree,
    getDepartments,
    getSubjects,
    getTopics,
    getTopicDetails
}