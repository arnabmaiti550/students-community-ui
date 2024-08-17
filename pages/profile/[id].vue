<template>
  <div>
    <div class="flex flex-col md:flex-row space-x-4">
      <div class="md:w-2/5 font-semibold text-gray-600">
        <div class="bg-white p-4 overflow-x pb-6">
          <div class="h-12">
            <UButton
              icon="i-heroicons-pencil-square"
              size="sm"
              color="white"
              class="text-gray-600 float-right"
              variant="solid"
              @click="router.push(`/profile/edit`)"
              v-if="userById._id == userInfo._id"
            />
          </div>
          <div class="text-center">
            <UAvatar
              size="xl"
              icon="i-heroicons-user-circle"
              :src="userById.profile"
            /><br />
            {{ userById.name }}<br />
            @{{ userById.userName }}<br />
            XP {{ userById.xp }}<br /><br />
            About
            <div
              class="whitespace-pre-wrap font-normal text-gray-500 text-sm text-left border p-4 border-gray-300 rounded-md m-4 mt-2"
            >
              {{ userById.about }}
            </div>
          </div>
        </div>
      </div>
      <div class="p-4 overflow-x pb-6 md:w-3/5">
        <h2 class="text-xl font-bold">Posts</h2>
        <div class="post-container grid lg:grid-cols-2 gap-3">
          <div
            class="bg-white question-card p-4 rounded-sm cursor-pointer hover:shadow-xl hover:outline-2 outline-blue-300 hover:outline"
            v-for="(post, i) in posts"
            :key="i"
            @click="router.push(`/post/${post.id}/${post.slug || 'no-slug'}`)"
          >
            <div class="title">{{ post.title }}</div>
            <div class="relative overflow-hidden">
              <div
                :id="`post-${i + 1}`"
                class="preview-area ql-editor h-44 overflow-visible"
                :key="text"
                v-html="post.body"
              ></div>
              <div
                class="absolute bottom-0 h-1/6 p-4 w-full bg-gradient-to-t to-transparent from-white"
              ></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
definePageMeta({
  layout: "no-sidebar",
});
const postStore = usePostStore();
const { posts } = storeToRefs(postStore);
const authStore = useAuthStore();
const { token, loggedIn, userById, userInfo } = storeToRefs(authStore);
const router = useRouter();
const route = useRoute();
const pageIndex = ref(1);
let observer;

function reRender() {
  if (MathJax && MathJax.Hub) {
    setTimeout(() => {
      MathJax.Hub.Queue(["Typeset", MathJax.Hub]);
    }, 200);
  } else {
    console.log("error");
  }
}
async function getPostsList(reload) {
  const payload = {
    search: "",
    user: route.params.id,
    limit: 20,
    page: pageIndex.value,
  };
  try {
    await postStore.fetchPostsAction(payload, reload);
    reRender();

    const item = document.getElementById(`post-${pageIndex.value * 20 - 1}`);
    console.log(item);
    if (item) {
      observer.observe(item);
    }
    const pastItem = document.getElementById(
      `post-${(pageIndex.value - 1) * 20 - 1}`
    );
    if (pastItem) observer.unobserve(pastItem);
  } catch (err) {}
}
function getFormattedDate(date) {
  return moment(date).format("DD/MM/YYYY");
}

const observerOptions = {
  root: null, // default is the viewport
  rootMargin: "0px",
  threshold: 0.1, // 10% of the element must be visible
};
onMounted(() => {
  observer = new IntersectionObserver((entry) => {
    if (entry[0].isIntersecting) {
      pageIndex.value += 1;
      getPostsList();
    }
  }, observerOptions);

  getPostsList(true);
  authStore.getUserInfoById(route.params.id);
});
</script>
<style scoped>
</style>