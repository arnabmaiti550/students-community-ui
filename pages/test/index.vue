<template>
  <div class="flex flex-col md:flex-row">
    <div class="w-full md:w-3/5">
      <UTabs
        :items="items"
        size="md"
        class="w-full"
        :ui="{
          list: {
            marker: {
              background: 'bg-white dark:bg-gray-900',
              rounded: 'rounded-sm',
            },
          },
        }"
      >
        <template #tests>
          <div class="bg-white p-4">
            <div
              class="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-2"
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
              <UButton @click="clearTopic" variant="solid" class="text-center"
                >Clear</UButton
              >
            </div>
            <div class="bg-white rounded-sm mt-4 flex space-x-2">
              <UInput
                icon="i-heroicons-magnifying-glass-20-solid"
                size="md"
                color="white"
                class="w-4/6 sm:w-4/5 rounded-full"
                :trailing="false"
                v-model="search"
                @input="debouncedSearch"
                placeholder="Search..."
              />
              <USelect
                v-model="filter"
                size="md"
                class="w-2/6 sm:w-1/5"
                :options="filterOptions"
              />
            </div>
          </div>
          <div
            class="bg-white p-4 rounded-sm cursor-pointer hover:shadow-xl mt-2 hover:outline-2 outline-blue-300 hover:outline"
            v-for="(post, i) in tests"
            :key="i"
            @click="router.push(`/test/about-${post.id}`)"
            :id="`post-${i + 1}`"
          >
            <div class="title">{{ post.name }}</div>
            <div class="mx-4 flex gap-4 text-xs">
              <span>Full Marks- {{ post.marks }}</span>
              <span v-if="post.time">Time- {{ post.time / 60 }} minute</span>
            </div>
            <div class="footer-x flex justify-between items-center">
              <div class="flex space-x-2 text-xs">
                <span class="text-[#396791] cursor-pointer flex items-center">
                  <UIcon name="i-heroicons-user" />
                  &nbsp;{{ post.author.name }}</span
                >
              </div>

              <div class="flex space-x-3">
                <span class="text-cyan-400 flex items-center text-xs"> </span>
              </div>
            </div>
          </div>
        </template>

        <template #attempted>
          <div>
            <div
              class="bg-white p-3 rounded-sm cursor-pointer hover:shadow-xl mt-2 hover:outline-2 outline-blue-300 hover:outline"
              v-for="(post, i) in attemptedTests"
              :key="i"
              @click="router.push(`/test/dashboard-${post.test?._id}`)"
              :id="`testA-${i + 1}`"
            >
              <div class="title">{{ post.test?.title }}</div>
              <div class="mx-4 flex gap-4 text-xs">
                <span
                  >Marks {{ post.marksObtained.toFixed(2) }}/{{
                    post.test?.fullMarks
                  }}</span
                >
              </div>
            </div>
          </div>
        </template>
        <template #created>
          <div
            @click="router.push(`/test/create`)"
            class="bg-white p-8 text-xl text-teal-600"
          >
            Create A New Test
          </div>
          <div
            v-for="(test, i) in myTests"
            :key="i"
            class="p-4 bg-white my-4"
            @click="router.push(`/test/edit/${test.id}`)"
          >
            {{ test.name }}
            <div class="float-right" v-if="test.status != 'DELETE'">
              <UButton
                icon="i-heroicons-trash"
                size="sm"
                color="white"
                class="text-red-500"
                variant="solid"
                @click.stop="
                  delId = test.id;
                  confirmationPopup = true;
                "
              />
            </div>
            <div
              v-if="test.status == 'DRAFT'"
              class="text-gray-600 font-bold mt-2"
            >
              {{ test.status }}
            </div>
            <div
              v-if="test.status == 'PUBLISH'"
              class="text-green-500 font-bold mt-2"
            >
              {{ test.status }}
            </div>
            <div
              v-if="test.status == 'DELETE'"
              class="text-red-500 font-bold mt-2"
            >
              {{ test.status }}
            </div>
          </div>
        </template>
      </UTabs>
    </div>
    <div class="w-2/5"></div>
    <UModal v-model="confirmationPopup" prevent-close :ui="{ width: 'sm' }">
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
              WARNING
            </h3>
            <UButton
              color="red"
              variant="ghost"
              icon="i-heroicons-x-mark-20-solid"
              class="-my-1"
              @click="confirmationPopup = false"
            />
          </div>
        </template>

        <ULandingCard class="mb-4">
          Are you sure you want to delete?
        </ULandingCard>
        <ULandingCard>
          <div class="grid grid-cols-1 mt-4">
            <div class="flex justify-center gap-3">
              <UButton
                class="w-32 justify-center"
                size="lg"
                color="red"
                square
                variant="solid"
                :loading="loading"
                @click="deleteTest"
                label="Delete"
              />
            </div>
          </div>
        </ULandingCard>
      </UCard>
    </UModal>
  </div>
</template>
<script setup>
definePageMeta({
  layout: "no-sidebar",
});

import moment from "moment";
import { debounce } from "lodash";
const ruote = useRoute();

const text = ref("");
const load = ref(1);
const filter = ref("newest");
const filterOptions = [
  { label: "Newest", value: "newest" },
  { label: "Most Popular", value: "most_popular" },
];
const pageIndex = ref(1);
const pageIndexAttempt = ref(1);
const runtimeConfig = useRuntimeConfig();
const postStore = usePostStore();
const search = ref("");
const debouncedSearch = ref();
let observer;
let observer2;
const authStore = useAuthStore();
const { userInfo } = storeToRefs(authStore);
const router = useRouter();
const subjectStore = useSubjectStore();
const testStore = useTestStore();
const { departments, subjects, topics } = storeToRefs(subjectStore);
const { myTests, tests, attemptedTests } = storeToRefs(testStore);
const department = ref("");
const subject = ref("");
const topic = ref("");
const confirmationPopup = ref(false);
const delId = ref("");
const items = [
  {
    slot: "tests",
    label: "Available Tests",
  },
  {
    slot: "attempted",
    label: "Attempted Tests",
  },
  {
    slot: "created",
    label: "Created Tests",
  },
];

const observerOptions = {
  root: null, // default is the viewport
  rootMargin: "0px",
  threshold: 0.1, // 10% of the element must be visible
};
watch(filter, searchFilter);
function searchFilter() {
  pageIndex.value = 1;
  getTestsList(true);
}

async function getTestsList(reload) {
  const payload = {
    department: department.value,
    search: search.value,
    sort: filter.value,
    limit: 10,
    page: pageIndex.value,
    userId: userInfo.value._id,
  };
  if (subject.value) payload.subject = subject.value;
  if (topic.value) payload.topic = topic.value;
  try {
    await testStore.fetchTestsAction(payload, reload);
    reRender();

    const item = document.getElementById(`post-${pageIndex.value * 10 - 1}`);
    if (item) {
      observer.observe(item);
    }
    const pastItem = document.getElementById(
      `post-${(pageIndex.value - 1) * 10 - 1}`
    );
    if (pastItem) observer.unobserve(pastItem);
  } catch (err) {}
}

async function getAttemptedTestsList(reload) {
  const payload = {
    limit: 10,
    page: pageIndexAttempt.value,
    userId: userInfo.value._id,
  };
  if (subject.value) payload.subject = subject.value;
  if (topic.value) payload.topic = topic.value;
  try {
    await testStore.fetchAttemptedTestsAction(payload, reload);
    reRender();

    const item = document.getElementById(
      `testA-${pageIndexAttempt.value * 10 - 1}`
    );

    if (item) {
      observer2.observe(item);
    }
    const pastItem = document.getElementById(
      `testA-${(pageIndexAttempt.value - 1) * 10 - 1}`
    );
    if (pastItem) observer2.unobserve(pastItem);
  } catch (err) {}
}
function clearTopic() {
  subject.value = "";
  topic.value = "";
}
async function deleteTest() {
  try {
    await testStore.deleteTestAction(delId.value);
    confirmationPopup.value = false;
    testStore.fetchMyTestsAction();
  } catch (err) {
    console.log(err);
  }
}
watch(department, (val) => {
  subjectStore.fetchSubjectsAction(val);
  getTestsList(true);
});
watch(subject, (val) => {
  subjectStore.fetchTopicsAction(val);
  getTestsList(true);
});
watch(topic, (val) => {
  getTestsList(true);
});
onMounted(async () => {
  subjectStore.fetchDepartmentsAction();
  if (userInfo.value._id) await testStore.fetchMyTestsAction();
  observer = new IntersectionObserver((entry) => {
    if (entry[0].isIntersecting) {
      pageIndex.value += 1;
      getTestsList();
    }
  }, observerOptions);
  observer2 = new IntersectionObserver((entry) => {
    if (entry[0].isIntersecting) {
      pageIndexAttempt.value += 1;
      getAttemptedTestsList();
    }
  }, observerOptions);

  getTestsList(true);
  getAttemptedTestsList(true);
  debouncedSearch.value = debounce(searchFilter, 600);
});
</script>