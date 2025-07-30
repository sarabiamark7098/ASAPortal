<template>
  <div class="app-layout flex flex-col min-h-screen">
    <!-- Logout Loading Overlay -->
    <div
      v-if="logoutLoading"
      class="fixed inset-0 bg-white bg-opacity-75 flex items-center justify-center z-50"
    >
      <svg
        class="animate-spin h-10 w-10 text-blue-600"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
      >
        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
      </svg>
      <p class="ml-4 text-gray-700 font-medium">Logging out...</p>
    </div>

    <!-- Header / Top Navbar -->
    <header class="bg-white shadow-md flex items-center justify-between px-4 py-2 z-10">
      <div class="flex items-center gap-4">
        <Button
          icon="pi pi-bars"
          class="p-button-rounded p-button-text"
          @click="collapsed = !collapsed"
          :aria-label="collapsed ? 'Expand Sidebar' : 'Collapse Sidebar'"
        />
        <a
          href="https://fo11.dswd.gov.ph"
          target="_blank"
          rel="noopener noreferrer"
          class="flex items-center gap-2"
        >
          <img
            src="/src/assets/BP.png"
            alt="DSWD Logo"
            class="max-h-8 transition-opacity duration-300"
          />
          <span class="text-xl font-bold text-gray-800">ASAPortal</span>
        </a>
      </div>

      <div class="flex items-center gap-4">
        <span class="text-gray-700 text-sm hidden md:inline">
          Welcome{{ auth.userEmail ? ', ' + auth.userEmail : '' }}
        </span>
        <button
          class="text-gray-600 hover:text-blue-600 focus:outline-none"
          @click="handleLogout"
          aria-label="Logout"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="1.5"
            stroke="currentColor"
            class="h-6 w-6"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M8.25 9V5.25A2.25 2.25 0 0 1 10.5 3h6a2.25 2.25 0 0 1 2.25 2.25v13.5A2.25 2.25 0 0 1 16.5 21h-6a2.25 2.25 0 0 1-2.25-2.25V15m-3 0-3-3m0 0 3-3m-3 3H15"
            />
          </svg>
        </button>
      </div>
    </header>

    <!-- Layout with collapsible Sidebar + Main Content -->
    <div class="flex flex-1 min-h-0 overflow-hidden">
      <!-- Sidebar -->
      <aside
        :class="['sidebar', { collapsed }]"
        role="navigation"
        aria-label="Main Navigation"
        class="z-50"
      >
        <div class="sidebar-header flex items-center justify-between px-4 py-3">
          <span class="inline-flex items-center justify-center gap-2 w-full">
            <Transition name="fade" mode="out-in">
              <img
                :src="delayedCollapsed ? logoIcon : logoFull"
                alt="DSWD Logo"
                class="max-h-16 transition-opacity duration-300"
              />
            </Transition>
          </span>
          <Button
            icon="pi pi-angle-left"
            class="p-button-rounded p-button-text"
            @click="collapsed = true"
            v-if="!collapsed"
            aria-label="Collapse Sidebar"
          />
          <Button
            icon="pi pi-angle-right"
            class="p-button-rounded p-button-text"
            @click="collapsed = false"
            v-if="collapsed"
            aria-label="Expand Sidebar"
          />
        </div>

        <nav class="flex-grow overflow-y-auto px-3 py-2">
          <ul class="list-none m-0 p-0 space-y-1">
            <li v-for="(item, index) in menuItems" :key="index">
              <template v-if="!item.children">
                <RouterLink
                  :to="item.to"
                  class="flex items-center gap-2 p-3 rounded hover:bg-[#e0e4ff] transition"
                  active-class="router-link-active"
                  exact-active-class="router-link-exact-active"
                >
                  <i :class="item.icon"></i>
                  <span v-if="!collapsed">{{ item.label }}</span>
                </RouterLink>
              </template>

              <template v-else>
                <button
                  type="button"
                  @click="toggleSubmenu(item.submenuKey)"
                  class="flex items-center justify-between w-full gap-2 p-3 rounded hover:bg-[#e0e4ff] transition"
                  :aria-expanded="menus[item.submenuKey].toString()"
                  :aria-controls="`submenu-${item.submenuKey}`"
                >
                  <span class="flex items-center gap-2">
                    <i :class="item.icon"></i>
                    <span v-if="!collapsed">{{ item.label }}</span>
                  </span>
                  <i
                    v-if="!collapsed"
                    :class="[
                      'pi',
                      menus[item.submenuKey] ? 'pi-angle-down' : 'pi-angle-right',
                      'transition-transform duration-200',
                    ]"
                  ></i>
                </button>
                <ul
                  v-show="menus[item.submenuKey] && !collapsed"
                  :id="`submenu-${item.submenuKey}`"
                  class="list-none pl-8 mt-1 space-y-1"
                >
                  <li v-for="(subItem, subIndex) in item.children" :key="subIndex">
                    <RouterLink
                      :to="subItem.to"
                      class="block p-2 rounded hover:bg-[#e0e4ff] transition"
                      active-class="router-link-active"
                      exact-active-class="router-link-exact-active"
                    >
                      {{ subItem.label }}
                    </RouterLink>
                  </li>
                </ul>
              </template>
            </li>
          </ul>
        </nav>
      </aside>

      <!-- Main content area -->
      <main class="flex-1 p-6 overflow-auto">
        <!-- Replace with your actual routed content or slot -->
        <slot />
      </main>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, watch, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import logoFull from '@/assets/DSWD Field Office XI.png'
import logoIcon from '@/assets/DSWD_Only.png'
import { RouterLink } from 'vue-router'
import Button from 'primevue/button'

const auth = useAuthStore()
const logoutLoading = ref(false)
const collapsed = ref(false)
const delayedCollapsed = ref(false)

watch(collapsed, (newVal) => {
  if (newVal) {
    setTimeout(() => {
      delayedCollapsed.value = true
    }, 300)
  } else {
    delayedCollapsed.value = false
  }
})

const menus = reactive({
  manageMenuOpen: false,
  requestsMenuOpen: false,
  reportsMenuOpen: false,
})

function toggleSubmenu(key) {
  menus[key] = !menus[key]
}

const menuItems = [
  {
    label: 'Dashboard',
    icon: 'pi pi-home',
    to: '/dashboard',
  },
  {
    label: 'User Accounts',
    icon: 'pi pi-users',
    to: '/useraccounts',
  },
  {
    label: 'Management',
    icon: 'pi pi-cog',
    submenuKey: 'manageMenuOpen',
    children: [
      { label: "Driver's", to: '/manage/drivers' },
      { label: 'Vehicles', to: '/manage/vehicles' },
    ],
  },
  {
    label: 'Requests',
    icon: 'pi pi-ticket',
    submenuKey: 'requestsMenuOpen',
    children: [
      { label: 'TA Management', to: '/request/ta' },
      { label: 'Vehicle', to: '/request/vehicle' },
      { label: 'Maagap Conference Room', to: '/request/maagap' },
      { label: 'Magiting Conference Room', to: '/request/magiting' },
      { label: 'Seminar Hall', to: '/request/seminar' },
      { label: 'Air Travel Orders', to: '/request/ato' },
      { label: 'Entry To DSWD Premises', to: '/request/entry' },
      { label: 'Overnight Parking', to: '/request/parking' },
      { label: 'Janitorial', to: '/request/janitorial' },
    ],
  },
  {
    label: 'Go to Client View',
    icon: 'pi pi-external-link',
    to: '/client',
  },
  {
    label: 'Reports',
    icon: 'pi pi-chart-bar',
    submenuKey: 'reportsMenuOpen',
    children: [
      { label: 'Export', to: '/reports/requests' },
      { label: 'Summary', to: '/reports/summary' },
    ],
  },
]

const route = useRoute()

function autoOpenSubmenus(currentPath) {
  menuItems.forEach((item) => {
    if (item.children && item.submenuKey) {
      const match = item.children.some((sub) => currentPath.startsWith(sub.to))
      menus[item.submenuKey] = match
    }
  })
}

onMounted(() => {
  autoOpenSubmenus(route.path)
})

watch(
  () => route.path,
  (newPath) => {
    autoOpenSubmenus(newPath)
  },
)

const handleLogout = async () => {
  logoutLoading.value = true
  try {
    await auth.logout()
  } catch (error) {
    console.error('Logout error:', error)
    alert('Logout failed. Please try again.')
  } finally {
    logoutLoading.value = false
  }
}
</script>

<style scoped>
.app-layout {
  height: 100vh;
}

.flex-1 {
  flex: 1 1 0%;
}

header {
  height: 56px;
}

/* Sidebar */
.sidebar {
  width: 280px;
  border-right: 1px solid #ddd;
  background: white;
  display: flex;
  flex-direction: column;
  transition: width 0.3s ease;
  overflow: hidden;
  box-shadow: 2px 0 5px rgb(0 0 0 / 0.05);
  /* make sidebar fill full height except header */
  height: calc(100vh - 56px);
}

.sidebar.collapsed {
  width: 64px;
}

/* Sidebar links */
.sidebar nav ul li a {
  display: flex;
  align-items: center;
  color: #333;
  text-decoration: none;
}

.sidebar nav ul li a i {
  font-size: 1.25rem;
}

/* Main content */
main {
  overflow-y: auto;
  height: calc(100vh - 56px);
  transition: margin-left 0.3s ease;
}
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
.sidebar nav ul li a.router-link-exact-active {
  background-color: #e0e4ff; /* light background for contrast */
  color: #283192;
  font-weight: 600;
  border-left: 4px solid #283192;
}
</style>
