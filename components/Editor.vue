<template>
  <ClientOnly>
    <div
      :class="{
        'grid  grid-cols-12 md:space-x-4': isPost,
        'flex flex-col space-y-4': !isPost,
      }"
      class="relative"
    >
      <div :class="{ 'col-span-12 md:col-span-6': isPost }">
        <label v-if="isPost">Description:</label>
        <div id="editor" class="tex2jax_ignore mathjax-ignore" />
      </div>

      <div :class="{ 'col-span-12 md:col-span-6 md:-mt-10 mt-4': isPost }">
        <label class="text-[#3d5f75] text-lg">Preview</label>
        <div class="preview-area ql-editor">
          <div class="title" v-if="isPost">{{ title }}</div>

          <div class="math-content" v-html="editorHtml"></div>
        </div>
      </div>
    </div>
  </ClientOnly>
</template>
<script setup>
import { debounce } from "lodash";
const props = defineProps({
  isPost: {
    type: Boolean,
    default: false,
  },
  title: {
    type: String,
  },
  placeholder: {
    type: String,
  },
});
let quill;
const editorContent = ref("");
const editorHtml = ref("");
let updateHandler;
const toolbarOptions = [
  ["bold", "italic", "underline", "strike"], // toggled buttons
  ["blockquote", "code-block"],
  ["link", "image", "video", "formula"],

  [{ header: 1 }, { header: 2 }], // custom button values
  [{ list: "ordered" }, { list: "bullet" }, { list: "check" }],
  [{ script: "sub" }, { script: "super" }], // superscript/subscript
  [{ indent: "-1" }, { indent: "+1" }], // outdent/indent
  [{ direction: "rtl" }], // text direction

  [{ align: [] }],

  ["clean"], // remove formatting button
];
const loadScript = (src) => {
  return new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.src = src;
    script.async = true;
    script.onload = resolve;
    script.onerror = reject;
    document.head.appendChild(script);
  });
};
const getEditorContent = () => {
  if (quill) {
    editorContent.value = quill.getContents();
  }
};

// Method to set the editor content
const setEditorContent = (data) => {
  console.log("shshsh");
  if (quill) {
    console.log("shshsh");
    const content = [
      { insert: "Hello World!\n" },
      { insert: "This is a test.", attributes: { bold: true } },
    ];
    quill.setContents(data);
  }
};
function reRender() {
  editorHtml.value = quill.root.innerHTML;
  if (MathJax && MathJax.Hub) {
    const dynamicContent = document.querySelector(".preview-area");

    setTimeout(() => {
      MathJax.Hub.Queue(["Typeset", MathJax.Hub]);
    }, 200);
  }
}
onMounted(async () => {
  updateHandler = debounce(reRender, 400);
  try {
    // Load Quill and Highlight.js scripts
    await loadScript(
      "https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/highlight.min.js"
    );
    await loadScript("https://cdn.jsdelivr.net/npm/quill@2.0.2/dist/quill.js");

    // Check if Quill is loaded
    if (typeof Quill !== "undefined") {
      quill = new Quill("#editor", {
        modules: {
          syntax: true,
          toolbar: toolbarOptions,
        },

        theme: "snow",
      });

      // Enable syntax highlighting
      quill.on("text-change", () => {
        updateHandler();
        const blocks = document.querySelectorAll("pre code");
        blocks.forEach((block) => {
          hljs.highlightElement(block);
        });
      });
    } else {
      console.error("Quill is not defined");
    }
  } catch (error) {
    console.error("Error loading scripts:", error);
  }
});
watch(
  () => props.title,
  (val) => {
    updateHandler();
  }
);
defineExpose({ editorHtml, getEditorContent, setEditorContent, editorContent });
</script>
<style lang="scss" scoped>
.preview-area {
  background: white;
  border: 1px solid #e9e9e9;
  border-radius: 2px;
  font-size: 0.94rem;
}
.math-content {
  padding: 1rem;
}
#editor {
  max-height: 200px;
}
.grid #editor {
  height: auto;
  max-height: none;
  min-height: 100px;
}
.title {
  padding: 1rem;

  font-weight: 550;
  color: #242424;
  font-size: 0.9rem;
  border-bottom: 1px solid #e3e3e3;
  padding-bottom: 1rem;
}
.ql-editor {
  height: auto;
}
</style>