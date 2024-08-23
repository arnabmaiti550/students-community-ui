<template>
  <SignIn />
  <div class="flex flex-col md:flex-row space-x-4">
    <div
      v-if="test.status == 'DRAFT'"
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
      <div class="flex justify-between items-center">
        <span>Full Marks- {{ test.fullMarks }} </span>
        <span>
          Time- {{ hours ? hours + " hours : " : ""
          }}{{ minutes ? minutes + " minutes" : "" }}
          <UButton
            icon="i-heroicons-pencil-square"
            size="sm"
            color="white"
            class="text-gray-600"
            variant="solid"
            @click="isOpen = true"
        /></span>
      </div>

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
            <div class="space-x-2" v-if="test.status == 'DRAFT'">
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

        <div class="grid grid-cols-1 mt-4" v-if="test.status == 'DRAFT'">
          <div class="flex justify-center gap-3">
            <UButton
              class="w-32 justify-center"
              size="lg"
              color="green"
              square
              v-if="test.questions.length"
              variant="solid"
              :loading="loading"
              @click="confirmationPopup = true"
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
          <UButton
            color="red"
            variant="ghost"
            icon="i-heroicons-x-mark-20-solid"
            class="-my-1"
            @click="isOpen = false"
          />
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
            CONFIRMATION
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
        Are you sure you want to publish? You won't be able to modify later.
      </ULandingCard>
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
              @click="publishTest"
              label="Save"
            />
          </div>
        </div>
      </ULandingCard>
    </UCard>
  </UModal>
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
const { test } = storeToRefs(testStore);
const { $toast } = useNuxtApp();
const department = ref("");
const subject = ref("");
const topic = ref("");
const testDescription = ref();
const questionRef = ref();
const solutionRef = ref();
const router = useRouter();
const route = useRoute();
const hours = ref();
const minutes = ref();
const confirmationPopup = ref(false);
const type = ref("MCQ");
const questionTypes = ["MCQ", "MSQ", "NAT"];
const options = ref([
  { value: 0, label: "", correct: false },
  { value: 1, label: "", correct: false },
]);
const marks = ref();
const negative = ref(0.0);
const isOpen = ref(false);
const loading = ref(false);
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
  testDescription.value ? testDescription.value.getEditorContent() : null;
  editIndex.value = null;
  const payload = {
    department: department.value,
    title: title.value,

    time: moment
      .duration({ hours: hours.value, minutes: minutes.value })
      .asSeconds(),
    status: status.value,
  };

  if (testDescription.value?.editorHtml) {
    payload.description = utf8ToHex(testDescription.value?.editorHtml);
    payload.descriptionData = testDescription.value?.editorContent;
  }
  if (tempQuestions.value.length)
    payload.questions = [...tempQuestions.value].map((el) => {
      const regex =
        /^([A-Za-z0-9+/]{4})*([A-Za-z0-9+/]{3}=|[A-Za-z0-9+/]{2}==)?$/;
      el.question = utf8ToHex(el.question);
      el.solution = utf8ToHex(el.solution);
      return el;
    });

  if (subject.value?.length) payload.subject = subject.value;
  if (topic.value?.length) payload.topic = topic.value;
  try {
    loading.value = true;
    await testStore.updateTestAction({ id, payload });
    isOpen.value = false;
    await testStore.fetchTestAction(route.params.id);
    questions.value = test.value.questions;
    tempQuestions.value = [];
    reRender();
    $toast.success("Saved as Draft");
  } catch (err) {
    $toast.error(err.message);
    throw Error(err.message);
  }
  loading.value = false;
}
async function publishTest() {
  const id = route.params.id;
  const payload = {
    status: "PUBLISH",
  };
  loading.value = true;
  await testStore.updateTestAction({ id, payload });
  loading.value = false;
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
  if (type.value !== "NAT" && options.value.length < 2) {
    $toast.error("Atleast 2 options needed");
    return;
  }
  if (!optionKeys.value.length && answer.value === "") {
    $toast.error("Answer not selected");
    return;
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
    loading.value = true;
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

    await testStore.fetchTestAction(route.params.id);
    questions.value = test.value.questions;
    reRender();
  } catch (err) {
    $toast.error(err.message);
  }
  loading.value = false;
}
function updateLabel() {
  console.log(options.value);
}
function clearTopic() {
  subject.value = "";
  topic.value = "";
}
async function moveUp(i) {
  if (i < 1) return;
  tempQuestions.value = [...questions.value];
  const temp = questions.value[i];
  const alter = questions.value[i - 1];
  tempQuestions.value[i] = alter;
  tempQuestions.value[i - 1] = temp;
  await submitTest();
}
async function moveDown(i) {
  if (i > questions.value - 2) return;
  tempQuestions.value = [...questions.value];
  const temp = questions.value[i];
  const alter = questions.value[i + 1];
  tempQuestions.value[i] = alter;
  tempQuestions.value[i + 1] = temp;
  await submitTest();
}
async function deleteQuestion(i) {
  tempQuestions.value = [...questions.value];
  tempQuestions.value.splice(i, 1);
  await submitTest();
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
watch(type, (val) => {
  answer.value = "";
  optionKeys.value = [];
});
watch(isOpen, (val) => {
  if (val)
    setTimeout(() => {
      testDescription.value.setEditorContent(test.value.descriptionData);
    }, 100);
});
onMounted(async () => {
  subjectStore.fetchDepartmentsAction();
  await testStore.fetchTestAction(route.params.id);
  department.value = test.value.department;
  subject.value = test.value.subject;
  topic.value = test.value.topic;
  title.value = test.value.title;
  if (test.value.time) {
    const temp = moment.duration(test.value.time, "seconds");
    hours.value = temp.hours();
    minutes.value = temp.minutes();
  }
  questions.value = test.value.questions;

  reRender();
});
</script>