<template>
  <SignIn />
  <div class="">
    <div class="bg-white p-4 overflow-x pb-6">
      <h3
        class="mb-2 pb-2 text-xl text-gray-500 border-b md:w-1/2 border-gray-200"
      >
        Ask something or share knowledge
      </h3>
      <label>Title</label>
      <input
        class="w-11/12 mb-2 md:w-5/12 relative block disabled:cursor-not-allowed disabled:opacity-75 focus:outline-none border-0 form-input rounded-md placeholder-gray-400 dark:placeholder-gray-500 text-sm px-2.5 py-1.5 shadow-sm bg-white dark:bg-gray-900 text-gray-900 dark:text-white ring-1 ring-inset ring-gray-300 dark:ring-gray-700 focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-400 focus:ring-gray-400"
        v-model="title"
        placeholder="Add a title"
      />
      <editor ref="editorRef" :isPost="true" :title="title"></editor>
      <div class="h-3"></div>
      <label>Select Releted Topic</label>
      <div
        class="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-2 md:w-1/2"
      >
        <USelectMenu
          v-model="department"
          :options="departments"
          placeholder="Select Department"
          value-attribute="_id"
          class="w-full"
          option-attribute="name"
        />
        <USelectMenu
          v-model="subject"
          :options="subjects[department]"
          placeholder="Select Subject"
          value-attribute="_id"
          class="w-full"
          option-attribute="name"
        />
        <USelectMenu
          v-model="topic"
          class="w-full"
          :options="topics[subject]"
          placeholder="Select Topic"
          value-attribute="_id"
          option-attribute="name"
        />
      </div>

      <!-- <div class="flex mt-4 items-center flex-row space-y-2 md:w-1/2">
        <label>Post Type &nbsp;</label>
        <USelectMenu
          v-model="type"
          :options="types"
          placeholder="Select Type"
          class="w-40 md:w-60"
        />
      </div> -->
      <h3 class="my-2 mt-6 font-bold text-cyan-700 text-sm">
        Make sure to follow Guidelines.
      </h3>

      <UButton
        color="green"
        icon="i-heroicons-bolt"
        variant="solid"
        @click="submitPost"
        block
        :loading="loading"
        class="mx-auto w-[200px] mt-4"
        >Post Now</UButton
      >
    </div>
  </div>
</template>

<script setup>
import base64 from "base-64";
definePageMeta({
  layout: "no-sidebar",
});
const { $toast } = useNuxtApp();
const loading = ref(false);
const department = ref("");
const subject = ref("");
const topic = ref("");
const editorRef = ref();
const subjectStore = useSubjectStore();
const postStore = usePostStore();
const { departments, subjects, topics } = storeToRefs(subjectStore);
const title = ref("");
const router = useRouter();
const type = ref();
const types = ["QNA", "Discussion"];

async function submitPost() {
  try {
    editorRef.value.getEditorContent();
    const encodedContent = base64.encode(editorRef.value.editorHtml);
    const payload = {
      department: department.value,
      subject: subject.value,
      topic: topic.value,
      title: title.value,
      type: type.value,
      body: encodedContent,
      editorData: editorRef.value.editorContent,
    };
    loading.value = true;
    const resp = await postStore.createPostAction(payload);
    router.push(`/post/${resp.data._id}/${resp.data.slug}`);
  } catch (err) {
    $toast.error(err.message);
  }
  loading.value = false;
}
watch(department, (val) => {
  subjectStore.fetchSubjectsAction(val);
});
watch(subject, (val) => {
  subjectStore.fetchTopicsAction(val);
});
onMounted(async () => {
  subjectStore.fetchDepartmentsAction();
});
</script>
