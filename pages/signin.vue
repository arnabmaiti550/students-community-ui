<template>
  <SignIn />
</template>

<script setup>
import { signInWithPopup } from "firebase/auth";
import { useFirebaseAuth } from "vuefire";
import { GoogleAuthProvider } from "firebase/auth";
const googleAuthProvider = new GoogleAuthProvider();
const auth = useFirebaseAuth();
definePageMeta({
  layout: false,
});

const authStore = useAuthStore();
const { loggedIn } = storeToRefs(authStore);
const email = ref("");
const password = ref("");
const router = useRouter();
const loading = ref(false);

const invalidForm = computed(() => {
  return !(email.value.length && password.value.length);
});
async function loginFunc() {
  const payload = { email: email.value, password: password.value };

  try {
    loading.value = true;
    await authStore.loginAction(payload);
    loading.value = false;
    router.push("/");
  } catch (error) {
    loading.value = false;
    //
  }
}
async function socialSignup() {
  await signInWithPopup(auth, googleAuthProvider)
    .then(async (res) => {
      singUpHandle(res);
    })
    .catch((reason) => {
      console.error(reason);
    });
}
async function singUpHandle(res) {
  const idToken = await res.user.getIdToken();
  console.log(res);
  const payload = {
    name: res.user.displayName,
    email: res.user.email,
    userName: res.user.email.split("@")[0],
    profile: res.user.photoURL,
    accessToken: idToken,
  };
  const resp = await authStore.loginAction(payload);
  if (resp.registration) {
    router.push("/profile/edit");
  } else {
    router.push(`/redirect`);
  }
}
onMounted(() => {
  if (loggedIn.value) router.push(`/redirect`);
});
</script>

<style scoped>
/* Add any additional styles here */
</style>
