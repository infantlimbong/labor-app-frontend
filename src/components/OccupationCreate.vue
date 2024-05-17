<template>
    <div class="w-full flex justify-center">
        <div class="max-w-lg w-full">
            <h1 class="text-2xl font-semibold mb-5 text-center">Create Occupation</h1>
            <form @submit.prevent="submitForm" enctype="multipart/form-data" class="bg-sky-500 text-white p-5 rounded-lg shadow-lg">
                <div class="mb-3">
                    <label for="occupation" class="block text-sm font-bold mb-1">Occupation Name</label>
                    <input v-model="occupation.occupation" id="occupation" type="text" placeholder="Occupation Name" class="text-gray-800 appearance-none rounded-md w-full py-2 px-3 leading-tight focus:outline-none focus:shadow-outline">
                </div>
                <div class="mb-5">
                    <label for="supervisor" class="block text-sm font-bold mb-1">Supervisor</label>
                    <input v-model="occupation.supervisor" id="supervisor" type="text" placeholder="Supervisor" class="text-gray-800 appearance-none rounded-md w-full py-2 px-3 leading-tight focus:outline-none focus:shadow-outline">
                </div>
                <div class="flex gap-x-2 text-white w-full items-end justify-end">
                    <button class="bg-white text-sky-500 hover:bg-sky-100 transition-all duration-300 text-sm font-semibold py-2 px-3 rounded-md focus:outline-none focus:shadow-outline" type="submit">
                        Submit
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
    import { ref } from 'vue';
    import axios from 'axios';
    import { useRouter } from 'vue-router';
    import { useAuthStore } from "@/stores/auth";
    import Swal from 'sweetalert2';

    const authStore = useAuthStore();
    const router = useRouter();
    const occupation = ref({
        occupation: '',
        supervisor: ''
    });

    // From submission
    const submitForm = async () => {
        // Make sure all the fields are filled with sweet alert
        if (!occupation.value.occupation || !occupation.value.supervisor) {
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Please fill all required fields!'
            });
            return;
        }

        // Post the data if all conditions are met
        try {
            await axios.post('http://localhost:8000/api/occupations', occupation.value, {
                headers: {
                    Authorization: `Bearer ${authStore.accessToken}`,
                    'Content-Type': 'application/json',
                },
            });
            Swal.fire(
                'Success',
                'Occupation successfully created!',
                'success'
            );
            // push the router back to /occupationlist
            router.push({ name: 'occupationlist' });
        } catch (error) {
            console.error('Failed to create occupation:', error);
            Swal.fire({
                icon: 'error',
                title: 'Failed',
                text: 'Failed to create occupation.'
            });
        }
    };

    const confirmCancel = () => {
        Swal.fire({
            title: 'Are you sure?',
            text: "All changes will be discarded.",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, discard it!'
        }).then((result) => {
            if (result.isConfirmed) {
                router.go(-1);
            }
        });
    };
</script>