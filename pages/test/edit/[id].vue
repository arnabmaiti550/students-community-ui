<template>
  <div class="flex flex-col md:flex-row space-x-4">
    <div
      v-if="test.status != 'PUBLISH'"
      class="bg-white p-4 overflow-x pb-6 md:w-3/5"
    >
      <h3
        class="mb-2 pb-2 text-xl text-gray-500 border-b md:w-1/2 border-gray-200"
      >
        Question Editor
      </h3>
      <div class="flex space-x-4 items-center mb-4">
        <label>Type</label>
        <USelect
          v-model="type"
          size="md"
          class="w-2/6 sm:w-1/5"
          :options="questionTypes"
        />
        <label>Marks</label>
        <UInput v-model="marks"></UInput>
        <label>Negative</label>
        <UInput v-model="negative" style="color: red !important"></UInput>
      </div>
      Question:
      <editor ref="questionRef"></editor>
      <div class="h-3"></div>
      <div v-if="type != 'NAT'">
        <div class="flex justify-between">
          <span>Options:</span>
          <span>
            <UButton
              icon="i-heroicons-plus"
              class="mr-2"
              size="xs"
              @click="addOption" />
            <UButton
              icon="i-heroicons-minus"
              color="red"
              size="xs"
              @click="removeOption"
          /></span>
        </div>
        (Selected option will be considered as answer.)
        <div v-if="type == 'MCQ'">
          <URadio
            v-for="option in options"
            :key="option.value"
            v-model="answer"
            v-bind="option"
          >
            <template #label>
              <UInput
                v-model="option.label"
                class="w-[80vw] md:w-[45vw] mb-4"
                placeholder="enter option"
                @input="updateLabel"
              ></UInput>
            </template>
          </URadio>
        </div>
        <div v-if="type == 'MSQ'">
          <UFormGroup name="checkbox" v-for="(option, i) in options" :key="i">
            <UCheckbox v-model="option.correct">
              <template #label>
                <UInput
                  v-model="option.label"
                  class="w-[80vw] md:w-[45vw] mb-4"
                  placeholder="enter option"
                ></UInput>
              </template>
            </UCheckbox>
          </UFormGroup>
        </div>
      </div>
      <div v-else>
        <label>Answer</label>
        <UInput
          v-model="answer"
          class="w-[80vw] md:w-[45vw] mb-4"
          placeholder="enter answer"
        ></UInput>
        <label
          >Tolerance
          <span class="text-orange-600 text-xs">$(\pm)$</span>
        </label>
        <UInput
          v-model="tolerance"
          class="w-[80vw] md:w-[45vw] mb-4"
          placeholder="enter tolerance"
        ></UInput>
      </div>
      Solution (Optional):
      <editor ref="solutionRef" editorId="solution"></editor>
      <div class="flex justify-center gap-3 mt-4">
        <UButton
          class="w-32 justify-center"
          size="lg"
          color="cyan"
          square
          variant="solid"
          :disabled="loading || invalidForm"
          :loading="loading"
          @click="addQuestion()"
          :label="editIndex ? 'Update Question' : 'Add Question'"
        />
      </div>
    </div>

    <div class="md:w-2/5">
      <h3 class="font-bold text-xl">{{ test.title }}</h3>
      Full Marks- {{ test.fullMarks }}
      <div v-html="test.description"></div>

      <div class="p-4 flex flex-col space-y-4 bg-white">
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
            <UFormGroup
              name="checkbox"
              v-for="(option, i) in q.options"
              :key="i"
            >
              <UCheckbox v-model="option.attempt" v-bind="option"> </UCheckbox>
            </UFormGroup>
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

        <div class="grid grid-cols-1 mt-4" v-if="test.status != 'PUBLISH'">
          <div class="flex justify-center gap-3">
            <UButton
              class="w-32 justify-center"
              size="lg"
              color="green"
              square
              variant="solid"
              :disabled="loading || invalidForm"
              :loading="loading"
              @click="publishTest"
              label="Publish"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
  <UModal v-model="isOpen" prevent-close :ui="{ width: 'md:max-w-screen-md' }">
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
      </ULandingCard>
      <label>Description </label>
      <editor editorId="testDescription" ref="testDescription" />

      <ULandingCard>
        <div class="grid grid-cols-1 mt-4">
          <div class="flex justify-center gap-3">
            <UButton
              class="w-32 justify-center"
              size="lg"
              color="cyan"
              square
              variant="solid"
              :disabled="loading || invalidForm"
              :loading="loading"
              @click="submitTest"
              label="Create"
            />
          </div>
        </div>
      </ULandingCard>
    </UCard>
  </UModal>
</template>
<script setup>
import base64 from "base-64";
definePageMeta({
  layout: "no-sidebar",
});
const testStore = useTestStore();
const subjectStore = useSubjectStore();
const { departments, subjects, topics } = storeToRefs(subjectStore);
const { test } = storeToRefs(testStore);

const department = ref("");
const subject = ref("");
const topic = ref("");
const testDescription = ref();
const questionRef = ref();
const solutionRef = ref();
const router = useRouter();
const route = useRoute();

const type = ref("MCQ");
const questionTypes = ["MCQ", "MSQ", "NAT"];
const options = ref([
  { value: 0, label: "", correct: false },
  { value: 1, label: "", correct: false },
]);
const marks = ref();
const negative = ref(0.0);
const isOpen = ref(false);
const title = ref("");
const selected = ref(0);
const questions = ref([]);
const editIndex = ref(null);
const tempQuestions = ref([]);
const optionKeys = ref([]);
const status = ref("DRAFT");
const answer = ref("");
const tolerance = ref("");

function addOption() {
  options.value = [
    ...options.value,
    { value: options.value.length, label: "", correct: false },
  ];
}
function removeOption() {
  const i = options.value.length - 1;
  if (i <= 1) return;
  options.value.splice(i, 1);
}

async function submitTest() {
  const id = route.params.id;
  editIndex.value = null;
  const payload = {
    // department: department.value,
    // title: title.value,
    // description: base64.encode(testDescription.value?.editorHtml),
    // descriptionData: testDescription.value?.editorContent,
    status: status.value,
  };
  if (tempQuestions.value.length)
    payload.questions = [...tempQuestions.value].map((el) => {
      const regex =
        /^([A-Za-z0-9+/]{4})*([A-Za-z0-9+/]{3}=|[A-Za-z0-9+/]{2}==)?$/;
      el.question = regex.test(el.question)
        ? el.question
        : base64.encode(el.question);
      el.solution = regex.test(el.solution)
        ? el.solution
        : base64.encode(el.solution);
      return el;
    });

  if (subject.value.length) payload.subject = subject.value;
  if (topic.value.length) payload.topic = topic.value;

  await testStore.updateTestAction({ id, payload });
}
async function publishTest() {
  const id = route.params.id;
  const payload = {
    status: "PUBLISH",
  };

  await testStore.updateTestAction({ id, payload });
  router.push(`/test`);
}
async function addQuestion() {
  questionRef.value.getEditorContent();
  solutionRef.value.getEditorContent();
  if (type.value == "MSQ") {
    optionKeys.value = options.value
      .filter((el) => el.correct)
      .map((el) => el.value);
  }
  const questionObj = {
    type: type.value,
    question: questionRef.value.editorHtml,
    questionData: questionRef.value.editorContent,
    marks: parseFloat(marks.value),
    negative: parseFloat(negative.value),
    tolerance: parseFloat(tolerance.value),
    options: options.value,
    optionKeys: optionKeys.value,
    answer: answer.value,
    solution: solutionRef.value.editorHtml,
    solutionData: solutionRef.value.editorContent,
  };
  tempQuestions.value = [...questions.value];
  if (editIndex.value) tempQuestions.value[editIndex.value] = questionObj;
  else tempQuestions.value.push(questionObj);
  try {
    await submitTest();
    type.value = "";
    marks.value = "";
    negative.value = 0;
    tolerance.value = "";
    answer.value = "";
    tempQuestions.value = [];

    questionRef.value.setEditorContent("");
    solutionRef.value.setEditorContent("");
    options.value = [
      { value: 0, label: "", correct: false },
      { value: 1, label: "", correct: false },
    ];
  } catch (err) {
    console.log("something went wrong while adding question", err);
  }
  await testStore.fetchTestAction(route.params.id);
  questions.value = test.value.questions;
  reRender();
}
function updateLabel() {
  console.log(options.value);
}
async function moveUp(i) {
  if (i < 1) return;
  tempQuestions.value = [...questions.value];
  const temp = questions.value[i];
  const alter = questions.value[i - 1];
  tempQuestions.value[i] = alter;
  tempQuestions.value[i - 1] = temp;
  await submitTest();
  await testStore.fetchTestAction(route.params.id);
  questions.value = test.value.questions;
  tempQuestions.value = [];
  reRender();
}
async function moveDown(i) {
  if (i > questions.value - 2) return;
  tempQuestions.value = [...questions.value];
  const temp = questions.value[i];
  const alter = questions.value[i + 1];
  tempQuestions.value[i] = alter;
  tempQuestions.value[i + 1] = temp;
  await submitTest();
  await testStore.fetchTestAction(route.params.id);
  questions.value = test.value.questions;
  tempQuestions.value = [];
  reRender();
}
async function deleteQuestion(i) {
  tempQuestions.value = [...questions.value];
  tempQuestions.value.splice(i, 1);
  await submitTest();
  await testStore.fetchTestAction(route.params.id);
  questions.value = test.value.questions;
  tempQuestions.value = [];
  reRender();
}
async function setQuestion(i) {
  editIndex.value = i;
  const q = questions.value[i];
  if (!q) return;
  type.value = q.type;
  questionRef.value.setEditorContent(q.questionData);
  marks.value = q.marks;
  negative.value = q.negative;
  tolerance.value = q.tolerance;
  options.value = q.options;
  optionKeys.value = q.optionKeys;
  answer.value = q.answer;
  solutionRef.value.setEditorContent(q.solutionData);
}

function reRender() {
  if (MathJax && MathJax.Hub) {
    setTimeout(() => {
      MathJax.Hub.Queue(["Typeset", MathJax.Hub]);
    }, 200);
  } else {
    console.log("error");
  }
}
watch(department, (val) => {
  subjectStore.fetchSubjectsAction(val);
});
watch(subject, (val) => {
  subjectStore.fetchTopicsAction(val);
});
onMounted(async () => {
  subjectStore.fetchDepartmentsAction();
  await testStore.fetchTestAction(route.params.id);
  questions.value = test.value.questions;
  reRender();
});
</script>