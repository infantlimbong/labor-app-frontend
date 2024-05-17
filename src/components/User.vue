<template>
    <div class="max-w-6xl mx-auto">
        <div class="flex justify-between items-center mb-6">
            <h1 class="text-2xl font-semibold">Students</h1>
            <RouterLink to="/usercreate" class="bg-sky-500 hover:bg-sky-400 text-white text-sm font-semibold py-2 px-4 rounded-md">Add Student</RouterLink>
        </div>
        <div class="overflow-x-auto">
            <table class="min-w-full table-auto rounded-lg overflow-hidden">
                <thead class="bg-sky-500/20">
                    <tr class="border-y text-xs uppercase text-sky-700">
                        <th class="px-4 py-3 text-left rounded-tl-lg">No.</th>
                        <th class="px-4 py-3 text-left">Name</th>
                        <th class="px-4 py-3 text-left">Email</th>
                        <th class="px-4 py-3 text-left">Role</th>
                        <th class="px-4 py-3 text-left">NIM</th>
                        <th class="px-4 py-3 text-left">Phone Number</th>
                        <th class="px-4 py-3 text-left">Gender</th>
                        <th class="px-4 py-3 text-left">Picture</th>
                        <th class="px-4 py-3 text-left rounded-tr-lg">Action</th>
                    </tr>
                </thead>
                <tbody v-if="users && users.length > 0">
                    <tr class="hover:bg-sky-500/15 even:bg-sky-300/15" v-for="(user, loop) in users" :key="user.id">
                        <td class="border-b px-4 py-2">{{ loop + 1 }}</td>
                        <td class="border-b px-4 py-2 capitalize">{{ user.name }}</td>
                        <td class="border-b px-4 py-2">{{ user.email }}</td>
                        <td v-if="user.roles == 1" class="border-b px-4 py-2">Admin</td>
                        <td v-else class="border-b px-4 py-2">Student</td>
                        <td class="border-b px-4 py-2">{{ user.nim }}</td>
                        <td class="border-b px-4 py-2">{{ user.phone_number }}</td>
                        <td v-if="user.gender == 0" class="border-b px-4 py-2">Female</td>
                        <td v-else class="border-b px-4 py-2">Male</td>
                        <td class="border-b px-4 py-2">
                            <div v-if="user.picture" class="flex justify-center">
                                <img @click="openImageModal(user)" :src="getImageUrl(user.picture)" alt="User Picture" class="h-12 w-12 object-cover rounded-full cursor-pointer">
                            </div>
                            <span v-else @click="openImageModal(user)">No Picture</span>
                        </td>
                        <td class="border-b px-4 py-2 text-white">
                            <div class="flex gap-x-1 text-sm">
                                <RouterLink :to="'/useredit/' + user.id" class="bg-sky-500 transition-all duration-300 hover:bg-opacity-50 py-1 px-2 rounded"><i class='bx bxs-edit'></i></RouterLink>
                                <button @click="confirmDelete(user.id)" class="bg-red-500 transition-all duration-300 hover:bg-opacity-50 py-1 px-2 rounded"><i class='bx bxs-trash'></i></button>
                            </div>
                        </td>
                    </tr>
                </tbody>
                <tbody v-else>
                    <tr>
                        <td colspan="12" class="text-center pt-12">No data found</td>
                    </tr>
                </tbody>
            </table>
        </div>
        <!-- Modal for image editing -->
        <div v-if="showImageModal" class="fixed z-50 inset-0 overflow-y-auto">
            <div class="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                <div class="fixed inset-0 transition-opacity" aria-hidden="true">
                    <div class="absolute inset-0 bg-gray-500 opacity-75"></div>
                </div>
                <span class="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
                <div class="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg">
                    <div class="bg-white px-4 pt-5 pb-4 sm:p-6">
                        <div class="sm:flex sm:items-start">
                        <div class="mt-3 text-center sm:mt-0 sm:text-left">
                            <h3 class="text-lg font-medium text-gray-900 mb-4">Edit Picture</h3>
                            <img :src="getImageUrl(editingUser.picture)" alt="User Picture" class="h-64 w-auto mx-auto mb-4 object-cover">
                            <div class="mb-4">
                                <label for="newImage" class="block text-sm mb-3 font-medium text-gray-700">Edit Picture</label>
                                <input type="file" id="newImage" @change="handleImageChange" accept="image/*" class="text-gray-800 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-sky-200/50 file:text-sky-700 hover:file:bg-sky-200 hover:file:cursor-pointer cursor-pointer">
                            </div>
                        </div>
                        </div>
                    </div>
                    <div class="bg-gray-50 px-6 flex flex-row-reverse">
                        <button type="button" @click="closePictureModal" class="bg-red-500 text-white px-3 py-2 text-sm rounded-md hover:bg-opacity-70 transition-all duration-300 mb-5">
                            Cancel
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
    import { onMounted, ref } from 'vue';
    import axios from 'axios';
    import { RouterLink } from 'vue-router';
    import { useAuthStore } from "@/stores/auth";
    import Swal from 'sweetalert2';

    const authStore = useAuthStore();

    const users = ref([]);
    const usersMap = ref({});
    const showImageModal = ref(false);
    let editingUser = null;

    const getImageUrl = (imageName) => {
        return `http://localhost/valerie_final_project/public${imageName}`;
    };

    // Method to open image modal
    const openImageModal = (user) => {
        editingUser = user;
        showImageModal.value = true;
    };

    // Method to close image modal
    const closePictureModal = () => {
        showImageModal.value = false;
    };

    const handleImageChange = async (event) => {
        const file = event.target.files[0];
        if (!file) return;

        // Check if file size exceeds 5MB
        const fileSizeInMB = file.size / (1024 * 1024);
        if (fileSizeInMB > 5) {
            // Show sweet alert
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'The maximum image size is 5MB',
            });
            return;
        }

        const result = await Swal.fire({
            title: 'Update Image?',
            text: 'Are you sure you want to update the user picture?',
            icon: 'question',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, update it!'
        });

        if (result.isConfirmed) {
            const reader = new FileReader();
            reader.onload = function (e) {
                const imgElement = document.createElement("img");
                imgElement.src = e.target.result;
                imgElement.onload = function (e) {
                    const canvas = document.createElement("canvas");
                    const scaleSize = 1024 / e.target.width;
                    canvas.width = 1024;
                    canvas.height = e.target.height * scaleSize;

                    const ctx = canvas.getContext("2d");
                    ctx.drawImage(e.target, 0, 0, canvas.width, canvas.height);

                    ctx.canvas.toBlob((blob) => {
                        const formData = new FormData();
                        formData.append('picture', blob, file.name);

                        axios.post(`http://localhost:8000/api/users/${editingUser.id}/edit_picture`, formData, {
                            headers: {
                                'Content-Type': 'multipart/form-data',
                                'Authorization': `Bearer ${authStore.accessToken}`
                            }
                        }).then(response => {
                            editingUser.picture = response.data.updatedPicture;
                            closePictureModal();
                            reloadUsers(); // Reload users to show the updated picture
                            Swal.fire('Updated!', 'User picture updated successfully.', 'success');
                        }).catch(error => {
                            console.error('Error updating picture:', error);
                            Swal.fire('Error', 'Failed to update the user picture.', 'error');
                        });
                    }, 'image/jpeg', 0.75); // Adjust the quality as needed
                };
            };
            reader.readAsDataURL(file);
        }
    };

    const reloadUsers = async () => {
        try {
            const response = await axios.get('http://localhost:8000/api/users', {
                headers: {
                    'Authorization': `Bearer ${authStore.accessToken}`,
                }
            });
            users.value = response.data.data;
        } catch (error) {
            console.error('Failed to fetch users:', error);
        }
    };

    onMounted(async () => {
        await reloadUsers();  // Initial load of users
    });

    const confirmDelete = (id) => {
        Swal.fire({
            title: 'Are you sure?',
            text: 'You will not be able to recover this user data!',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, delete it!'
        }).then((result) => {
            if (result.value) {
                deleteUser(id);
            }
        });
    };

    const deleteUser = async (id) => {
        try {
            await axios.delete(`http://localhost:8000/api/users/${id}`, {
                headers: {
                    Authorization: `Bearer ${authStore.accessToken}`,
                },
            });
            users.value = users.value.filter(user => user.id !== id);
            Swal.fire(
                'Deleted!',
                'Data successfully deleted.',
                'success'
            );
        } catch (error) {
            console.error('Failed to delete user:', error);
            Swal.fire(
                'Failed!',
                'Something went wrong! Failed to delete the data.',
                'error'
            );
        }
    };
</script>

<style scoped>
    .overflow-x-auto::-webkit-scrollbar {
        height: 3px;
        background-color: #ffffff5e;
    }

    .overflow-x-auto::-webkit-scrollbar-thumb {
        background-color: #0d97cd;
        border-radius: 2px;
    }
</style>