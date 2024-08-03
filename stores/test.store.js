import { defineStore } from "pinia";
import {
    createTest,
    getTests,
    getMyTests,
    editTest,
    getTestById
} from '@/services/tests'
import base64 from "base-64";

export const useTestStore = defineStore("testStore", {
    state: () => ({
        tests: [],
        myTests: [],
        pageIndex: 1,
        currentTopic: '',
        test: {},
        replies: [],
    }),
    getters: {},
    actions: {

        async createTestAction(payload) {
            try {
                const resp = await createTest(payload);
                return resp.data;
            } catch (error) {
                throw Error(
                    error?.response?.data?.message ||
                    `Api failed with error: ${error.message}`
                );
            }
        },
        async updateTestAction(payload) {
            try {
                const resp = await editTest(payload);
                return resp.data;
            } catch (error) {
                throw Error(
                    error?.response?.data?.message ||
                    `Api failed with error: ${error.message}`
                );
            }
        },
        async fetchTestsAction(payload, reload = false) {
            try {
                if (reload || this.currentTopic != payload.topic) { this.posts = []; this.currentTopic = payload.topic }
                if (payload.page * 10 > this.posts.length) {
                    const resp = await getTests(payload);
                    const datas = resp.data.data.map(el => { el.body = base64.decode(el.body) || el.body; return el; })
                    this.tests = [...this.posts, ...datas]
                    return resp.data;
                }
            } catch (error) {
                throw Error(
                    error?.response?.data?.message ||
                    `Api failed with error: ${error.message}`
                );
            }
        },
        async fetchMyTestsAction() {
            try {
                const resp = await getMyTests();
                this.myTests = resp.data.data;
                return resp.data;
            } catch (error) {
                throw Error(
                    error?.response?.data?.message ||
                    `Api failed with error: ${error.message}`
                );
            }
        },
        async fetchTestAction(id) {
            try {
                const resp = await getTestById(id);
                let temp = resp.data.data;
                temp.description = base64.decode(temp.description)
                temp.questions = temp.questions
                    .map(el => {
                        el.question = base64.decode(el.question) || el.question;
                        el.solution = base64.decode(el.solution) || el.solution;
                        return el;
                    });
                this.test = temp
                return resp.data;
            } catch (error) {
                throw Error(
                    error?.response?.data?.message ||
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
                    error?.response?.data?.message ||
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
                    error?.response?.data?.message ||
                    `Api failed with error: ${error.message}`
                );
            }
        },
        async getPostByIdAction(payload) {
            try {
                const resp = await getPostById(payload);
                this.post = resp.data.data
                this.post.body = base64.decode(this.post.body) || this.post.body
                return resp.data;
            } catch (error) {
                throw Error(
                    error?.response?.data?.message ||
                    `Api failed with error: ${error.message}`
                );
            }
        },
        async getDetailPostByIdAction(payload) {
            try {
                const resp = await getDetailPostById(payload);
                this.post = resp.data.data
                this.post.body = base64.decode(this.post.body) || this.post.body
                return resp.data;
            } catch (error) {
                throw Error(
                    error?.response?.data?.message ||
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
                    error?.response?.data?.message ||
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
                    error?.response?.data?.message ||
                    `Api failed with error: ${error.message}`
                );
            }
        },
        async getReplyAction(id) {
            try {
                this.replies = [];
                const resp = await getReply(id);
                this.replies = resp.data.data.map(el => { el.body = base64.decode(el.body) || el.body; return el; })
                return resp.data;
            } catch (error) {
                throw Error(
                    error?.response?.data?.message ||
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
                    error?.response?.data?.message ||
                    `Api failed with error: ${error.message}`
                );
            }
        },

    },
    persist: {
        storage: persistedState.sessionStorage,
    },
})