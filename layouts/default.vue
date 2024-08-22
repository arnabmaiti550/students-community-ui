<template>
  <div class="layout has-sidebar" v-bind:class="{ rtl }">
    <aside class="sidebar break-point-lg" v-bind:class="{ collapsed, toggled }">
      <div class="" style="font-size: 1.1rem">MENU</div>
      <UButton
        color="gray"
        variant="ghost"
        class="border-b mt-6 w-full text-green-400 border-gray-200 dark:border-gray-700"
        :ui="{ rounded: 'rounded-none', padding: { sm: 'p-3' } }"
        icon="i-heroicons-trophy"
        @click="router.push(`/test/`)"
      >
        <span class="truncate text-gray-700"> Test Zone</span>
        <template #trailing>
          <UIcon
            name="i-heroicons-chevron-right-20-solid"
            class="w-5 h-5 ms-auto transform transition-transform duration-200"
            :class="[open && 'rotate-90']"
          />
        </template>
      </UButton>
      <UAccordion multiple :items="departments">
        <template #default="{ item, open }">
          <UButton
            color="gray"
            variant="ghost"
            class="border-b text-blue-400 border-gray-200 dark:border-gray-700"
            :ui="{ rounded: 'rounded-none', padding: { sm: 'p-3' } }"
            icon="i-heroicons-academic-cap"
            @click="fetchSubject(item)"
          >
            <span class="truncate text-gray-700"> {{ item.name }}</span>
            <template #trailing>
              <UIcon
                name="i-heroicons-chevron-right-20-solid"
                class="w-5 h-5 ms-auto transform transition-transform duration-200"
                :class="[open && 'rotate-90']"
              />
            </template>
          </UButton>
        </template>

        <template #item="{ item }">
          <UButton
            color="gray"
            variant="ghost"
            v-if="!item.noqna"
            class="w-full border-b pl-8 text-teal-500 border-gray-200 dark:border-yellow-600"
            :ui="{ rounded: 'rounded-none', padding: { sm: 'p-3' } }"
            icon="i-heroicons-signal"
            @click="navigateToQna('department', item)"
          >
            <span class="truncate text-gray-600"> All Posts</span>
            <template #trailing>
              <UIcon
                name="i-heroicons-chevron-right-20-solid"
                class="w-5 h-5 ms-auto transform transition-transform duration-200"
                :class="[open && 'rotate-90']"
              />
            </template>
          </UButton>
          <UAccordion multiple :items="subjects[item._id]">
            <template #default="{ item, open }">
              <UButton
                color="gray"
                variant="ghost"
                class="border-b ml-4 text-cyan-400 border-gray-200 dark:border-yellow-600"
                :ui="{ rounded: 'rounded-none', padding: { sm: 'p-3' } }"
                icon="i-heroicons-book-open"
                @click="fetchTopic(item)"
              >
                <span class="truncate text-gray-600"> {{ item.name }}</span>
                <template #trailing>
                  <UIcon
                    name="i-heroicons-chevron-right-20-solid"
                    class="w-5 h-5 ms-auto transform transition-transform duration-200"
                    :class="[open && 'rotate-90']"
                  />
                </template>
              </UButton>
            </template>
            <template #item="{ item }">
              <UButton
                color="gray"
                variant="ghost"
                v-if="!item.noqna"
                class="w-full p-3 pl-12 border-b text-teal-500 border-gray-200"
                :ui="{ rounded: 'rounded-none', padding: { sm: 'p-3' } }"
                @click="navigateToQna('subject', item)"
                icon="i-heroicons-signal"
              >
                <span class="truncate text-gray-500"> All Posts </span>
              </UButton>
              <div
                v-for="(topic, i) in topics[item._id]"
                :key="i"
                class="w-full"
              >
                <UButton
                  color="gray"
                  variant="ghost"
                  class="w-full p-3 ml-8 border-b text-teal-500 border-gray-200"
                  :ui="{ rounded: 'rounded-none', padding: { sm: 'p-3' } }"
                  @click="navigateToTopic(topic)"
                  icon="i-heroicons-bookmark"
                >
                  <span class="truncate text-gray-500"> {{ topic.name }}</span>
                </UButton>
              </div>
              <!-- <UAccordion :items="item.topics">
                <template #default="{ item }">
                  <div class="ml-8">{{ item.name }}</div>
                </template>
              </UAccordion> -->
            </template>
          </UAccordion>
        </template>
      </UAccordion>
    </aside>
    <div class="overlay" v-on:click="setToggled()"></div>
    <div class="layout bg-[#edeef5]">
      <ScHeader @toggle="setToggled()" class="mb-2 md:mb-0" />

      <main class="content">
        <div class="grid grid-cols-12 space-x-4">
          <div class="col-span-12 md:col-span-8">
            <slot />
          </div>
          <div
            v-if="userInfo.name"
            class="col-span-12 md:col-span-4 hidden md:block text-4xl text-gray-400 font-bold leading-normal tracking-wide"
          >
            Welcome, <br />
            {{ userInfo.name }}<br />
            XP {{ userInfo.xp }}
          </div>
          <div
            v-else
            class="col-span-12 md:col-span-4 hidden md:block text-4xl text-gray-400 font-bold leading-normal tracking-wide"
          >
            Welcome to Student's Community
          </div>
        </div>
      </main>
      <div class="create-button">
        <UTooltip text="Create Post" :popper="{ arrow: true }">
          <UButton
            icon="i-heroicons-plus"
            size="xl"
            @click="router.push(`/post/create`)"
            color="white"
            class="rounded-full shadow-button"
            variant="solid"
        /></UTooltip>
      </div>
    </div>
  </div>
</template>
<script>
import { storeToRefs } from "pinia";
const subjectStore = useSubjectStore();
const { departmentTree, departments, subjects, topics } =
  storeToRefs(subjectStore);

export default {
  name: "Default",
  data: () => ({
    collapsed: false,
    toggled: false,
    rtl: false,
  }),
  computed: {},
  methods: {
    setCollapsed() {
      this.collapsed = !this.collapsed;
    },
    setToggled() {
      this.toggled = !this.toggled;
    },
    setRTL() {
      this.rtl = !this.rtl;
    },
  },
};
</script>
<script setup>
import "css-pro-layout/dist/css/css-pro-layout.css";
const runtimeConfig = useRuntimeConfig();
const authStore = useAuthStore();
const { token, loggedIn, userInfo } = storeToRefs(authStore);
const router = useRouter();

useHead({
  link: [
    {
      rel: "stylesheet",
      href: "https://cdn.jsdelivr.net/npm/quill@2.0.2/dist/quill.snow.css",
    },

    {
      rel: "stylesheet",
      href: "https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/styles/atom-one-dark.min.css",
    },
    {
      rel: "stylesheet",
      href: "https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/katex.min.css",
    },
  ],
  script: [
    {
      src: "https://polyfill.io/v3/polyfill.min.js?features=es6",
    },
    {
      src: "https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/highlight.min.js",
    },
    {
      src: `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${runtimeConfig.public.GOOGLE_ADSENSE_ID}`,
      async: true,
      crossorigin: "anonymous",
    },
    {
      type: "text/javascript",
      children: ` (adsbygoogle = window.adsbygoogle || []).push({});
      `,
    },
    {
      src: "https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/katex.min.js",
      type: "text/javascript",
      body: true, // Place the script in the <body> tag for better performance
    },
    {
      src: "https://cdn.jsdelivr.net/npm/katex@0.16.10/dist/contrib/auto-render.min.js",
      type: "text/javascript",
      body: true, // Place the script in the <body> tag for better performance
    },
    {
      src: "https://cdnjs.cloudflare.com/ajax/libs/mathjax/2.7.9/MathJax.js?config=TeX-AMS-MML_HTMLorMML",
      type: "text/javascript",
      async: true,
      id: "MathJax-script",
    },
    {
      type: "text/x-mathjax-config",
      children: `
         MathJax.Hub.Config({"HTML-CSS": { preferredFont: "TeX", availableFonts: ["STIX","TeX"], linebreaks: { automatic:true }, EqnChunk: (MathJax.Hub.Browser.isMobile ? 10 : 50) },
        tex2jax: { inlineMath: [ ["\\$", "\\$"], ["\\\\(", "\\\\)"] ], displayMath: [ ["$$","$$"], ["\\\\[", "\\\\]"] ], processEscapes: true, ignoreClass: "tex2jax_ignore|dno" },
        TeX: {  noUndefined: { attributes: { mathcolor: "red", mathbackground: "#FFEEEE", mathsize: "90%" } } },
        messageStyle: "none"
    });
      `,
    },

    {
      src: "https://cdn.jsdelivr.net/npm/quill@2.0.2/dist/quill.js",
      async: true,
    },
  ],
});
const updateMathJax = () => {
  if (window.MathJax && window.MathJax.Hub) {
    MathJax.Hub.Queue(["Typeset", MathJax.Hub]);
  }
};
const slugify = (str) =>
  str
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
function navigateToTopic(topic) {
  console.log(topic);
  const dep = slugify(topic.subject?.department?.name || "");
  const sub = slugify(topic.subject?.name || "");
  const top = slugify(topic.name);
  const url = `${dep}+${sub}+${top}`;
  router.push(`/${url}/${topic._id}`);
}
function navigateToQna(type, topic) {
  console.log(topic);
  const dep = slugify(topic.department?.name || "");
  const sub = slugify(topic.name || "");

  const url = `QNA${dep ? "+" : ""}${dep}+${sub}`;
  router.push(`/qna-${url}/${type}-${topic._id}`);
}
function fetchSubject(item) {
  subjectStore.fetchSubjectsAction(item._id);
}
function fetchTopic(item) {
  subjectStore.fetchTopicsAction(item._id);
}
onMounted(async () => {
  subjectStore.fetchDepartmentsAction();

  updateMathJax();
  // renderMathInElement(document.body, {
  //   // customised options
  //   // • auto-render specific keys, e.g.:
  //   delimiters: [
  //     { left: "$$", right: "$$", display: true },
  //     { left: "$", right: "$", display: false },
  //     { left: "\\(", right: "\\)", display: false },
  //     { left: "\\[", right: "\\]", display: true },
  //   ],
  //   // • rendering keys, e.g.:
  //   throwOnError: false,
  // });
  //setTimeout(updateMathJax, 500);
});

onUpdated(updateMathJax);
</script>
<style scoped>
.layout .header {
  background-color: #fff;
  box-shadow: 1px 1px 4px #9aa0b9;
  display: flex;
  align-items: center;

  padding: 20px 10px;
}

.layout .content {
  /* background-color: #bec4de; */
  background: #edeef5;
  padding: 10px;
  padding-right: 0px;
  padding-top: 0px;
  padding-bottom: 0px !important;
}

.layout .footer {
  text-align: center;
  background-color: #a7aed0;
  padding: 20px;
}

.layout .sidebar {
  background-color: #ffffff;
  color: #383838;
  padding: 20px 0;
  text-align: center;
  height: 100vh;
  overflow-y: scroll;
  overflow-x: hidden;
}

a.btn {
  display: inline-block;
  margin: 10px 0;
  padding: 8px 20px;
  background-color: #fff;
  text-decoration: none;
  color: #000;
  box-shadow: 1px 1px 4px #8990ad;
  width: 100px;
  text-align: center;
  border-radius: 4px;
  font-size: 0.9rem;
}

a.btn:hover {
  background-color: #f1f1f1;
}
.sidebar.toggled {
  /* Example: Show sidebar when toggled */
  transform: translateX(0);
}

/* Add styles for collapsed class */
.sidebar.collapsed {
  /* Example: Hide sidebar when collapsed */
  transform: translateX(-100%);
}

.create-button {
  position: fixed;
  bottom: 5%;
  right: 5%;
  z-index: 10;
}
.shadow-button {
  box-shadow: rgba(11, 70, 119, 0.5) 0px 19px 38px,
    rgba(48, 100, 77, 0.22) 0px 15px 12px;
  color: #3b9aa9;
  font-weight: 600;
  border: 1px solid #3b9aa9;
}
@media (min-width: 640px) {
  .create-button {
    display: none;
  }
  .layout .content {
    padding: 20px;
    padding-right: 10px;
    padding-top: 10px;
  }
}
</style>