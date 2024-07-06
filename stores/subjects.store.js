import { defineStore } from "pinia";
import {
    getDepartmentTree,
    getDepartments,
    getSubjects,
    getTopics,
    getTopicDetails
} from '@/services/subjects'

export const useSubjectStore = defineStore("subjectStore", {
    state: () => ({

        departmentTree: [],
        departments: [],
        subjects: {},
        topics: {},
        token: '',
        topicDetails: {}
    }),
    getters: {},
    actions: {

        async fetchDepartmentAction() {
            try {
                if (this.departmentTree.length > 0) return this.departmentTree
                const resp = await getDepartmentTree();
                this.departmentTree = resp.data.data;

                return resp.data;
            } catch (error) {
                throw Error(
                    error?.response?.data?.message ||
                    `Api failed with error: ${error.message}`
                );
            }
        },
        async fetchDepartmentsAction() {
            try {
                if (this.departments.length > 0) return this.departments
                const resp = await getDepartments();
                this.departments = resp.data.data;

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
        async fetchTopicsDetailAction(id) {
            try {

                const resp = await getTopicDetails(id);
                this.topicDetails = resp.data.data;

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