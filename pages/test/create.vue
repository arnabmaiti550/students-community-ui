<template>
  <SignIn />
  <div class="flex flex-col md:flex-row">
    <UModal
      v-model="isOpen"
      prevent-close
      :ui="{ width: 'md:max-w-screen-md' }"
    >
      <UCard
        :ui="{
          ring: '',
          divide: 'divide-y divide-gray-100 dark:divide-gray-800',
        }"
      >
        <template #header>
          <div class="flex items-center justify-between">
            <h3
              class="text-base font-semibold leading-6 text-gray-900 dark:text-white"
            >
              Test Information
            </h3>
          </div>
        </template>

        <ULandingCard class="mb-4">
          <div
            class="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-2 mb-4"
          >
            <USelectMenu
              v-model="department"
              :options="departments"
              placeholder="Select Department *"
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
            <UButton @click="clearTopic" variant="solid" class="text-center"
              >Clear</UButton
            >
          </div>
          <UFormGroup class="mb-4">
            <UInput v-model="title" placeholder="Title *" />
          </UFormGroup>
          <UFormGroup class="mb-4">
            <UInput v-model="hours" placeholder="Hours" />
          </UFormGroup>
          <UFormGroup class="mb-4">
            <UInput v-model="minutes" placeholder="Minutes" />
          </UFormGroup>
        </ULandingCard>
        <label>Description </label>
        <editor editorId="testDescription" ref="testDescription" />

        <ULandingCard>
          <div class="grid grid-cols-1 mt-4">
            <div class="flex justify-center gap-3">
              <UButton
                class="w-32 justify-center"
                size="lg"
                color="gray"
                square
                variant="solid"
                :loading="loading"
                @click="submitTest"
                label="Save"
              />
            </div>
          </div>
        </ULandingCard>
      </UCard>
    </UModal>
  </div>
</template>
<script setup>
import base64 from "base-64";
import moment from "moment";
definePageMeta({
  layout: "no-sidebar",
});
const testStore = useTestStore();
const { utf8ToHex, hexToUtf8 } = useHexEncoding();
const subjectStore = useSubjectStore();
const { departments, subjects, topics } = storeToRefs(subjectStore);
const department = ref("");
const subject = ref("");
const topic = ref("");
const testDescription = ref();
const router = useRouter();
const { $toast } = useNuxtApp();
const type = ref("");
const questionTypes = ["MCQ", "MSQ", "NAT"];
const options = ref([
  { value: 0, label: "" },
  { value: 1, label: "" },
]);
const marks = ref();
const negative = ref(0.0);
const isOpen = ref(true);
const selected = ref(0);
const title = ref("");

const hours = ref();
const minutes = ref();
const loading = ref(false);
function addOption() {
  options.value = [
    ...options.value,
    { value: options.value.length, label: "" },
  ];
}
function removeOption() {
  const i = options.value.length - 1;
  if (i <= 1) return;
  options.value.splice(i, 1);
}
async function submitTest() {
  testDescription.value.getEditorContent();

  const payload = {
    department: department.value,
    title: title.value,

    time: moment
      .duration({ hours: hours.value, minutes: minutes.value })
      .asSeconds(),
  };

  payload.description = utf8ToHex(testDescription.value?.editorHtml);
  payload.descriptionData = testDescription.value?.editorContent;

  if (subject.value.length) payload.subject = subject.value;
  if (topic.value.length) payload.topic = topic.value;
  try {
    loading.value = true;
    const resp = await testStore.createTestAction(payload);
    router.push(`/test/edit/${resp.data._id}`);
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