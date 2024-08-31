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
        <div :id="editorId" class="tex2jax_ignore mathjax-ignore" />
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

const runtimeConfig = useRuntimeConfig();
// register quill-upload

const postStore = usePostStore();
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
  editorId: {
    type: String,
    default: "editor",
  },
});
let quill;
const editorContent = ref("");
const editorHtml = ref("");
const tempVideo = ref("");
const setContent = ref(false);
let updateHandler;
let currentMedia = [];

const toolbarOptions = [
  ["bold", "italic", "underline", "strike"],
  ["blockquote", "code-block"],
  ["link", "image", "video", "attachment", "formula"],
  [{ header: 1 }, { header: 2 }],
  [{ list: "ordered" }, { list: "bullet" }, { list: "check" }],
  [{ script: "sub" }, { script: "super" }],
  [{ indent: "-1" }, { indent: "+1" }],
  [{ direction: "rtl" }],
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
  setContent.value = true;
  if (quill) {
    quill.setContents(data);
  }
  setContent.value = false;
};
function isBase64DataURI(str) {
  const base64Pattern = /^data:image\/(png|jpg|jpeg|gif|bmp|webp);base64,/;
  return base64Pattern.test(str);
}
function reRender() {
  editorHtml.value = quill.root.innerHTML;
  if (MathJax && MathJax.Hub) {
    const dynamicContent = document.querySelector(".preview-area");

    setTimeout(() => {
      MathJax.Hub.Queue(["Typeset", MathJax.Hub]);
    }, 200);
  }
}
function base64ToFile(base64String, fileName) {
  const base64Pattern = /^data:(.+);base64,/;
  const matches = base64String.match(base64Pattern);

  if (!matches) {
    throw new Error("Invalid base64 string");
  }

  const mimeType = matches[1];
  const base64Data = base64String.replace(base64Pattern, "");

  // Convert the base64 string to a byte array
  const byteCharacters = atob(base64Data);
  const byteNumbers = new Array(byteCharacters.length);

  for (let i = 0; i < byteCharacters.length; i++) {
    byteNumbers[i] = byteCharacters.charCodeAt(i);
  }

  const byteArray = new Uint8Array(byteNumbers);

  // Create a Blob from the byte array
  const blob = new Blob([byteArray], { type: mimeType });

  // Convert the Blob to a File
  const file = new File([blob], fileName, { type: mimeType });

  return file;
}
function isValidUrl(string) {
  try {
    new URL(string);
    return true;
  } catch (_) {
    return false;
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
    const { ImageHandler, VideoHandler, AttachmentHandler } = await import(
      "quill-upload"
    );
    // Check if Quill is loaded
    if (typeof Quill !== "undefined") {
      const Video = Quill.import("formats/video");
      const Link = Quill.import("formats/link");
      const Image = Quill.import("formats/image");
      const BlockEmbed = Quill.import("blots/block/embed");

      class IframeEmbed extends BlockEmbed {
        static create(value) {
          let node = super.create();
          node.setAttribute("src", value.url);
          node.setAttribute("frameborder", "0");
          node.setAttribute("allowfullscreen", true);
          node.setAttribute("style", "width: 100%; height: 400px;");
          return node;
        }

        static value(node) {
          return {
            url: node.getAttribute("src"),
          };
        }
      }

      // Register the blot with Quill
      IframeEmbed.blotName = "iframe";
      IframeEmbed.tagName = "iframe";
      Quill.register(IframeEmbed);

      class CoustomVideo extends Video {
        static create(value) {
          // console.log(tempVideo.value, value);
          const url = isValidUrl(value) ? value : value.url;
          if (!url) return;
          const node = super.create(url);

          const video = document.createElement("video");
          video.setAttribute("controls", true);
          video.setAttribute("id", Math.floor(Math.random() * 299));
          video.setAttribute("style", "max-height: 400px; width: 100%");

          // Create a source element
          const source = document.createElement("source");
          source.setAttribute("src", url);
          source.setAttribute("type", "video/mp4");

          // Append the source to the video
          video.appendChild(source);

          // Append the video to the node
          node.appendChild(video);

          return node;
        }

        static sanitize(url) {
          return Link.sanitize(url);
        }
      }
      CoustomVideo.blotName = "video";
      CoustomVideo.className = "ql-video";
      CoustomVideo.tagName = "DIV";
      class CoustomImage extends Image {
        static create(value) {
          if (isBase64DataURI(value)) {
            uploadImage(base64ToFile(value, "my-image"));
            return;
          }
          const url = isValidUrl(value) ? value : value.url;
          if (!url) return;
          const node = super.create(url);

          const video = document.createElement("img");

          video.setAttribute("id", Math.floor(Math.random() * 299));

          // Create a source element

          video.setAttribute("src", url);

          // Append the video to the node
          node.appendChild(video);

          return node;
        }

        static sanitize(url) {
          return Link.sanitize(url);
        }
      }
      CoustomImage.blotName = "image";
      CoustomImage.className = "ql-image";
      CoustomImage.tagName = "img";

      Quill.register("formats/video", CoustomVideo);
      Quill.register("formats/video", CoustomImage);

      Quill.register("modules/imageHandler", ImageHandler);
      Quill.register("modules/videoHandler", VideoHandler);
      Quill.register("modules/attachmentHandler", AttachmentHandler);

      quill = new Quill("#" + props.editorId, {
        modules: {
          syntax: true,
          toolbar: toolbarOptions,
          imageHandler: {
            upload: async (file) => {
              try {
                const data = await fileUploader(file);
                const url = runtimeConfig.public.STORAGE_URL + data.data;
                const range = quill.getSelection();
                quill.insertEmbed(range.index, "image", {
                  url: url,
                });
                quill.setSelection(range.index + 1);
                return url;
              } catch (err) {
                console.log(err);
              }
            },
          },
          videoHandler: {
            upload: async (file) => {
              try {
                const data = await fileUploader(file);
                tempVideo.value = runtimeConfig.public.STORAGE_URL + data.data;

                const range = quill.getSelection();
                quill.insertEmbed(range.index, "video", {
                  url: tempVideo.value,
                });
                quill.setSelection(range.index + 1);
                tempVideo.value = "";
                return runtimeConfig.public.STORAGE_URL + data.data;
              } catch (err) {
                console.log(err);
              }
            },
          },
          attachmentHandler: {
            upload: async (file) => {
              try {
                const data = await fileUploader(file);
                const url = runtimeConfig.public.STORAGE_URL + data.data;
                const range = quill.getSelection();
                //  quill.insertEmbed(range.index, "link", { url: url });

                if (file.type === "application/pdf") {
                  quill.insertEmbed(range.index, "iframe", {
                    url: url,
                  });
                } else {
                  quill.insertText(range.index, file.name, "link", url);
                }
                quill.setSelection(range.index + 1);
                return runtimeConfig.public.STORAGE_URL + data.data;
              } catch (err) {
                console.log(err);
              }
            },
            accept: ".pdf,.doc,.docx,.ppt,.pptx,.xls,.xlsx",
          },
        },

        theme: "snow",
      });

      const attachmentButton = document.querySelector(".ql-attachment");
      attachmentButton.addEventListener("click", () => {
        const input = document.createElement("input");
        input.setAttribute("type", "file");
        input.setAttribute("accept", ".pdf,.doc,.docx,.ppt,.pptx,.xls,.xlsx");
        input.click();

        input.onchange = () => {
          const file = input.files[0];
          if (file) {
            // Use the AttachmentHandler to upload the file
            quill.options.modules.attachmentHandler
              ?.upload(file)
              .then((url) => {
                const range = quill.getSelection();
                // quill.clipboard.dangerouslyPasteHTML(
                //   range.index,
                //   `<a href="${url}" download="${file.name}">${file.name}</a>`
                // );
              })
              .catch((err) => console.error("File upload failed", err));
          }
        };
      });
      // Enable syntax highlighting
      quill.on("text-change", (delta, oldDelta, source) => {
        updateHandler();
        if (!setContent.value) {
          const editor = document.querySelector("#" + props.editorId);
          const images = Array.from(editor.querySelectorAll("img"));
          const videos = Array.from(editor.querySelectorAll("video source"));
          const newMedia = [...images, ...videos].map((el) =>
            el.getAttribute("src")
          );
          currentMedia = newMedia;
          currentMedia.forEach((src) => {
            if (!newMedia.includes(src)) {
              const url = src.replace(
                runtimeConfig.public.STORAGE_URL,
                "/upload/"
              );
              postStore.deleteFileAction(url);
            }
          });
        }
        quill.root.addEventListener("keydown", (event) => {
          if (event.key === "Backspace" || event.key === "Delete") {
            const range = quill.getSelection();
            if (range) {
              const [blot] = quill.getLeaf(range.index);
              if (blot && blot.domNode.tagName === "IFRAME") {
                event.preventDefault();
                quill.deleteText(range.index - 1, 2); // Adjust range if needed
              }
            }
          }
        });
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
async function uploadImage(file) {
  const data = await fileUploader(file);
  const url = runtimeConfig.public.STORAGE_URL + data.data;
  const range = quill.getSelection();
  quill.insertEmbed(range.index, "image", {
    url: url,
  });
  quill.setSelection(range.index + 1);
}
async function fileUploader(file) {
  const formData = new FormData();
  formData.append("file", file);
  return await postStore.uploadFileAction(formData);
}
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