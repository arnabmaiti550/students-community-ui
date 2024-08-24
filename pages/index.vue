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

    <div class="video-container mt-8">
      <iframe
        width="100%"
        src="https://www.youtube.com/embed/iiUyK07Sq3U?&autoplay=0"
        frameborder="0"
        allowfullscreen
      ></iframe>
    </div>
    <div class="mt-8 text-xl font-bold">
      <a
        href="https://students-community.com/post/66c62646d34ada79757c8a60/student's-community-features"
        >Usage Guide >></a
      >
    </div>
    <div
      class="mt-16 md:mt-16 rounded-sm border-2 border-cyan-800 bg-[#b3cce834] p-4"
    >
      <h3 class="text-xl font-bold text-cyan-700">Guidelines</h3>
      <ol type="1" class="font-semibold text-gray-500 leading-normal">
        <li>1. Be respectable.</li>
        <li>2. Use of inapproprite words is prohibited.</li>
        <li>3. Spam or promotional content is not permitted.</li>

        <li>
          4. Posting sexual/explicit content will result in immediate account
          termination.
        </li>
        <li>5. Post must be related to the topic.</li>
        <li>6. Be aware of copyright.</li>
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
const { utf8ToHex, hexToUtf8 } = useHexEncoding();
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
<style scoped>
.video-container {
  position: relative;
  width: 100%;
  padding-bottom: 56.25%; /* 16:9 aspect ratio (9/16 = 0.5625) */
  height: 0;
  overflow: hidden;
}

.video-container iframe {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}
</style>