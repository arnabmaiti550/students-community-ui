import { defineStore } from "pinia";
import {
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
} from '@/services/tests'
import base64 from "base-64";
const { utf8ToHex, hexToUtf8 } = useHexEncoding();
export const useTestStore = defineStore("testStore", {
    state: () => ({
        tests: [],
        myTests: [],
        attemptedTests: [],
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
                    error?.response?.data?.error ||
                    `Api failed with error: ${error.message}`
                );
            }
        },
        async deleteTestAction(payload) {
            try {
                const resp = await deleteTest(payload);
                return resp.data;
            } catch (error) {
                throw Error(
                    error?.response?.data?.error ||
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
                    error?.response?.data?.error ||
                    `Api failed with error: ${error.message}`
                );
            }
        },
        async fetchTestsAction(payload, reload = false) {
            try {
                if (reload || this.currentTopic != payload?.topic) { this.tests = []; this.currentTopic = payload?.topic }
                if (payload?.page || 1 * 10 > this.tests.length) {
                    const resp = await getTests(payload);
                    const datas = resp.data.data
                    this.tests = [...this.tests, ...datas]
                    return resp.data;
                }
            } catch (error) {
                throw Error(
                    error?.response?.data?.error ||
                    `Api failed with error: ${error.message}`
                );
            }
        },
        async fetchAttemptedTestsAction(payload, reload = false) {
            try {
                if (reload) { this.attemptedTests = []; }
                if (payload?.page || 1 * 10 > this.attemptedTests.length) {
                    const resp = await getAttemptedTests(payload);
                    const datas = resp.data.data
                    this.attemptedTests = [...this.attemptedTests, ...datas]
                    return resp.data;
                }
            } catch (error) {
                throw Error(
                    error?.response?.data?.error ||
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
                    error?.response?.data?.error ||
                    `Api failed with error: ${error.message}`
                );
            }
        },
        async fetchTestAction(id) {
            try {
                const resp = await getTestById(id);
                let temp = resp.data.data;
                const regex =
                    /^([A-Za-z0-9+/]{4})*([A-Za-z0-9+/]{3}=|[A-Za-z0-9+/]{2}==)?$/;
                temp.description = hexToUtf8(temp.description);

                temp.questions = temp.questions
                    .map(el => {
                        el.question = hexToUtf8(el.question) || el.question;
                        el.solution = hexToUtf8(el.solution) || el.solution;
                        return el;
                    });
                this.test = temp
                return resp.data;
            } catch (error) {
                throw Error(
                    error?.response?.data?.error ||
                    `Api failed with error: ${error.message}`
                );
            }
        },

        async fetchTestLtdAction(id) {
            try {
                const resp = await getTestByIdLtd(id);
                let temp = resp.data.data;
                temp.description = hexToUtf8(temp.description)
                temp.questions = temp.questions
                    .map(el => {
                        el.question = hexToUtf8(el.question) || el.question;

                        return el;
                    });
                this.test = temp
                return resp.data;
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
        async submitTestAction(payload) {
            try {
                const resp = await submitTest(payload);

                return resp.data;
            } catch (error) {
                throw Error(
                    error?.response?.data?.error ||
                    `Api failed with error: ${error.message}`
                );
            }
        },
        async fetchTestResultAction(id) {
            try {
                const resp = await getTestResult(id);
                let temp = resp.data.data;
                temp.description = hexToUtf8(temp.description)
                temp.questions = temp.questions
                    .map(el => {
                        el.question = hexToUtf8(el.question) || el.question;
                        el.solution = hexToUtf8(el.solution) || el.solution;
                        return el;
                    });
                this.test = temp
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

    },
    persist: {
        storage: persistedState.sessionStorage,
    },
})