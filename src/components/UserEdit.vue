<template>
    <div class="w-full flex justify-center mt-4">
        <div class="w-full">
            <h1 class="text-2xl font-semibold mb-5 text-center">Edit Student</h1>
            <form @submit.prevent="submitForm" class="bg-sky-500 text-white p-5 rounded-lg flex flex-wrap shadow-lg">
                <div class="mb-3 w-1/2 px-2">
                    <label for="name" class="block text-sm font-bold mb-1">Name</label>
                    <input v-model="user.name" id="name" type="text" placeholder="Name" class="text-gray-800 appearance-none rounded-md w-full py-2 px-3 leading-tight focus:outline-none focus:shadow-outline">
                </div>
                <div class="mb-3 w-1/2 px-2">
                    <label for="email" class="block text-sm font-bold mb-1">Email</label>
                    <input v-model="user.email" id="email" type="email" placeholder="Email" class="text-gray-800 appearance-none rounded-md w-full py-2 px-3 leading-tight focus:outline-none focus:shadow-outline">
                </div>
                <div class="mb-3 w-1/2 px-2">
                    <label for="password" class="block text-sm font-bold mb-1">Password <span class="font-light text-xs">Leave it blank if you don't want to change the password</span></label>
                    <input v-model="user.password" id="password" type="password" placeholder="**********" class="text-gray-800 appearance-none rounded-md w-full py-2 px-3 leading-tight focus:outline-none focus:shadow-outline">
                </div>
                <div class="mb-3 w-1/2 px-2">
                    <label for="roles" class="block text-sm font-bold mb-1">Role</label>
                    <select v-model="user.roles" id="roles" class="text-gray-800 appearance-none rounded-md w-full py-2 px-3 leading-tight focus:outline-none focus:shadow-outline">
                        <option disabled value="">Select Role</option>
                        <option value="1">Admin</option>
                        <option value="2">Mahasiswa</option>
                    </select>
                </div>
                <div class="mb-3 w-1/2 px-2">
                    <label for="nim" class="block text-sm font-bold mb-1">NIM</label>
                    <input v-model="user.nim" id="nim" type="text" placeholder="NIM (Optional)" class="text-gray-800 appearance-none rounded-md w-full py-2 px-3 leading-tight focus:outline-none focus:shadow-outline">
                </div>
                <div class="mb-3 w-1/2 px-2">
                    <label for="phone_number" class="block text-sm font-bold mb-1">Phone Number</label>
                    <input v-model="user.phone_number" id="phone_number" type="tel" placeholder="Phone Number (Optional)" class="text-gray-800 appearance-none rounded-md w-full py-2 px-3 leading-tight focus:outline-none focus:shadow-outline">
                </div>
                <div class="mb-3 w-1/2 px-2">
                    <label class="block text-sm font-bold mb-1">Gender</label>
                    <div class="flex items-center gap-4">
                        <label class="flex items-center gap-2">
                            <input type="radio" v-model="user.gender" value="0" class="form-radio">
                            Female
                        </label>
                        <label class="flex items-center gap-2">
                            <input type="radio" v-model="user.gender" value="1" class="form-radio">
                            Male
                        </label>
                    </div>
                </div>
                <div class="flex gap-x-2 text-white w-full items-end justify-end">
                    <button class="bg-white text-sky-500 hover:bg-sky-100 transition-all duration-300 text-sm font-semibold py-2 px-3 rounded-md focus:outline-none focus:shadow-outline" type="submit">
                        Update
                    </button>
                    <button class="bg-red-500 hover:bg-red-600 transition-all duration-300 text-sm font-semibold py-2 px-3 rounded-md focus:outline-none focus:shadow-outline" type="button" @click="confirmCancel">
                        Cancel
                    </button>
                </div>
            </form>
        </div>
    </div>
</template>
  
<script setup>
    import { ref, onMounted } from 'vue';
    import axios from 'axios';
    import { useRouter, useRoute } from 'vue-router';
    import { useAuthStore } from "@/stores/auth";
    import Swal from 'sweetalert2';

    const authStore = useAuthStore();

    const route = useRoute();
    const router = useRouter();
    const userId = route.params.id;
    const user = ref({
        name: '',
        email: '',
        password: '',
        nim: '',
        phone_number: '',
        gender: '',
        roles: ''
    });

    onMounted(async () => {
        try {
            const response = await axios.get(`http://localhost:8000/api/users/${userId}`, {
                headers: {
                    Authorization: `Bearer ${authStore.accessToken}`,
                },
            });
            user.value = response.data.data;
        } catch (error) {
            console.error('Something went wrong!', error);
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Failed to fetch data!',
            });
        }
    });

    const submitForm = async () => {
        try {
            await axios.put(`http://localhost:8000/api/users/${userId}`, user.value, {
                headers: {
                    Authorization: `Bearer ${authStore.accessToken}`,
                },
            });
            Swal.fire({
                icon: 'success',
                title: 'Success',
                text: 'Student successfully edited!',
            });
            router.push({ name: 'userlist' });
        } catch (error) {
            console.error('Something went wrong!', error);
            Swal.fire({
                icon: 'error',
                title: 'Failed',
                text: 'Failed to edit student.',
            });
        }
    };

    const confirmCancel = () => {
        Swal.fire({
            title: 'Are you sure?',
            text: 'All changes will be discarded!',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, cancel it!'
        }).then((result) => {
            if (result.isConfirmed) {
                router.go(-1);
            }
        });
    };
</script>
