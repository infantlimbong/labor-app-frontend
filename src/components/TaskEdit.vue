<template>
    <div class="w-full flex justify-center mt-4">
        <div class="max-w-lg w-full">
            <h1 class="text-2xl font-semibold mb-5 text-center">Edit Task</h1>
            <form @submit.prevent="submitForm" class="bg-sky-500 text-white p-5 rounded-lg shadow-lg">
                <div class="mb-3">
                    <label for="task" class="block text-sm font-bold mb-1">Task Description</label>
                    <input v-model="task.task" id="task" type="text" placeholder="Task Description" class="text-gray-800 appearance-none rounded-md w-full py-2 px-3 leading-tight focus:outline-none focus:shadow-outline">
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
    const taskId = route.params.id;
    const task = ref({
        task: ''
    });

    onMounted(async () => {
        try {
            const response = await axios.get(`http://localhost:8000/api/tasks/${taskId}`, {
                headers: {
                    Authorization: `Bearer ${authStore.accessToken}`,
                },
            });
            task.value = response.data.data;
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
            await axios.put(`http://localhost:8000/api/tasks/${taskId}`, task.value, {
                headers: {
                    Authorization: `Bearer ${authStore.accessToken}`,
                },
            });
            Swal.fire({
                icon: 'success',
                title: 'Success',
                text: 'Task successfully edited!',
            });
            router.push({ name: 'tasklist' });
        } catch (error) {
            console.error('Something went wrong!', error);
            Swal.fire({
                icon: 'error',
                title: 'Failed',
                text: 'Failed to edit task.',
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
