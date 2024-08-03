<template><div>Redirectig...</div></template>
<script setup>
const authStore = useAuthStore();
const { userInfo } = storeToRefs(authStore);
const router = useRouter();
const subjectStore = useSubjectStore();
const { topicDetails } = storeToRefs(subjectStore);
const slugify = (str) =>
  str
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
function navigateToTopic(topic) {
  const dep = slugify(topic.subject.department.name);
  const sub = slugify(topic.subject.name);
  const top = slugify(topic.name);
  const url = `${dep}+${sub}+${top}`;
  router.push(`/${url}/${topic._id}`);
}
onMounted(async () => {
  if (userInfo.value.topic) {
    await subjectStore.fetchTopicsDetailAction(userInfo.value.topic);
    navigateToTopic(topicDetails.value);
  } else {
    router.push("/");
  }
});
</script>