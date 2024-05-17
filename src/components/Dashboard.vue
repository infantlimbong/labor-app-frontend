<template>
    <div class="text-white">
        <!-- Total users and students count -->
        <h2 class="text-gray-800 mb-4 text-center text-3xl font-semibold">Users</h2>
        <div class="flex w-full flex-wrap gap-4">
            <div class="text-center bg-sky-500 flex-grow pt-5 pb-8 basis-48 rounded-xl">
                <h3 class="mb-4">Total Admins</h3>
                <div class="text-4xl font-bold">
                    {{ state.filteredCounts.admins }}
                </div>
            </div>
            <div class="text-center bg-sky-500 flex-grow pt-5 pb-8 basis-48 rounded-xl">
                <h3 class="mb-4">Total Students</h3>
                <div class="text-4xl font-bold">
                    {{ state.filteredCounts.students }}
                </div>
            </div>
            <div class="text-center bg-sky-500 flex-grow pt-5 pb-8 basis-48 rounded-xl">
                <h3 class="mb-4">Total Users</h3>
                <div class="text-4xl font-bold">
                    {{ state.totalCounts.users }}
                </div>
            </div>
        </div>
        <!-- End of total users and students count -->

        <hr class="border-sky-500 mb-8 mt-12">

        <!-- Total orders and filtered orders count -->
        <h2 class="text-gray-800 my-4 text-center text-3xl font-semibold">Orders</h2>
        <div class="flex w-full flex-wrap gap-4">
            <div class="text-center bg-yellow-500 flex-grow pt-5 pb-8 basis-48 rounded-xl">
                <h3 class="mb-4">Total Pending Orders</h3>
                <div class="text-4xl font-bold">
                    {{ state.filteredCounts.pendingOrders }}
                </div>
            </div>
            <div class="text-center bg-green-500 flex-grow pt-5 pb-8 basis-48 rounded-xl">
                <h3 class="mb-4">Total Accepted Orders</h3>
                <div class="text-4xl font-bold">
                    {{ state.filteredCounts.acceptedOrders }}
                </div>
            </div>
            <div class="text-center bg-red-500 flex-grow pt-5 pb-8 basis-48 rounded-xl">
                <h3 class="mb-4">Total Rejected Orders</h3>
                <div class="text-4xl font-bold">
                    {{ state.filteredCounts.rejectedOrders }}
                </div>
            </div>
            <div class="text-center bg-blue-500 flex-grow pt-5 pb-8 basis-48 rounded-xl">
                <h3 class="mb-4">Total Orders</h3>
                <div class="text-4xl font-bold">
                    {{ state.totalCounts.orders }}
                </div>
            </div>
        </div>
        <!-- End of Total orders and filtered orders count -->
    </div>
</template>

<script setup>
import { reactive, onMounted } from 'vue';
import axios from 'axios';
import { useAuthStore } from "@/stores/auth";

const authStore = useAuthStore();

// Define the dedault value of the total and filtered counts
const state = reactive({
    totalCounts: {
        users: 0,
        orders: 0
    },
    filteredCounts: {
        admins: 0,
        students: 0,
        pendingOrders: 0,
        acceptedOrders: 0,
        rejectedOrders: 0
    }
});

// Fetching data from users and orders table
const fetchData = async () => {
    try {
        const [usersResponse, ordersResponse] = await Promise.all([
            axios.get('http://localhost:8000/api/users', {
                headers: { 'Authorization': `Bearer ${authStore.accessToken}` }
            }),
            axios.get('http://localhost:8000/api/orders', {
                headers: { 'Authorization': `Bearer ${authStore.accessToken}` }
            })
        ]);

        // Define the users and orders value for easy use
        const users = usersResponse.data.data;
        const orders = ordersResponse.data.data;

        // Counts the total data of users and orders table
        state.totalCounts.users = users.length;
        state.totalCounts.orders = orders.length;

        // Fitering counts for users and orders table
        state.filteredCounts.admins = users.filter(user => user.roles === 1).length;
        state.filteredCounts.students = users.filter(user => user.roles !== 1).length;
        state.filteredCounts.pendingOrders = orders.filter(order => order.order_status === 'Pending').length;
        state.filteredCounts.acceptedOrders = orders.filter(order => order.order_status === 'Accepted').length;
        state.filteredCounts.rejectedOrders = orders.filter(order => order.order_status === 'Rejected').length;
    } catch (error) {
        console.error('Failed to fetch data:', error);
    }
};

onMounted(fetchData);
</script>
