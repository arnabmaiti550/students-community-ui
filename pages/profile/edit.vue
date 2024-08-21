<template>
  <div class="min-h-[80vh] flex items-center justify-center">
    <div
      class="bg-white rounded-md shadow-lg flex flex-col items-center w-full max-w-xl h-full overflow-hidden p-6 space-y-4"
    >
      <div class="text-xl mt-4">
        {{ userInfo.name ? "Edit" : "Complete" }} Your Profile
      </div>
      <div class="rounded-full">
        <UAvatar
          size="2xl"
          icon="i-heroicons-user-circle"
          :src="userInfo.profile"
        />
      </div>
      <div class="flex w-full space-x-4">
        <span class="w-32">Name</span>
        <UInput placeholder="name" class="w-full" v-model="name"> </UInput>
      </div>
      <div class="flex w-full space-x-4">
        <span class="w-32">User Name</span>
        <UInput placeholder="name" class="w-full" v-model="userName"> </UInput>
      </div>
      <div class="flex w-full space-x-4">
        <span class="w-32">About</span>
        <UTextarea v-model="about" class="w-full"></UTextarea>
      </div>
      <span class="w-full">Select Default Topic:</span>
      <div
        class="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-2 w-full"
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
      <UButton
        color="green"
        icon="i-heroicons-check"
        variant="solid"
        @click="saveProfile"
        :loading="loading"
        size="md"
        block
        class="mx-auto w-[200px] mt-4"
        >SAVE</UButton
      >
    </div>
  </div>
</template>
<script setup>
definePageMeta({
  layout: "no-sidebar",
});
const { $toast } = useNuxtApp();
const loading = ref(false);
const name = ref("");
const userName = ref("");
const profile = ref("");
const about = ref("");
const subjectStore = useSubjectStore();
const { departments, subjects, topics, topicDetails } =
  storeToRefs(subjectStore);
const department = ref("");
const subject = ref("");
const topic = ref("");
const authStore = useAuthStore();
const payload = ref({});
const router = useRouter();
const { googleInfo, userInfo } = storeToRefs(authStore);

async function saveProfile() {
  console.log(name);
  payload.value.name = name.value;
  payload.value.userName = userName.value;
  payload.value.about = about.value;
  payload.value.topic = topic.value;
  try {
    loading.value = true;
    if (googleInfo.value.userName) {
      await authStore.registerAction(payload.value);
      router.push(`/redirect`);
    } else {
      await authStore.updateProfileAction(payload.value);
      authStore.getUserInfo();
      router.push(`/profile`);
    }
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
  if (googleInfo.value.userName) {
    name.value = googleInfo.value.name;
    userName.value = googleInfo.value.userName;
    profile.value = googleInfo.value.profile;
    payload.value = { ...googleInfo.value };
  }
  if (userInfo.value.name) {
    name.value = userInfo.value.name;
    userName.value = userInfo.value.userName;
    about.value = userInfo.value.about;
    console.log(userInfo.value);
    await subjectStore.fetchTopicsDetailAction(userInfo.value.topic);
    department.value = topicDetails.value.subject?.department?._id;
    subject.value = topicDetails.value.subject?._id;
    topic.value = topicDetails.value._id;
  }
  subjectStore.fetchDepartmentsAction();
});
</script>