<template>
  <SignIn />
  <div class="flex flex-col md:flex-row justify-center">
    <div class="p-4 w-full flex flex-col space-y-4 bg-white">
      <div v-for="(q, i) in test.questions" :key="i" class="border-b pb-4">
        <span v-html="q.question" class="ql-editor p-0"></span>
        <div v-if="q.type == 'MCQ'">
          <URadio
            v-for="option in q.options"
            :key="option.value"
            v-model="q.attempt"
            v-bind="option"
          />
        </div>
        <div v-if="q.type == 'MSQ'">
          <UFormGroup name="checkbox" v-for="(option, i) in q.options" :key="i">
            <UCheckbox v-model="option.myAttempt" v-bind="option"> </UCheckbox>
          </UFormGroup>
        </div>
        <div v-if="q.type == 'NAT'" class="md:w-1/2">
          <UInput
            v-model="q.attempt"
            placeholder="Enter answer"
            type="number"
          />
        </div>
        <div
          class="text-xs font-[550] text-gray-500 mt-2 flex justify-between items-center"
        >
          <div>
            Marks: <span class="text-green-500"> {{ q.marks }}</span> |
            <span class="text-red-500">- {{ q.negative }}</span>
          </div>
        </div>
      </div>

      <div class="grid grid-cols-1 mt-4">
        <div class="flex justify-center gap-3">
          <UButton
            class="w-32 justify-center"
            size="lg"
            color="green"
            square
            variant="solid"
            :disabled="loading"
            :loading="loading"
            @click="submitTest"
            label="Submit"
          />
        </div>
      </div>
    </div>
    <div class="md:w-2/5">
      <div class="font-bold text-xl text-center text-gray-500">
        <h3 class="font-bold text-xl">{{ test.title }}</h3>

        <p>Full Marks- {{ test.fullMarks }}</p>
        Time Remaining- {{ timeStamp }}
      </div>
    </div>
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
              Something went wrong
            </h3>
          </div>
        </template>

        <ULandingCard class="mb-4">
          Failed to submit. Please try again.
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
                @click="submitTest"
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
const testStore = useTestStore();
const { test } = storeToRefs(testStore);
const route = useRoute();
const router = useRouter();
const timeStamp = ref("");
const loading = ref(false);
const { $toast } = useNuxtApp();
const confirmationPopup = ref(false);
async function submitTest() {
  const payload = {
    test: route.params.id,
    questions: [...test.value.questions].map((q) => {
      return {
        type: q.type,
        answer: q.attempt,
        answerKey: q.options.filter((el) => el.myAttempt).map((el) => el.value),
      };
    }),
  };
  try {
    loading.value = true;
    await testStore.submitTestAction(payload);
    $toast.success("Test submitted successfully");
    router.push(`/test/dashboard-${route.params.id}`);
  } catch (err) {
    $toast.error(err.message);
    confirmationPopup.value = true;
  }
  loading.value = false;
}
onMounted(async () => {
  await testStore.fetchTestLtdAction(route.params.id);
  if (!test.value.time) return;
  let duration = moment.duration(test.value.time, "seconds");
  if (!duration.asSeconds()) return;
  if (localStorage.getItem(`remainingTime-${route.params.id}`)) {
    duration = moment.duration(
      Number(localStorage.getItem(`remainingTime-${route.params.id}`)),
      "seconds"
    );
  }
  if (duration) {
    const timerInterval = setInterval(() => {
      duration = moment.duration(duration.asSeconds() - 1, "seconds");

      const hours = duration.hours();
      const minutes = duration.minutes();
      const seconds = duration.seconds();

      timeStamp.value = `${hours}:${minutes}:${seconds}`;

      if (duration <= 0) {
        clearInterval(timerInterval);
        localStorage.removeItem(`remainingTime-${route.params.id}`);
        submitTest(); // or any other action you want to perform
      }
    }, 1000);
  }
  window.addEventListener("beforeunload", () => {
    localStorage.setItem(
      `remainingTime-${route.params.id}`,
      duration.asSeconds()
    );
  });
});
</script>