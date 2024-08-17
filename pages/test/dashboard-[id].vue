<template>
  <SignIn />
  <div>
    <div class="flex flex-col md:flex-row md:space-x-4 space-y-4 md:space-y-0">
      <div class="bg-white p-4 overflow-x pb-6 md:w-2/5">
        <div class="p-4 flex flex-col space-y-4">
          <div class="text-center">
            <UAvatar
              size="xl"
              icon="i-heroicons-user-circle"
              :src="userInfo.profile"
            /><br />
            {{ userInfo.name }}<br />
            Marks <span class="text-cyan-600">{{ test.marksObtained }}</span
            ><br />
            Rank {{ test.userRank }}
          </div>
          <UTable :columns="columns" :rows="test.ranks">
            <template #profile-data="{ row }">
              <img :src="row.user.profile" class="rounded-full w-12" alt="" />
            </template>
          </UTable>
        </div>
      </div>
      <div class="bg-white p-4 overflow-x pb-6 md:w-3/5">
        <div class="p-4 flex flex-col space-y-4 bg-white">
          <div v-for="(q, i) in test.questions" :key="i" class="border-b pb-4">
            <span v-html="q.question" class="ql-editor p-0"></span>
            <div v-if="q.type == 'MCQ' && q.result">
              <URadio
                v-for="option in q.options"
                :key="option.value"
                v-model="q.result.answer"
                disabled
                v-bind="option"
              />
            </div>
            <div v-if="q.type == 'MSQ' && q.result">
              <UFormGroup
                name="checkbox"
                v-for="(option, i) in q.options"
                :key="i"
              >
                <UCheckbox
                  v-model="q.result.answerKey"
                  v-bind="option"
                  disabled
                >
                </UCheckbox>
              </UFormGroup>
            </div>
            <div v-if="q.type == 'NAT' && q.result" class="w-1/2">
              <UInput
                v-model="q.result.answer"
                disabled
                placeholder="Enter answer"
                type="number"
              />
            </div>
            <div class="text-gray-700 text-xs text-bold mt-2">
              Answer:
              <span v-if="q.type == 'MCQ'" class="text-green-600">{{
                q.options[q.answer]?.label
              }}</span>
              <span v-if="q.type == 'MSQ'" class="text-green-600"
                ><span v-for="(ans, i) in q.optionKeys" :key="i"
                  >{{ q.options[ans]?.label }},
                </span></span
              >
              <span v-if="q.type == 'NAT'" class="text-green-600"
                >{{ q.answer }} $\pm$ {{ q.tolerance }}</span
              >
            </div>
            <div
              class="font-bold text-sm mt-2 text-cyan-700 flex justify-between"
            >
              <span>REMARK: {{ getRemark(q.result?.isCorrect) }}</span>
              <span> SCORE: {{ getScore(q) }} </span>
            </div>
            <div
              v-if="q.solution"
              class="bg-gray-50 text-xs ql-editor border border-blue-300 p-2 mt-2"
            >
              <span class="font-bold">Solution:</span>
              <div class="" v-html="q.solution"></div>
            </div>
            <div
              class="text-xs font-[550] text-gray-500 mt-2 flex justify-between items-center"
            >
              <div>
                Marks: <span class="text-green-500"> {{ q.marks }}</span> |
                <span class="text-red-500">- {{ q.negative }}</span>
              </div>
              <div class="space-x-2" v-if="test.status != 'PUBLISH'">
                <UButton
                  icon="i-heroicons-arrow-up-on-square"
                  size="sm"
                  color="white"
                  class="text-gray-600"
                  variant="solid"
                  @click="moveUp(i)"
                />
                <UButton
                  icon="i-heroicons-arrow-down-on-square"
                  size="sm"
                  color="white"
                  class="text-gray-600"
                  variant="solid"
                  @click="moveDown(i)"
                />
                <UButton
                  icon="i-heroicons-pencil-square"
                  size="sm"
                  color="white"
                  class="text-gray-600"
                  variant="solid"
                  @click="setQuestion(i)"
                />
                <UButton
                  icon="i-heroicons-trash"
                  size="sm"
                  color="white"
                  class="text-red-600"
                  variant="solid"
                  @click="deleteQuestion(i)"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
definePageMeta({
  layout: "no-sidebar",
});
const authStore = useAuthStore();
const { token, loggedIn, userInfo } = storeToRefs(authStore);
const columns = [
  {
    key: "rank",
    label: "Rank",
  },
  {
    key: "profile",
    label: "Profile",
  },
  {
    key: "user.name",
    label: "Name",
  },
  {
    key: "marksObtained",
    label: "Marks",
  },
];
const testStore = useTestStore();
const { test } = storeToRefs(testStore);
const route = useRoute();
const router = useRouter();
function getRemark(isCorrect) {
  if (isCorrect != undefined) {
    if (isCorrect) return "CORRECT";
    else return "INCORRECT";
  } else return "NOT ATTEMPTED";
}
function getScore(q) {
  if (!q.result) return 0;
  const isCorrect = q.result?.isCorrect;
  if (isCorrect != undefined) {
    if (isCorrect) return q.marks;
    else return -q.negative;
  } else return 0;
}
onMounted(() => {
  testStore.fetchTestResultAction(route.params.id);
});
</script>