<template>
  <header class="header">
    <div class="sidebar-toggler break-point-lg mr-2">
      <UButton
        icon="i-heroicons-bars-3"
        size="sm"
        color="white"
        square
        variant="solid"
        @click="setToggled()"
      />
    </div>
    <span class="main-title cursor-pointer" @click="router.push(`/redirect`)">
      Student's Community</span
    >
    <div class="flex space-x-3 ml-auto">
      <UTooltip
        class="hidden sm:block"
        text="Create Post"
        :popper="{ arrow: true }"
      >
        <UButton
          icon="i-heroicons-plus"
          size="sm"
          color="white"
          class="text-cyan-400"
          variant="solid"
          @click="router.push(`/post/create`)"
      /></UTooltip>
      <UTooltip text="Test Zone" :popper="{ arrow: true }">
        <UButton
          icon="i-heroicons-clipboard-document-check"
          size="sm"
          color="gray"
          class="text-blue-400"
          square
          @click="router.push(`/test/`)"
          variant="solid"
      /></UTooltip>

      <UTooltip text="Notification" :popper="{ arrow: true }">
        <UButton
          icon="i-heroicons-bell"
          size="sm"
          color="gray"
          class="text-teal-500"
          square
          variant="solid"
      /></UTooltip>
      <UDropdown class="float-right text-black" :items="items">
        <UAvatar icon="i-heroicons-user-circle" :src="userInfo.profile" />

        <template #account="{ item }">
          <div class="text-left">
            <p>Signed in as</p>
            <p class="truncate font-medium text-gray-900">
              {{ item.label }}
            </p>
          </div>
        </template>

        <template #item="{ item }">
          <span class="truncate">{{ item.label }}</span>

          <UIcon
            :name="item.icon"
            class="flex-shrink-0 h-4 w-4 text-gray-400 ms-auto"
          />
        </template>
      </UDropdown>
    </div>
  </header>
</template>
<script>
export default {
  name: "Default",
  data: () => ({
    collapsed: false,
    toggled: false,
    rtl: false,
  }),
  computed: {
    departments() {
      return departmentTree.value;
    },
  },
  methods: {
    setCollapsed() {
      this.collapsed = !this.collapsed;
    },
    setToggled() {
      this.$emit("toggle");
      this.toggled = !this.toggled;
    },
    setRTL() {
      this.rtl = !this.rtl;
    },
  },
};
</script>
<script setup>
import { storeToRefs } from "pinia";
const runtimeConfig = useRuntimeConfig();
const authStore = useAuthStore();
const { token, loggedIn, userInfo } = storeToRefs(authStore);
const router = useRouter();
const loginItems = [
  [
    {
      label: userInfo.value.email,
      slot: "account",
      disabled: true,
    },
  ],
  [
    {
      label: "Profile",
      icon: "i-heroicons-cog-8-tooth",
    },
  ],
  [
    {
      label: "Sign out",
      icon: "i-heroicons-arrow-left-on-rectangle",
      click: async () => {
        await authStore.logoutAction();
        authStore.$reset();
        location.reload();
      },
    },
  ],
];
const logoutItems = [
  [
    {
      label: "Sign In",
      icon: "i-heroicons-user-plus",
      click: () => {
        router.push(`/signin`);
      },
    },
  ],
];

const items = computed(() => {
  if (loggedIn.value) return [...loginItems];
  else return [...logoutItems];
});
onMounted(() => {
  localStorage.setItem("nuxt-color-mode", "light");
});
</script>