<template>
  <h1 class="text-2xl font-bold mb-4">User Accounts</h1>
  <p class="mb-4">Manage user accounts and permissions.</p>

  <div class="flex flex-col md:flex-row gap-4 md:gap-8">
    <!-- Sidebar: User Data -->
    <div class="w-full md:w-1/3">
      <div class="bg-white shadow-md rounded-lg p-4 md:p-6">
        <h2 class="text-xl font-bold mb-4">User Data</h2>
        <template v-if="selectedUserInfo">
          <p class="mb-2">First Name: {{ selectedUserInfo.account_details.firstName }}</p>
          <p class="mb-2">
            Middle Name: {{ selectedUserInfo.account_details.middleName || 'N/A' }}
          </p>
          <p class="mb-2">Last Name: {{ selectedUserInfo.account_details.lastName }}</p>
          <p class="mb-2">
            Extension Name: {{ selectedUserInfo.account_details.extensionName || 'N/A' }}
          </p>
          <p class="mb-2">Position: {{ selectedUserInfo.account_details.position || 'N/A' }}</p>
          <p class="mb-2">Email: {{ selectedUserInfo.email || 'N/A' }}</p>
          <p class="mb-2">Username: {{ selectedUserInfo.username || 'N/A' }}</p>
          <p class="mb-2">Section: {{ selectedUserInfo.account_details.section.name || 'N/A' }}</p>
        </template>
        <p v-else class="text-gray-400 italic">Click a user row to view details.</p>
      </div>
    </div>

    <!-- Main: DataTable -->
    <div class="w-full md:flex-1 overflow-x-auto">
      <div class="bg-white shadow-md rounded-lg p-4 md:p-6">
        <DataTable
          :value="userData"
          paginator
          :rows="5"
          :rowsPerPageOptions="[5, 10, 20, 50]"
          :loading="loading"
          tableStyle="min-width: 30rem"
          @rowClick="selectUser"
          class="w-full"
        >
          <Column field="account_details.firstName" header="First Name" />
          <Column field="account_details.middleName" header="Middle Name" />
          <Column field="account_details.lastName" header="Last Name" />
          <Column field="account_details.extensionName" header="Extension Name" />
          <Column header="Actions" bodyStyle="text-align: center;">
            <template #body="slotProps">
              <button
                class="border border-blue-500 text-blue-500 p-2 rounded hover:bg-blue-500 hover:text-white transition"
                @click.stop="editUser(slotProps.data)"
                title="Edit"
              >
                <i class="pi pi-pencil" style="font-size: 1rem"></i>
              </button>
            </template>
          </Column>
        </DataTable>
      </div>
    </div>
  </div>

  <!-- Edit Dialog -->
  <Dialog v-model:visible="showEditDialog" header="Edit User" modal class="w-[90vw] md:w-[30rem]">
    <div class="p-4">
      <FloatLabel class="mb-4">
        <InputText id="first" v-model="editedUser.account_details.firstName" class="w-full" />
        <label for="first">First Name</label>
      </FloatLabel>

      <!-- Add other fields as needed -->

      <div class="flex justify-end gap-2 mt-4">
        <button @click="showEditDialog = false" class="bg-gray-300 px-4 py-2 rounded">
          Cancel
        </button>
        <button @click="saveUser" class="bg-blue-500 text-white px-4 py-2 rounded">Save</button>
      </div>
    </div>
  </Dialog>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import { useUsersStore } from '@/stores/users'

const users = useUsersStore()
const loading = ref(true)
const userData = ref([])

const selectedUser = ref(null)
const showEditDialog = ref(false)
const editedUser = ref({})

const selectedUserInfo = ref(null)

const selectUser = (event) => {
  selectedUserInfo.value = event.data
}

const fetchUsersData = async () => {
  try {
    await users.fetchAllUsers()
    userData.value = users.userList
  } catch (error) {
    console.error('Error fetching user data:', error)
  } finally {
    loading.value = false
  }
}

const editUser = (user) => {
  selectedUser.value = user
  editedUser.value = { ...user } // shallow copy to avoid live editing
  showEditDialog.value = true
}

const saveUser = async () => {
  try {
    await users.updateUser(selectedUser.value.id, editedUser.value)
    showEditDialog.value = false
    await fetchUsersData()
  } catch (err) {
    console.error('Failed to update user:', err)
  }
}

onMounted(() => {
  fetchUsersData()
})
</script>

<style scoped></style>
