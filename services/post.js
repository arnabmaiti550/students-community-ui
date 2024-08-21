const createPost = async (payload) => {
    const { $axios } = useNuxtApp();
    return await $axios.post(`/api/v1/add-post`, payload);
};
const getPosts = async (payload) => {
    const { $axios } = useNuxtApp();
    return await $axios.post(`/api/v1/posts`, payload);
};
const getQna = async (payload) => {
    const { $axios } = useNuxtApp();
    return await $axios.post(`/api/v1/qna`, payload);
};
const getMyPosts = async (payload) => {
    const { $axios } = useNuxtApp();
    return await $axios.post(`/api/v1/my-posts`, payload);
};
const getPostById = async (id) => {
    const { $axios } = useNuxtApp();
    return await $axios.get(`/api/v1/posts/${id}`,);
};
const deletePost = async (id) => {
    const { $axios } = useNuxtApp();
    return await $axios.delete(`/api/v1/posts/${id}`,);
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

const editReply = async (data) => {
    const { $axios } = useNuxtApp();
    return await $axios.put(`/api/v1/reply/${data.id}`, data.data);
};
const deleteReply = async (id) => {
    const { $axios } = useNuxtApp();
    return await $axios.delete(`/api/v1/reply/${id}`,);
};

const uploadFile = async (payload) => {
    const { $axios } = useNuxtApp();
    return await $axios.post(`/upload`, payload, {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    });
};
const deleteFile = async (path) => {
    const { $axios } = useNuxtApp();
    return await $axios.delete(`${path}`,);
};

export {
    createPost,
    getPosts,
    getPostById,
    getReply,
    addReply,
    getDetailPostById,
    editPost,
    likeUnlike,
    uploadFile,
    deleteFile,
    editReply,
    deleteReply,
    getMyPosts,
    deletePost,
    getQna
}