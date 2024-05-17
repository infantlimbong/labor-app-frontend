<template>
    <div class="w-full flex justify-center">
        <div class="w-full">
            <h1 class="text-2xl font-semibold mb-5 text-center">Create Student</h1>
            <form @submit.prevent="submitForm" enctype="multipart/form-data" class="bg-sky-500 text-white p-5 rounded-lg flex flex-wrap shadow-lg">
                <div class="mb-3 w-1/2 px-1">
                    <label for="name" class="block text-sm font-bold mb-1">Name</label>
                    <input v-model="user.name" id="name" type="text" placeholder="Name" class="text-gray-800 appearance-none rounded-md w-full py-2 px-3 leading-tight focus:outline-none focus:shadow-outline">
                </div>
                <div class="mb-3 w-1/2 px-1">
                    <label for="email" class="block text-sm font-bold mb-1">Email</label>
                    <input v-model="user.email" id="email" type="email" placeholder="Email" class="text-gray-800 appearance-none rounded-md w-full py-2 px-3 leading-tight focus:outline-none focus:shadow-outline">
                </div>
                <div class="mb-3 w-1/2 px-1">
                    <label for="password" class="block text-sm font-bold mb-1">Password</label>
                    <input v-model="user.password" id="password" type="password" placeholder="**********" class="text-gray-800 appearance-none rounded-md w-full py-2 px-3 leading-tight focus:outline-none focus:shadow-outline">
                </div>
                <div class="mb-3 w-1/2 px-1">
                    <label for="roles" class="block text-sm font-bold mb-1">Role</label>
                    <select v-model="user.roles" id="roles" class="text-gray-800 appearance-none rounded-md w-full py-2 px-3 leading-tight focus:outline-none focus:shadow-outline">
                        <option disabled value="">Select Role</option>
                        <option value="1">Admin</option>
                        <option value="2">Student</option>
                    </select>
                </div>
                <div class="mb-3 w-1/2 px-1">
                    <label for="nim" class="block text-sm font-bold mb-1">NIM</label>
                    <input v-model="user.nim" id="nim" type="number" placeholder="NIM" class="text-gray-800 appearance-none rounded-md w-full py-2 px-3 leading-tight focus:outline-none focus:shadow-outline">
                </div>
                <div class="mb-3 w-1/2 px-1">
                    <label for="phone_number" class="block text-sm font-bold mb-1">Phone Number</label>
                    <input v-model="user.phone_number" id="phone_number" type="tel" placeholder="Phone Number" class="text-gray-800 appearance-none rounded-md w-full py-2 px-3 leading-tight focus:outline-none focus:shadow-outline">
                </div>
                <div class="mb-3 w-1/2 px-1">
                    <div class="mb-3">
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
                    <div>
                        <label for="picture" class="block text-sm font-bold mb-1">Profile Picture</label>
                        <input @change="handleFileUpload" id="picture" type="file" class="text-white file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-sky-50 file:text-sky-700 hover:file:bg-sky-100 cursor-pointer file:cursor-pointer">
                    </div>
                </div>
                <div v-if="imagePreview" class="mt-2 w-1/2 px-1">
                    <img :src="imagePreview" alt="Profile Picture Preview" class="max-h-28 w-auto rounded-md">
                </div>
                <div v-else class="mt-14 w-1/2 px-1">
                    <span class="border border-white border-dashed px-9 py-8 rounded-md">
                        Image Preview
                    </span>
                </div>
                <div class="flex gap-x-2 text-white w-full items-end justify-end">
                    <button class="bg-white text-sky-500 hover:bg-sky-100 transition-all duration-300 text-sm font-semibold py-2 px-3 rounded-md focus:outline-none focus:shadow-outline" type="submit">
                        Submit
                    </button>
                    <button class="bg-red-500 hover:bg-red-600 transition-all duration-300 text-sm font-semibold py-2 px-3 rounded-md focus:outline-none focus:shadow-outline" type="button" @click="confirmCancel">
                        Cancel
                    </button>
                </div>
                <canvas hidden id="canvas"></canvas>
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
    const user = ref({
        name: '',
        email: '',
        password: '',
        roles: 2,
        nim: '',
        phone_number: '',
        gender: '',
        picture: null
    });

    const imagePreview = ref(null);

    const submitForm = async () => {
        if (!user.value.name || !user.value.email || !user.value.password || !user.value.roles || !user.value.nim || !user.value.phone_number || !user.value.gender || !user.value.picture) {
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Please fill all required fields including uploading a profile picture!'
            });
            return;
        }
        const formData = new FormData();
        Object.keys(user.value).forEach(key => {
            formData.append(key, user.value[key]);
        });

        try {
            await axios.post('http://localhost:8000/api/users', formData, {
                headers: {
                    Authorization: `Bearer ${authStore.accessToken}`,
                    'Content-Type': 'multipart/form-data',
                },
            });
            Swal.fire(
                'Success',
                'Student successfully registered!',
                'success'
            );
            router.push({ name: 'userlist' });
        } catch (error) {
            if (error.response.status === 400) {
                const errors = error.response.data;
                let errorMessage = 'Failed to register user.';
                if (errors.hasOwnProperty('email')) {
                    errorMessage = errors.email[0];
                } else if (errors.hasOwnProperty('nim')) {
                    errorMessage = errors.nim[0];
                } else if (errors.hasOwnProperty('phone_number')) {
                    errorMessage = errors.phone_number[0];
                }
                Swal.fire({
                    icon: 'error',
                    title: 'Failed',
                    text: errorMessage
                });
            } else {
                console.error('Failed to register student:', error);
                Swal.fire({
                    icon: 'error',
                    title: 'Failed',
                    text: 'Failed to register student.'
                });
            }
        }
    };

    const handleFileUpload = async (event) => {
        const file = event.target.files[0];
        if (!file) return;

        if (file.size > 5242880) {
            Swal.fire({
                icon: 'error',
                title: 'File Too Large',
                text: 'Please select an image less than 5MB!'
            });
            return;
        }

        imagePreview.value = URL.createObjectURL(file);

        const image = new Image();
        const reader = new FileReader();

        reader.readAsDataURL(file);
        reader.onload = (e) => {
            image.src = e.target.result;
            image.onload = () => {
                const maxWidth = 800;
                const maxHeight = 800;
                let width = image.width;
                let height = image.height;

                if (width > height) {
                    if (width > maxWidth) {
                        height *= maxWidth / width;
                        width = maxWidth;
                    }
                } else {
                    if (height > maxHeight) {
                        width *= maxHeight / height;
                        height = maxHeight;
                    }
                }

                const canvas = document.createElement('canvas');
                const ctx = canvas.getContext('2d');
                canvas.width = width;
                canvas.height = height;
                ctx.drawImage(image, 0, 0, width, height);

                const imageType = file.type === 'image/png' ? 'image/png' : 'image/jpeg';
                const compressionQuality = file.type === 'image/png' ? 0.8 : 0.5;

                canvas.toBlob((blob) => {
                    user.value.picture = new File([blob], file.name, {
                        type: imageType,
                        lastModified: Date.now()
                    });
                }, imageType, compressionQuality);
            };
        };
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
