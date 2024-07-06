<template>
  <div class="h-full content-area">
    <div class="bg-white p-2 rounded-xs">
      <div class="title">{{ post.title }}</div>
      <div class="relative">
        <div id="post-body" class="preview-area ql-editor"></div>
      </div>
      <div class="footer-x flex justify-between items-center">
        <div class="flex space-x-2 text-xs">
          <span class="text-[#396791] cursor-pointer flex items-center">
            <UIcon name="i-heroicons-user" />
            &nbsp;{{ post.author?.name }}</span
          >
          <span class="text-gray-400 font-light"
            >&#128949; {{ getFormattedDate(post.createdAt) }}</span
          >
        </div>

        <div class="flex space-x-3">
          <UButton
            v-if="id == post.id"
            variant="link"
            color="blue"
            icon="i-heroicons-pencil-square"
            size="md"
            @click="router.push(`/post/edit/${id}`)"
          />
          <span
            @click="likeUnlikeHandle"
            class="text-green-500/70 flex items-center text-xs"
          >
            <UIcon
              class="text-xl"
              :name="
                liked
                  ? 'i-heroicons-hand-thumb-up-solid'
                  : 'i-heroicons-hand-thumb-up'
              "
            />
            &nbsp;{{ post.likes }}
          </span>
        </div>
      </div>
    </div>
    <div class="p-4 flex justify-between text-md font-semibold items-center">
      <span class="text-xl">10 Replies</span
      ><UButton
        variant="outline"
        color="black"
        icon="i-heroicons-pencil"
        size="md"
        @click="replyToggle = !replyToggle"
        >Reply</UButton
      >
    </div>
    <ClientOnly v-if="replyToggle">
      <Editor :isPost="false" ref="editorRef"></Editor>
      <UButton
        color="black"
        icon="i-heroicons-bolt"
        variant="outline"
        @click="submitReply"
        block
        class="mx-auto w-[200px] mt-4 mb-6"
        >Reply Now</UButton
      ></ClientOnly
    >
    <div
      class="bg-white p-2 mb-4 rounded-xs b"
      v-for="(reply, i) in replies"
      :key="i"
    >
      <div class="preview-area ql-editor" v-html="reply.body"></div>
      <div class="flex space-x-3 p-2 -mx-2 -mb-2">
        <div class="text-[#396791] cursor-pointer flex items-center">
          <UIcon name="i-heroicons-user" />
          &nbsp;{{ reply.user?.name }}
        </div>
        <span class="text-green-500/70 flex items-center text-xs">
          <UIcon class="text-xl" name="i-heroicons-hand-thumb-up" />
          &nbsp;{{ post.likes }}
        </span>
      </div>
    </div>
  </div>
</template>
<script setup>
import moment from "moment";
import base64 from "base-64";
const id = ref("");
const route = useRoute();
const router = useRouter();
const postStore = usePostStore();
const { post, replies } = storeToRefs(postStore);
const htmlBody = ref();
const editorRef = ref();
const replyToggle = ref(false);
const liked = ref(false);
function getFormattedDate(date) {
  return moment(date).format("DD/MM/YYYY");
}
async function fetchPostById() {
  await postStore.getPostByIdAction(id.value);
  document.getElementById("post-body").innerHTML = post.value.body;
  liked.value = post.value.liked;
  reRender();
  await postStore.getReplyAction(id.value);
  reRender();
}
function reRender() {
  if (MathJax && MathJax.Hub) {
    setTimeout(() => {
      MathJax.Hub.Queue(["Typeset", MathJax.Hub]);
    }, 200);
  }
}
async function likeUnlikeHandle() {
  const payload = {
    type: "post",
    id: id.value,
  };
  await postStore.likeUnlikeAction(payload);

  liked.value = !liked.value;
  post.value.likes += liked.value ? 1 : -1;
}
async function submitReply() {
  try {
    editorRef.value.getEditorContent();
    const encodedContent = base64.encode(editorRef.value.editorHtml);
    const payload = {
      postId: id.value,
      body: encodedContent,
      editorData: editorRef.value.editorContent,
    };
    const resp = await postStore.addReplyAction(payload);
    console.log(resp);
  } catch (err) {}
}
onMounted(() => {
  id.value = route.params.id;
  fetchPostById();
});
</script>