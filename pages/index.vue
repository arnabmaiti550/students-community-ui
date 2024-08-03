<template>
  <div class="content-area">
    <div class="bg-white font-light">
      Hellos A circular loop of wire of 10 turns with a radius of 10^(-3) m^2
      rotates at a constant angular speed 3 rad/s, in a uniform magnetic field
      of \(a^2+b^2\) T. Suppose the direction of magnetic field is outside the
      page of the paper, and the loop stays parallel to the plane of the paper
      initially. $$x+2y=47$$
      <div :key="text" v-html="text"></div>
    </div>

    <!-- <div>
      <ins
        class="adsbygoogle h-[200px]"
        style="display: block"
        :data-ad-client="runtimeConfig.public.GOOGLE_ADSENSE_ID"
        data-ad-slot="7081424142"
        data-ad-format="auto"
        data-adtest="on"
        data-full-width-responsive="true"
      ></ins>
    </div> -->
    <Editor
      :is-post="true"
      title="This is a test title. Can you reply?"
    ></Editor>
  </div>
</template>
<script setup>
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
onMounted(async () => {
  try {
    await authStore.getUserInfo();
    if (loggedIn.value) router.push("/redirect");
  } catch (err) {}
});
</script>