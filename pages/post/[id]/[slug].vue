<template>
  <div class="h-full content-area">
    <div class="bg-white p-2 rounded-xs">
      <div class="title">{{ post.title }}</div>
      <div class="relative">
        <div id="post-body" class="preview-area ql-editor"></div>
      </div>
      <div class="footer-x flex justify-between items-center">
        <div class="flex space-x-2 text-xs flex items-center">
          <span
            class="text-[#396791] cursor-pointer flex items-center"
            @click="router.push(`/profile/${post.author?._id}`)"
          >
            <UAvatar
              size="xs"
              icon="i-heroicons-user-circle"
              :src="post.author?.profile"
            />
            &nbsp;{{ post.author?.name }}</span
          >
          <span class="text-gray-400 font-light">{{ post.createdAt }}</span>
        </div>

        <div class="flex space-x-3">
          <UButton
            v-if="userInfo._id == post.author?._id"
            variant="link"
            color="blue"
            icon="i-heroicons-pencil-square"
            size="md"
            @click="router.push(`/post/edit/${id}`)"
          />
          <UButton
            v-if="userInfo._id == post.author?._id"
            icon="i-heroicons-trash"
            size="sm"
            color="white"
            class="text-red-500"
            variant="link"
            @click.stop="confirmationPopup2 = true"
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
    <div
      class="p-4 flex justify-between text-md font-semibold items-center"
      id="reply-sec"
    >
      <span class="text-xl">{{ replies?.length }} Replies</span
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
        :loading="loading"
        block
        class="mx-auto w-[200px] mt-4 mb-6"
        >{{ editId ? "Update Reply" : "Reply Now" }}</UButton
      ></ClientOnly
    >
    <div class="bg-white p-4 pt-2" v-for="(reply, i) in replies" :key="i">
      <div class="border-b">
        <div class="preview-area ql-editor" v-html="reply.body"></div>
        <div class="flex space-x-3 p-2 mb-4 text-sm">
          <div class="text-[#396791] cursor-pointer flex items-center">
            <UAvatar
              size="xs"
              icon="i-heroicons-user-circle"
              :src="reply.user?.profile"
            />
            &nbsp;{{ reply.user?.name }}
          </div>
          <span class="flex items-center text-gray-500">
            {{ reply.createdAt }}</span
          >

          <span
            @click="likeUnlikeHandleReply(reply._id, i)"
            class="text-green-500/70 flex items-center text-xs"
          >
            <UIcon
              class="text-xl"
              :name="
                reply.liked
                  ? 'i-heroicons-hand-thumb-up-solid'
                  : 'i-heroicons-hand-thumb-up'
              "
            />
            &nbsp;{{ reply.likes }}
          </span>

          <UButton
            v-if="userInfo._id == reply.user?._id"
            variant="link"
            color="blue"
            icon="i-heroicons-pencil-square"
            size="md"
            @click="setEditReply(reply)"
          />

          <UButton
            v-if="userInfo._id == reply.user?._id"
            icon="i-heroicons-trash"
            size="sm"
            color="white"
            class="text-red-500"
            variant="link"
            @click.stop="
              delId = reply._id;
              confirmationPopup = true;
            "
          />
        </div>
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
              WARNING
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
          Are you sure you want to delete?
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
                @click="deleteReply"
                label="Delete"
              />
            </div>
          </div>
        </ULandingCard>
      </UCard>
    </UModal>
    <UModal v-model="confirmationPopup2" prevent-close :ui="{ width: 'sm' }">
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
              WARNING
            </h3>
            <UButton
              color="red"
              variant="ghost"
              icon="i-heroicons-x-mark-20-solid"
              class="-my-1"
              @click="confirmationPopup2 = false"
            />
          </div>
        </template>

        <ULandingCard class="mb-4">
          Are you sure you want to delete?
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
                @click="deletePost"
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
import moment from "moment";
import base64 from "base-64";
const id = ref("");
const { $toast } = useNuxtApp();
const loading = ref(false);
const route = useRoute();
const router = useRouter();
const postStore = usePostStore();
const authStore = useAuthStore();
const { post, replies } = storeToRefs(postStore);
const { userInfo } = storeToRefs(authStore);
const htmlBody = ref();
const editorRef = ref();
const editId = ref();
const delId = ref();
const replyToggle = ref(false);
const confirmationPopup = ref(false);
const confirmationPopup2 = ref(false);
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
  try {
    await postStore.likeUnlikeAction(payload);

    liked.value = !liked.value;
    post.value.likes += liked.value ? 1 : -1;
  } catch (err) {
    $toast.error(err.message);
  }
}
async function likeUnlikeHandleReply(id, i) {
  const payload = {
    type: "reply",
    id: id,
  };
  try {
    await postStore.likeUnlikeAction(payload);

    replies.value[i].liked = !replies.value[i].liked;
    replies.value[i].likes += replies.value[i].liked ? 1 : -1;
  } catch (err) {
    $toast.error(err.message);
  }
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
    loading.value = true;
    if (!editId.value) await postStore.addReplyAction(payload);
    else postStore.editReplyAction({ id: editId.value, data: payload });
    editId.value = "";
    await postStore.getReplyAction(id.value);
    editorRef.value.setEditorContent({});
    reRender();
    replyToggle.value = false;
  } catch (err) {
    $toast.error(err.message);
  }
  loading.value = false;
}
async function deleteReply() {
  try {
    await postStore.deleteReplyAction(delId.value);
    await postStore.getReplyAction(id.value);
    confirmationPopup.value = false;
    reRender();
  } catch (err) {
    $toast.error(err.message);
  }
}

async function deletePost() {
  try {
    await postStore.deletePostAction(id.value);
    confirmationPopup2.value = false;
    history.back();
    reRender();
  } catch (err) {
    $toast.error(err.message);
  }
}
function setEditReply(reply) {
  replyToggle.value = true;
  setTimeout(() => {
    editId.value = reply._id;
    editorRef.value.setEditorContent(reply.editorData);
    const element = document.getElementById("reply-sec");
    element.scrollIntoView({ behavior: "smooth" });
  }, 200);
}
onMounted(() => {
  id.value = route.params.id;
  fetchPostById();
});
</script>