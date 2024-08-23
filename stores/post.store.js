import { defineStore } from "pinia";
import {
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
    editReply, deleteReply, getMyPosts, deletePost, getQna
} from '@/services/post'
import base64 from "base-64";
const { utf8ToHex, hexToUtf8 } = useHexEncoding();
export const usePostStore = defineStore("postStore", {
    state: () => ({
        posts: [],
        pageIndex: 1,
        currentTopic: '',
        post: {},
        replies: [],
    }),
    getters: {},
    actions: {

        async createPostAction(payload) {
            try {
                const resp = await createPost(payload);
                return resp.data;
            } catch (error) {
                throw Error(
                    error?.response?.data?.error ||
                    `Api failed with error: ${error.message}`
                );
            }
        },
        async uploadFileAction(payload) {
            try {
                const resp = await uploadFile(payload);
                return resp.data;
            } catch (error) {
                throw Error(
                    error?.message ||
                    `Api failed with error: ${error.message}`
                );
            }
        },
        async fetchPostsAction(payload, reload = false) {
            try {
                if (reload || this.currentTopic != payload.topic) { this.posts = []; this.currentTopic = payload.topic }
                if (payload.page * 10 > this.posts.length) {
                    const resp = await getPosts(payload);
                    const datas = resp.data.data.map(el => { el.body = hexToUtf8(el.body) || el.body; return el; })
                    this.posts = [...this.posts, ...datas]
                    return resp.data;
                }
            } catch (error) {
                throw Error(
                    error?.response?.data?.error ||
                    `Api failed with error: ${error.message}`
                );
            }
        },
        async fetchQnaAction(payload, reload = false) {
            try {
                if (reload) { this.posts = []; }
                if (payload.page * 10 > this.posts.length) {
                    const resp = await getQna(payload);
                    const datas = resp.data.data.map(el => { el.body = hexToUtf8(el.body) || el.body; return el; })
                    this.posts = [...this.posts, ...datas]
                    return resp.data;
                }
            } catch (error) {
                throw Error(
                    error?.response?.data?.error ||
                    `Api failed with error: ${error.message}`
                );
            }
        },
        async fetchMyPostsAction(payload, reload = false) {
            try {
                if (reload) { this.posts = []; }
                if (payload.page * 20 > this.posts.length) {
                    const resp = await getMyPosts(payload);
                    const datas = resp.data.data.map(el => { el.body = hexToUtf8(el.body) || el.body; return el; })
                    this.posts = [...this.posts, ...datas]
                    return resp.data;
                }
            } catch (error) {
                throw Error(
                    error?.response?.data?.error ||
                    `Api failed with error: ${error.message}`
                );
            }
        },
        async fetchSubjectsAction(id) {
            try {
                if (this.subjects[id]?.length > 0) return this.subjects[id]
                const resp = await getSubjects(id);
                this.subjects[id] = resp.data.data;

                return resp.data;
            } catch (error) {
                throw Error(
                    error?.response?.data?.error ||
                    `Api failed with error: ${error.message}`
                );
            }
        },
        async fetchTopicsAction(id) {
            try {
                if (this.topics[id]?.length > 0) return this.topics[id]
                const resp = await getTopics(id);
                this.topics[id] = resp.data.data;

                return resp.data;
            } catch (error) {
                throw Error(
                    error?.response?.data?.error ||
                    `Api failed with error: ${error.message}`
                );
            }
        },
        async getPostByIdAction(payload) {
            try {
                const resp = await getPostById(payload);
                this.post = resp.data.data
                this.post.body = hexToUtf8(this.post.body) || this.post.body
                return resp.data;
            } catch (error) {
                throw Error(
                    error?.response?.data?.error ||
                    `Api failed with error: ${error.message}`
                );
            }
        },
        async getDetailPostByIdAction(payload) {
            try {
                const resp = await getDetailPostById(payload);
                this.post = resp.data.data
                this.post.body = hexToUtf8(this.post.body) || this.post.body
                return resp.data;
            } catch (error) {
                throw Error(
                    error?.response?.data?.error ||
                    `Api failed with error: ${error.message}`
                );
            }
        },
        async editPostAction(payload) {
            try {
                const resp = await editPost(payload);
                return resp.data;
            } catch (error) {
                throw Error(
                    error?.response?.data?.error ||
                    `Api failed with error: ${error.message}`
                );
            }
        },
        async deletePostAction(payload) {
            try {
                const resp = await deletePost(payload);
                return resp.data;
            } catch (error) {
                throw Error(
                    error?.response?.data?.error ||
                    `Api failed with error: ${error.message}`
                );
            }
        },
        async addReplyAction(payload) {
            try {
                const resp = await addReply(payload);
                return resp.data;
            } catch (error) {
                throw Error(
                    error?.response?.data?.error ||
                    `Api failed with error: ${error.message}`
                );
            }
        },
        async getReplyAction(id) {
            try {
                this.replies = [];
                const resp = await getReply(id);
                this.replies = resp.data.data.map(el => { el.body = hexToUtf8(el.body) || el.body; return el; })
                return resp.data;
            } catch (error) {
                throw Error(
                    error?.response?.data?.error ||
                    `Api failed with error: ${error.message}`
                );
            }
        },
        async editReplyAction(payload) {
            try {
                const resp = await editReply(payload);
                return resp.data;
            } catch (error) {
                throw Error(
                    error?.response?.data?.error ||
                    `Api failed with error: ${error.message}`
                );
            }
        },
        async deleteReplyAction(payload) {
            try {
                const resp = await deleteReply(payload);
                return resp.data;
            } catch (error) {
                throw Error(
                    error?.response?.data?.error ||
                    `Api failed with error: ${error.message}`
                );
            }
        },
        async likeUnlikeAction(id) {
            try {
                const resp = await likeUnlike(id);
                return resp.data;
            } catch (error) {
                throw Error(
                    error?.response?.data?.error ||
                    `Api failed with error: ${error.message}`
                );
            }
        },
        async deleteFileAction(payload) {
            try {
                const resp = await deleteFile(payload);
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