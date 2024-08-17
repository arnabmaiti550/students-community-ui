<template>
  <div class="layout has-sidebar" v-bind:class="{ rtl }">
    <aside
      class="sidebar text-2xl break-point-lg text-center"
      v-bind:class="{ collapsed, toggled }"
    >
      <UButton
        icon="i-heroicons-home"
        size="xl"
        color="white"
        square
        variant="solid"
        @click="router.push(`/redirect`)"
      />
      <span class="editor">ASK LEARN GROW</span>
    </aside>
    <div class="overlay" v-on:click="setToggled()"></div>
    <div class="layout">
      <ScHeader @toggle="setToggled()" />

      <main class="content">
        <slot />
        <div class="grid grid-cols-12 space-x-4">
          <div class="col-span-12 md:col-span-8"></div>
        </div>
      </main>
      <div class="create-button"></div>
    </div>
  </div>
</template>
<script>
const subjectStore = useSubjectStore();
const { departmentTree } = storeToRefs(subjectStore);

export default {
  name: "no-sidebar",
  data: () => ({
    collapsed: true,
    toggled: false,
    rtl: false,
  }),
  computed: {
    departments() {
      return departmentTree.value;
    },
  },
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

  async mounted() {
    await subjectStore.fetchDepartmentAction();
  },
};
</script>
<script setup>
const runtimeConfig = useRuntimeConfig();
const authStore = useAuthStore();
const { token } = storeToRefs(authStore);
const router = useRouter();

useHead({
  link: [
    {
      rel: "stylesheet",
      href: "https://cdn.jsdelivr.net/npm/quill@2.0.2/dist/quill.snow.css",
    },
    {
      rel: "stylesheet",
      href: "https://unpkg.com/css-pro-layout/dist/css/css-pro-layout.min.css",
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

onMounted(() => {
  // window.MathJax.tex = {
  //   inlineMath: [
  //     ["$", "$"],
  //     ["\\(", "\\)"],
  //   ],
  // };

  // window.MathJax.options = {
  //   skipHtmlTags: ["script", "noscript", "style", "textarea", "pre"],
  //   processHtmlClass: "math-content",
  // };

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
watch(
  router,
  (val) => {
    console.log(val);
  },
  { deep: true }
);
onUpdated(updateMathJax);
</script>
<style scoped>
.layout .header {
  background-color: #fff;
  box-shadow: 1px 1px 4px #9aa0b9;
  display: flex;
  align-items: center;
  padding: 20px;
}

.layout .content {
  /* background-color: #bec4de; */
  padding: 10px;

  height: calc(100vh - 65px);
  overflow-x: hidden;
  overflow-y: scroll;
}

.layout .footer {
  text-align: center;
  background-color: #a7aed0;
  padding: 20px;
}

.layout .sidebar {
  background-color: #292e3e;
  color: #fff;
  padding: 20px 0;
  text-align: center;
  height: 100vh;
  overflow-y: scroll;
  overflow-x: hidden;
}
.sidebar.collapsed {
  background: white;
  color: #292e3e;
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
.create-button {
  position: fixed;
  bottom: 35%;
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
.editor {
  font-size: 20px;
  letter-spacing: 0.5rem;
  margin: 10px;
  display: inline-block;
  text-orientation: upright;
  writing-mode: vertical-lr;
  background: linear-gradient(to top, #223b85, #7bfafe);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}
@media (min-width: 640px) {
  .create-button {
    display: none;
  }
  .layout .content {
    padding: 20px;
  }
}
</style>