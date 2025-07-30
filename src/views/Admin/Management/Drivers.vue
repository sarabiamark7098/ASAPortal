<template>
  <div class="p-6">
    <FullScreenLoader :visible="loading" message="Loading Driver's..." />

    <div v-if="!loading">
      <h1 class="text-2xl font-bold mb-4">Driver's Management</h1>
      <p class="mb-4">Manage drivers directory</p>

      <div class="flex flex-col md:flex-row gap-4 md:gap-8">
        <!-- Sidebar: User Data -->
        <div class="w-full md:w-1/3">
          <div class="bg-white shadow-md rounded-lg p-4 md:p-6">
            <h2 class="text-xl font-bold mb-4">Driver Data</h2>
            <template v-if="selectedUserInfo">
              <p class="mb-2">
                First Name: {{ selectedUserInfo?.account_detail?.first_name || 'N/A' }}
              </p>
              <p class="mb-2">
                Middle Name: {{ selectedUserInfo?.account_detail?.middle_name || 'N/A' }}
              </p>
              <p class="mb-2">
                Last Name: {{ selectedUserInfo?.account_detail?.last_name || 'N/A' }}
              </p>
              <p class="mb-2">
                Extension Name: {{ selectedUserInfo?.account_detail?.extension_name || 'N/A' }}
              </p>
              <p class="mb-2">
                Position: {{ selectedUserInfo?.account_detail?.position || 'N/A' }}
              </p>
              <p class="mb-2">Email: {{ selectedUserInfo?.email || 'N/A' }}</p>
              <p class="mb-2">Username: {{ selectedUserInfo?.username || 'N/A' }}</p>
              <p class="mb-2">
                Section: {{ selectedUserInfo?.account_detail?.section?.name || 'N/A' }}
              </p>
              <p class="mb-2">Role: {{ selectedUserInfo?.role?.name || 'N/A' }}</p>
            </template>
            <p v-else class="text-gray-400 italic">Click a user row to view details.</p>
          </div>
        </div>

        <!-- Main: DataTable -->
        <div class="w-full md:flex-1 overflow-x-auto">
          <div class="bg-white shadow-md inset-shadow-sm rounded-lg p-4 md:p-6">
            <DataTable
              :value="userData"
              dataKey="id"
              paginator
              :rows="5"
              :rowsPerPageOptions="[5, 10, 20, 50]"
              :loading="loading2"
              :filters="filters"
              filterDisplay="menu"
              :globalFilterFields="[
                'account_detail.first_name',
                'account_detail.middle_name',
                'account_detail.last_name',
                'account_detail.extension_name',
              ]"
              tableStyle="min-width: 30rem"
              class="w-full"
              :emptyMessage="'No users found.'"
              :responsiveLayout="'scroll'"
              @rowClick="selectUser"
            >
              <template #header>
                <div class="flex flex-wrap gap-2 items-center justify-between">
                  <h4 class="m-0">Manage Driver's</h4>
                  <IconField>
                    <InputIcon>
                      <i class="pi pi-search" />
                    </InputIcon>
                    <InputText v-model="filters['global'].value" placeholder="Search..." />
                  </IconField>
                </div>
              </template>

              <Column field="account_detail.first_name" header="First Name" />
              <Column field="account_detail.middle_name" header="Middle Name" />
              <Column field="account_detail.last_name" header="Last Name" />
              <Column field="account_detail.extension_name" header="Extension Name" />

              <Column header="Actions" bodyStyle="text-align: center; min-width: 80px;">
                <template #body="slotProps">
                  <button
                    class="border border-blue-500 text-blue-500 p-2 rounded hover:bg-blue-500 hover:text-white transition"
                    @click.stop="editUser(slotProps.data)"
                    title="Edit"
                    aria-label="Edit user"
                  >
                    <i class="pi pi-pencil" style="font-size: 1rem" />
                  </button>
                </template>
              </Column>
            </DataTable>
          </div>
        </div>
      </div>

      <!-- Edit Dialog -->
      <Dialog
        v-model:visible="showEditDialog"
        header="Edit User"
        modal
        :closable="true"
        :closeOnEscape="true"
        class="w-[90vw] md:w-[30rem]"
      >
        <form @submit.prevent="saveUser" class="p-4 space-y-4">
          <FloatLabel variant="on">
            <InputText
              id="first"
              v-model="editedUser.account_detail.first_name"
              class="w-full"
              required
              autocomplete="given-name"
            />
            <label for="first">First Name</label>
          </FloatLabel>

          <FloatLabel variant="on">
            <InputText
              id="middle"
              v-model="editedUser.account_detail.middle_name"
              class="w-full"
              autocomplete="additional-name"
            />
            <label for="middle">Middle Name</label>
          </FloatLabel>

          <FloatLabel variant="on">
            <InputText
              id="last"
              v-model="editedUser.account_detail.last_name"
              class="w-full"
              required
              autocomplete="family-name"
            />
            <label for="last">Last Name</label>
          </FloatLabel>

          <FloatLabel variant="on">
            <InputText
              id="email"
              v-model="editedUser.email"
              type="email"
              class="w-full"
              required
              autocomplete="email"
            />
            <label for="email">Email</label>
          </FloatLabel>

          <!-- Add more editable fields as needed -->

          <div class="flex justify-end gap-2 mt-4">
            <button
              type="button"
              @click="showEditDialog = false"
              class="bg-gray-300 px-4 py-2 rounded"
            >
              Cancel
            </button>
            <button
              type="submit"
              :disabled="saving"
              class="bg-blue-500 text-white px-4 py-2 rounded"
            >
              {{ saving ? 'Saving...' : 'Save' }}
            </button>
          </div>
        </form>
      </Dialog>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import Dialog from 'primevue/dialog'
import InputText from 'primevue/inputtext'
import FloatLabel from 'primevue/floatlabel'
import FullScreenLoader from '@/components/FullScreenLoader.vue'
import { useUsersStore } from '@/stores/users'
import { useAuthStore } from '@/stores/auth'

const auth = useAuthStore()
const users = useUsersStore()
const loading = ref(true)
const loading2 = ref(true)
const userData = ref([])

const selectedUser = ref(null)
const showEditDialog = ref(false)
const editedUser = ref({})

const selectedUserInfo = ref(null)

const filters = ref({
  global: { value: '', matchMode: 'contains' }, 
})

const selectUser = (event) => {
  selectedUserInfo.value = event.data
}

const fetchUsersData = async () => {
  loading2.value = true
  try {
    await users.fetchAllUsers()
    userData.value = users.userList
  } catch (error) {
    console.error('Error fetching user data:', error)
  } finally {
    loading2.value = false
  }
}

const editUser = (user) => {
  selectedUser.value = user
  // Deep copy to avoid mutating the table data directly
  editedUser.value = JSON.parse(JSON.stringify(user))
  showEditDialog.value = true
}

const saving = ref(false)

const saveUser = async () => {
  saving.value = true
  try {
    await users.updateUser(selectedUser.value.id, editedUser.value)
    showEditDialog.value = false
    await fetchUsersData()
    // Update sidebar details if the edited user is currently selected
    if (selectedUserInfo.value?.id === selectedUser.value.id) {
      selectedUserInfo.value = JSON.parse(JSON.stringify(editedUser.value))
    }
  } catch (err) {
    console.error('Failed to update user:', err)
  } finally {
    saving.value = false
  }
}
onMounted(async () => {
  try {
    // Simulate API delay and fetch user data
    await Promise.all([auth.fetchUser(), new Promise((resolve) => setTimeout(resolve, 1500))])
    fetchUsersData()
  } catch (error) {
    console.error('Error fetching dashboard data:', error)
  } finally {
    loading.value = false
  }
})
</script>

<style scoped></style>
