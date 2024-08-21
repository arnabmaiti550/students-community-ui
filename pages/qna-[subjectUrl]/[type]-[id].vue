<template>
  <div class="content-area -mt-2">
    <UBreadcrumb :links="links" class="text-blue-500 mb-2 mt-2" />
    <div class="flex flex-col space-y-4">
      <div class="bg-white p-4 rounded-sm flex space-x-2">
        <UInput
          icon="i-heroicons-magnifying-glass-20-solid"
          size="lg"
          color="white"
          class="w-4/6 sm:w-4/5 rounded-full"
          :trailing="false"
          v-model="search"
          @input="debouncedSearch"
          placeholder="Search..."
        />
        <USelect
          v-model="filter"
          size="lg"
          class="w-2/6 sm:w-1/5"
          :options="filterOptions"
        />
      </div>
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
            class="preview-area ql-editor h-32 overflow-visible"
            :key="text"
            v-html="post.body"
          ></div>
          <div
            class="absolute bottom-0 h-1/6 p-4 w-full bg-gradient-to-t to-transparent from-white"
          ></div>
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
              &nbsp;{{ post.author.name }}</span
            >
            <span class="text-gray-400 font-light">{{ post.createdAt }}</span>
          </div>

          <div class="flex space-x-3">
            <span class="text-green-500/70 flex items-center text-xs">
              <UIcon class="text-xl" name="i-heroicons-hand-thumb-up" />
              &nbsp;{{ post.likes }}
            </span>

            <span class="text-cyan-400 flex items-center text-xs">
              <UIcon
                class="text-xl"
                name="i-heroicons-chat-bubble-oval-left-ellipsis"
              />
              &nbsp;{{ post.replies }}
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
import moment from "moment";
import { debounce } from "lodash";
const ruote = useRoute();
const router = useRouter();
const text = ref("");
const load = ref(1);
const filter = ref("newest");
const filterOptions = [
  { label: "Newest", value: "newest" },
  { label: "Oldest", value: "oldest" },
  { label: "Most Popular", value: "most_popular" },
];
const pageIndex = ref(1);
const type = ref();
const types = ["QNA", "Discussion"];
const runtimeConfig = useRuntimeConfig();
const postStore = usePostStore();
const { posts } = storeToRefs(postStore);
const topic = ref("");
const search = ref("");
const debouncedSearch = ref();
let observer;

const links = computed(() => {
  return makeTitle(ruote.params.subjectUrl)
    .split("+")
    .map((el) => ({ label: el.charAt(0).toUpperCase() + el.slice(1) }));
});
function makeTitle(slug) {
  var words = slug.split("-");

  for (var i = 0; i < words.length; i++) {
    var word = words[i];
    words[i] = word.charAt(0).toUpperCase() + word.slice(1);
  }

  return words.join(" ");
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
async function getPostsList(reload) {
  const payload = {
    search: search.value,
    sort: filter.value,
    limit: 10,
    page: pageIndex.value,
  };
  if (ruote.params.type == "subject") payload.subject = topic.value;
  else payload.department = topic.value;
  try {
    await postStore.fetchQnaAction(payload, reload);
    reRender();

    const item = document.getElementById(`post-${pageIndex.value * 10 - 1}`);
    console.log(item);
    if (item) {
      observer.observe(item);
    }
    const pastItem = document.getElementById(
      `post-${(pageIndex.value - 1) * 10 - 1}`
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
watch(filter, searchFilter);
function searchFilter() {
  pageIndex.value = 1;
  getPostsList(true);
}
onMounted(() => {
  observer = new IntersectionObserver((entry) => {
    if (entry[0].isIntersecting) {
      pageIndex.value += 1;
      getPostsList();
    }
  }, observerOptions);
  topic.value = ruote.params.id;
  getPostsList(true);
  debouncedSearch.value = debounce(searchFilter, 600);
});
</script>
<style lang="scss" scoped>
.question-card {
  transition: all 0.2s;
  &:hover {
    transform: scale(0.99);
  }

  .ql-editor > * {
    cursor: pointer !important;
  }
}
.ql-editor {
  height: none;
}
</style>