<template>
    <div class="h-full mt-28 flex items-center justify-center px-4 -ml-64">
        <div class="max-w-xs w-full bg-sky-500 rounded-lg p-4">
            <div class="grid mb-3 text-white">
                <h2 class="text-center text-2xl font-bold">Universitas Advent Indonesia</h2>
                <h4 class="text-center text-base font-medium">Labor Log</h4>
                <h4 class="text-center text-xs font-light mb-3">Final Project Web 2</h4>
                <div v-if="errorMessage" class="text-red-500 text-center text-sm bg-red-100 py-2 rounded-md">{{ errorMessage }}</div>
            </div>
            <form @submit.prevent="onSubmit" class="mt-5">
                <div class="my-2">
                    <label for="email" class="sr-only">Email address</label>
                    <input v-model="email" id="email" name="email" type="email" autocomplete="email" required class="w-full text-sm rounded-md py-2 px-3 focus:outline-none" placeholder="Email address">
                </div>
                <div class="mb-8">
                    <label for="password" class="sr-only">Password</label>
                    <input v-model="password" id="password" name="password" type="password" autocomplete="current-password" required class="w-full text-sm rounded-md py-2 px-3 focus:outline-none" placeholder="Password">
                </div>

                <div >
                    <button type="submit" class="w-full bg-sky-400 text-white py-2 font-semibold rounded-md focus:outline-none hover:bg-sky-300 transition-all duration-300">Login</button>
                </div>
            </form>
        </div>
    </div>
</template>
  

<script setup>
    import { ref } from "vue";
    import axios from "axios";
    import { useRouter } from "vue-router";
    import { useAuthStore } from "@/stores/auth";

    const router = useRouter();
    const authStore = useAuthStore();

    const email = ref("");
    const password = ref("");
    const errorMessage = ref(null);

    async function onSubmit() {
        try {
            await axios.get("http://localhost:8000/sanctum/csrf-cookie");

            const response = await axios.post("http://localhost:8000/api/login", {
                email: email.value,
                password: password.value,
            });

            authStore.setAccessToken(response.data.access_token);
            console.log("Login successful");
            router.push({ name: "dashboard" });
        } catch (error) {
            if (error.response && error.response.status === 422 && error.response.data.errors && error.response.data.errors.email) {
                errorMessage.value = error.response.data.errors.email[0];
            } else {
                errorMessage.value = "An error occurred: " + error.message;
            }
            console.error(errorMessage.value);
        }
    }
</script>
