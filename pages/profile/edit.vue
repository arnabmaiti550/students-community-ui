<template>
  <div class="min-h-screen flex items-center justify-center">
    <div
      class="bg-white rounded-md shadow-lg flex flex-col items-center w-full max-w-xl h-full overflow-hidden p-6 space-y-4"
    >
      <div class="text-xl mt-4">Complete Your Profile</div>
      <div class="rounded-full w-32 overflow-hidden border-blue-200 border-4">
        <img :src="profile" alt="Profile" class="w-full" />
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
const name = ref("");
const userName = ref("");
const profile = ref("");
const about = ref("");
const subjectStore = useSubjectStore();
const { departments, subjects, topics } = storeToRefs(subjectStore);
const department = ref("");
const subject = ref("");
const topic = ref("");
const authStore = useAuthStore();
const payload = reactive({});
const router = useRouter();
const { googleInfo } = storeToRefs(authStore);

async function saveProfile() {
  payload.value.name = name.value;
  payload.value.userName = userName.value;
  payload.value.about = about.value;
  payload.value.topic = topic.value;
  try {
    await authStore.registerAction(payload.value);
    router.push(`/redirect`);
  } catch (err) {
    console.log(err);
  }
}

watch(department, (val) => {
  subjectStore.fetchSubjectsAction(val);
});
watch(subject, (val) => {
  subjectStore.fetchTopicsAction(val);
});

onMounted(() => {
  if (googleInfo.value.userName) {
    name.value = googleInfo.value.name;
    userName.value = googleInfo.value.userName;
    profile.value = googleInfo.value.profile;
    payload.value = { ...googleInfo.value };
  }
  subjectStore.fetchDepartmentsAction();
});
</script>