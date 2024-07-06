const createPost = async (payload) => {
    const { $axios } = useNuxtApp();
    return await $axios.post(`/api/v1/add-post`, payload);
};
const getPosts = async (payload) => {
    const { $axios } = useNuxtApp();
    return await $axios.post(`/api/v1/posts`, payload);
};
const getPostById = async (id) => {
    const { $axios } = useNuxtApp();
    return await $axios.get(`/api/v1/posts/${id}`,);
};
const getDetailPostById = async (id) => {
    const { $axios } = useNuxtApp();
    return await $axios.get(`/api/v1/post-detail/${id}`,);
};
const editPost = async (payload) => {
    const { $axios } = useNuxtApp();
    return await $axios.put(`/api/v1/posts/${payload.id}`, payload.data);
};
const getReply = async (id) => {
    const { $axios } = useNuxtApp();
    return await $axios.get(`/api/v1/reply/${id}`,);
};
const addReply = async (payload) => {
    const { $axios } = useNuxtApp();
    return await $axios.post(`/api/v1/reply`, payload);
};
const likeUnlike = async (payload) => {
    const { $axios } = useNuxtApp();
    return await $axios.get(`/api/v1/like/${payload.type}/${payload.id}`);
};

export {
    createPost,
    getPosts,
    getPostById,
    getReply,
    addReply,
    getDetailPostById,
    editPost,
    likeUnlike
}