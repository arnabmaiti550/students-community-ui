<template>
  <UModal v-model="loginPopup" prevent-close :ui="{ width: 'sm' }">
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
            Sign In
          </h3>
          <UButton
            color="red"
            variant="ghost"
            icon="i-heroicons-x-mark-20-solid"
            class="-my-1"
            @click="goBack()"
          />
        </div>
      </template>

      <div class="mb-4 text-center">
        You need to sign in to use the app fully.
      </div>
      <div class="text-center">
        <span
          @click="router.push(`/privacy`)"
          class="text-cyan-700 cursor-pointer font-bold inline-block text-sm right-4"
        >
          Read Privacy Policy
        </span>
      </div>

      <template #footer>
        <ULandingCard>
          <ClientOnly>
            <UButton
              @click="socialSignup"
              label="Login with Google"
              color="white"
              size="xl"
              block
            >
              <template #leading>
                <svg
                  version="1.1"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 48 48"
                  xmlns:xlink="http://www.w3.org/1999/xlink"
                  style="display: inline-block; width: 16px"
                >
                  <path
                    fill="#EA4335"
                    d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"
                  ></path>
                  <path
                    fill="#4285F4"
                    d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"
                  ></path>
                  <path
                    fill="#FBBC05"
                    d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"
                  ></path>
                  <path
                    fill="#34A853"
                    d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"
                  ></path>
                  <path fill="none" d="M0 0h48v48H0z"></path>
                </svg>
              </template>
            </UButton>
          </ClientOnly>
        </ULandingCard>
      </template>
    </UCard>
  </UModal>
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
const loginPopup = ref(false);
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
function goBack() {
  history.back();
}
async function socialSignup() {
  loading.value = true;
  await signInWithPopup(auth, googleAuthProvider)
    .then(async (res) => {
      singUpHandle(res);
    })
    .catch((reason) => {
      console.error(reason);
      loading.value = false;
    });
}
async function singUpHandle(res) {
  const idToken = await res.user.getIdToken();

  const payload = {
    name: res.user.displayName,
    email: res.user.email,
    userName: res.user.email.split("@")[0],
    profile: res.user.photoURL,
    accessToken: idToken,
  };
  const resp = await authStore.loginAction(payload);
  if (resp.registration) {
    console.log("Registration");
    router.push("/profile/edit");
  } else {
    loginPopup.value = false;
  }
}
onMounted(() => {
  if (!loggedIn.value) loginPopup.value = true;
});
</script>

<style scoped>
/* Add any additional styles here */
</style>
