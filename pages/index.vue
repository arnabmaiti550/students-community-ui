<template>
  <div class="content-area p-4">
    <div class="text-6xl md:text-[5rem] font-bold">
      Welcome to
      <div class="text-2xl md:text-[30px]">Student's Community</div>
    </div>
    <div
      class="mt-24 md:mt-28 text-2xl md:text-[30px] font-semibold text-gray-500"
    >
      <ol type="1" class="leading-normal">
        <li>A. Ask your questions.</li>
        <li>B. Share your knowledge with the world.</li>
        <li>C. Participate in global challenges.</li>
        <li>D. Create a test and challenge the world.</li>
      </ol>
    </div>
    <div
      class="mt-24 md:mt-28 rounded-sm border-2 border-cyan-800 bg-[#b3cce834] p-4"
    >
      <h3 class="text-xl font-bold text-cyan-700">Guidelines</h3>
      <ol type="1" class="font-semibold text-gray-500 leading-normal">
        <li>1. Be respectable.</li>
        <li>2. Use of inapproprite words is prohibited.</li>
        <li>3. Spam or promotional content is not permitted.</li>
        <li>4. AI tools generated content is not allowed.</li>
        <li>
          5. Posting sexual/explicit content will result in immediate account
          termination.
        </li>
        <li>6. Post must be related to the topic.</li>
        <li>7. Be aware of copyright.</li>
      </ol>
    </div>
    <span
      class="mt-12 mb-10 text-cyan-700 cursor-pointer font-bold inline-block"
      @click="router.push(`/privacy`)"
      >Privacy Policy >>></span
    >
  </div>
</template>
<script setup>
const router = useRouter();
const text = ref("");
const runtimeConfig = useRuntimeConfig();
const authStore = useAuthStore();
const { token, loggedIn } = storeToRefs(authStore);
function reRender() {
  if (MathJax) {
    MathJax.Hub.Queue(["Typeset", MathJax.Hub]);
  }
}

watch(text, () => {
  nextTick().then(() => {
    reRender(); // Assuming reRender is defined somewhere
  });
});
onMounted(async () => {});
</script>