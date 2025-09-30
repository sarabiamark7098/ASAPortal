<template>
  <div class="p-6">
    <FullScreenLoader :visible="loading" message="Loading Users..." />

    <div v-if="!loading">
      <h1 class="text-2xl font-bold mb-4">User Accounts</h1>
      <p class="mb-4">Manage user accounts and permissions.</p>

      <div class="flex flex-col md:flex-row gap-4 md:gap-8">
        <!-- Sidebar: User Data -->
        <div class="w-full md:w-1/3">
          <div class="bg-white shadow-md rounded-lg py-4 md:py-6 inset-shadow-sm">
            <h2 class="font-bold mb-4 px-5">User Account Details</h2>

            <dl class="space-y-2 px-5 py-2">
              <div class="flex justify-between border-b border-gray-400 py-1">
                <dt class="font-semibold">First Name:</dt>
                <dd class="text-green-600">
                  {{ selectedUserInfo?.account_detail?.first_name || 'N/A' }}
                </dd>
              </div>

              <div class="flex justify-between border-b border-gray-400 py-1">
                <dt class="font-semibold">Middle Name:</dt>
                <dd class="text-green-600">
                  {{ selectedUserInfo?.account_detail?.middle_name || 'N/A' }}
                </dd>
              </div>

              <div class="flex justify-between border-b border-gray-400 py-1">
                <dt class="font-semibold">Last Name:</dt>
                <dd class="text-green-600">
                  {{ selectedUserInfo?.account_detail?.last_name || 'N/A' }}
                </dd>
              </div>

              <div class="flex justify-between border-b border-gray-400 py-1">
                <dt class="font-semibold">Extension Name:</dt>
                <dd class="text-green-600">
                  {{ selectedUserInfo?.account_detail?.extension_name || 'N/A' }}
                </dd>
              </div>

              <div class="flex justify-between border-b border-gray-400 py-1">
                <dt class="font-semibold">Position:</dt>
                <dd class="text-green-600">
                  {{ selectedUserInfo?.account_detail?.position || 'N/A' }}
                </dd>
              </div>

              <div class="flex justify-between border-b border-gray-400 py-1">
                <dt class="font-semibold">Email:</dt>
                <dd class="text-green-600">{{ selectedUserInfo?.email || 'N/A' }}</dd>
              </div>

              <div class="flex justify-between border-b border-gray-400 py-1">
                <dt class="font-semibold">Username:</dt>
                <dd class="text-green-600">{{ selectedUserInfo?.username || 'N/A' }}</dd>
              </div>

              <div class="flex justify-between border-b border-gray-400 py-1">
                <dt class="font-semibold">Section:</dt>
                <dd class="text-green-600">
                  {{ selectedUserInfo?.account_detail?.section?.name || 'N/A' }}
                </dd>
              </div>

              <div class="flex justify-between border-b border-gray-400 py-1">
                <dt class="font-semibold">Role:</dt>
                <dd class="text-green-600">{{ selectedUserInfo?.role?.name || 'N/A' }}</dd>
              </div>
            </dl>
          </div>
        </div>

        <!-- Main: DataTable -->
        <div class="w-full md:flex-1 overflow-x-auto">
          <div
            class="bg-white rounded-lg p-4 md:p-6 max-h-[500px] min-h-[500px] shadow-md inset-shadow-sm"
          >
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
                  <h4 class="m-0">Manage Users</h4>
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
                  <Button
                    class="border border-blue-500 text-blue-500 p-2 rounded hover:bg-blue-500 hover:text-white transition"
                    icon="pi pi-pencil"
                    @click.stop="editUser(slotProps.data)"
                    title="Edit"
                    aria-label="Edit user"
                  />
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
            <Button
              type="button"
              label="Cancel"
              @click="showEditDialog = false"
              class="bg-gray-300 px-4 py-2 rounded"
            />
            <Button
              type="submit"
              :label="saving ? 'Saving...' : 'Save'"
              :disabled="saving"
              class="bg-blue-500 text-white px-4 py-2 rounded"
            />
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

const authStore = useAuthStore()
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
    await Promise.all([authStore.fetchUser(), new Promise((resolve) => setTimeout(resolve, 1500))])
    fetchUsersData()
  } catch (error) {
    console.error('Error fetching dashboard data:', error)
  } finally {
    loading.value = false
  }
})
</script>

<style scoped></style>
