import { createSharedComposable } from '@vueuse/core'

const _useDashboard = () => {
  const route = useRoute()
  const router = useRouter()
  const isHelpSlideoverOpen = ref(false)
  const isNotificationsSlideoverOpen = ref(false)

  defineShortcuts({
    'g-d': () => router.push('/dashboard'),
    'g-c': () => router.push('/content/videos'),
    'g-a': () => router.push('/advertisement'),
    'g-t': () => router.push('/teamStats'),
    'g-n': () => router.push('/notification'),
    'g-u': () => router.push('/userManagement'),
    'g-r': () => router.push('/userReport'),
    '?': () => isHelpSlideoverOpen.value = true,
    'n': () => isNotificationsSlideoverOpen.value = true
  })

  watch(() => route.fullPath, () => {
    isHelpSlideoverOpen.value = false
    isNotificationsSlideoverOpen.value = false
  })

  return {
    isHelpSlideoverOpen,
    isNotificationsSlideoverOpen
  }
}

export const useDashboard = createSharedComposable(_useDashboard)
