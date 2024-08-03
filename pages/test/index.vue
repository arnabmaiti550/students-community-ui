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
        </template>

        <template #attempted>
          <div>Password</div>
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
          </div>
        </template>
      </UTabs>
    </div>
    <div class="w-2/5"></div>
  </div>
</template>
<script setup>
definePageMeta({
  layout: "no-sidebar",
});
const router = useRouter();
const subjectStore = useSubjectStore();
const testStore = useTestStore();
const { departments, subjects, topics } = storeToRefs(subjectStore);
const { myTests } = storeToRefs(testStore);
const department = ref("");
const subject = ref("");
const topic = ref("");

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
function clearTopic() {
  subject.value = "";
  topic.value = "";
}
watch(department, (val) => {
  subjectStore.fetchSubjectsAction(val);
});
watch(subject, (val) => {
  subjectStore.fetchTopicsAction(val);
});
onMounted(async () => {
  subjectStore.fetchDepartmentsAction();
  await testStore.fetchMyTestsAction();
});
</script>