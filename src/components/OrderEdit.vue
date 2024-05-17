<template>
    <div class="w-full flex justify-center">
        <div class="max-w-lg w-full">
            <h1 class="text-2xl font-semibold mb-5 text-center">Edit Order</h1>
            <form @submit.prevent="submitForm" class="bg-sky-500 text-white p-5 rounded-lg shadow-lg">
                <div class="mb-3">
                    <label for="occupation_id" class="block text-sm font-bold mb-1">Occupation</label>
                    <select v-model="order.occupation_id" id="occupation_id" class="text-gray-800 appearance-none rounded-md w-full py-2 px-3 leading-tight focus:outline-none focus:shadow-outline">
                        <option disabled value="">Select Occupation</option>
                        <option v-for="occupation in occupations" :value="occupation.id" :key="occupation.id">{{ occupation.occupation }}</option>
                    </select>
                </div>
                <div class="mb-3">
                    <label for="task_id" class="block text-sm font-bold mb-1">Task</label>
                    <select v-model="order.task_id" id="task_id" class="text-gray-800 appearance-none rounded-md w-full py-2 px-3 leading-tight focus:outline-none focus:shadow-outline">
                        <option disabled value="">Select Task</option>
                        <option v-for="task in tasks" :value="task.id" :key="task.id">{{ task.task }}</option>
                    </select>
                </div>
                <div class="mb-3">
                    <label for="salary_id" class="block text-sm font-bold mb-1">Salary | Working Hours</label>
                    <select v-model="order.salary_id" id="salary_id" class="text-gray-800 appearance-none rounded-md w-full py-2 px-3 leading-tight focus:outline-none focus:shadow-outline">
                        <option disabled value="">Select Salary</option>
                        <option v-for="salary in salaries" :value="salary.id" :key="salary.id">{{ formatSalary(salary.salary) }} IDR | {{ salary.hour }} Hours</option>
                    </select>
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
    const router = useRouter();
    const route = useRoute();
    const orderId = route.params.id;
    const order = ref({
        occupation_id: '',
        salary_id: '',
        task_id: '',
        order_status: ''
    });

    const occupations = ref([]);
    const salaries = ref([]);
    const tasks = ref([]);

    onMounted(async () => {
        try {
            // Fetch order details along with occupations, salaries, and tasks for dropdowns
            const orderDetails = axios.get(`http://localhost:8000/api/orders/${orderId}`, {
                headers: { 'Authorization': `Bearer ${authStore.accessToken}` }
            });
            const fetchOccupations = axios.get('http://localhost:8000/api/occupations', {
                headers: { 'Authorization': `Bearer ${authStore.accessToken}` }
            });
            const fetchSalaries = axios.get('http://localhost:8000/api/salaries', {
                headers: { 'Authorization': `Bearer ${authStore.accessToken}` }
            });
            const fetchTasks = axios.get('http://localhost:8000/api/tasks', {
                headers: { 'Authorization': `Bearer ${authStore.accessToken}` }
            });

            const results = await Promise.all([orderDetails, fetchOccupations, fetchSalaries, fetchTasks]);
            
            const orderData = results[0].data.data;
            occupations.value = results[1].data.data;
            salaries.value = results[2].data.data;
            tasks.value = results[3].data.data;

            // Populate order data
            order.value = {
                occupation_id: orderData.occupation_id,
                salary_id: orderData.salary_id,
                task_id: orderData.task_id,
                order_status: orderData.order_status
            };
        } catch (error) {
            console.error('Failed to fetch data:', error);
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Failed to load data!',
            });
        }
    });

    const submitForm = async () => {
        try {
            await axios.put(`http://localhost:8000/api/orders/${orderId}`, order.value, {
                headers: {
                    'Authorization': `Bearer ${authStore.accessToken}`,
                    'Content-Type': 'application/json',
                },
            });
            Swal.fire(
                'Success',
                'Order successfully updated!',
                'success'
            );
            router.push({ name: 'orderlist' });
        } catch (error) {
            console.error('Failed to update order:', error);
            Swal.fire({
                icon: 'error',
                title: 'Failed',
                text: 'Failed to update order.'
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

    function formatSalary(value) {
        const numberFormat = new Intl.NumberFormat('id-ID');
        return numberFormat.format(value);
    }
</script>
