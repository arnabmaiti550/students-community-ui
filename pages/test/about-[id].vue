<template>
  <SignIn />
  <div class="flex">
    <div class="bg-white md:w-3/5 p-4">
      <div class="font-bold border-b">
        {{ test.title }}<br />
        Marks- {{ test.fullMarks }}<br />
        Time- {{ test.time / 60 }} minute
      </div>
      <div v-html="test.description" class="text-[14px] ql-editor"></div>
      <div class="flex justify-center gap-3">
        <UButton
          class="w-32 justify-center"
          size="lg"
          color="gray"
          square
          variant="solid"
          @click="router.push(`/test/attempt-${route.params.id}`)"
          label="Start"
        />
      </div>
    </div>
  </div>
</template>
<script setup>
import base64 from "base-64";
import moment from "moment";
definePageMeta({
  layout: "no-sidebar",
});
const testStore = useTestStore();
const subjectStore = useSubjectStore();
const route = useRoute();
const router = useRouter();
const { departments, subjects, topics } = storeToRefs(subjectStore);
const { test } = storeToRefs(testStore);
onMounted(() => {
  testStore.fetchTestLtdAction(route.params.id);
});
</script>