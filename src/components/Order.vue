<template>
    <div class="max-w-6xl mx-auto">
        <div class="flex justify-between items-center mb-6">
            <h1 class="text-2xl font-semibold">
                <span v-if="admin">All</span>
                <span v-else>My</span> 
                Orders
            </h1>
            <RouterLink to="/ordercreate" class="bg-sky-500 hover:bg-sky-400 text-white text-sm font-semibold py-2 px-4 rounded-md">Add Order</RouterLink>
        </div>
        <div class="overflow-x-auto">
            <table class="min-w-full table-auto rounded-lg overflow-hidden">
                <thead class="bg-sky-500/20">
                    <tr class="border-y text-xs uppercase text-sky-700">
                        <th class="px-4 py-3 text-left rounded-tl-lg">No.</th>
                        <th class="px-4 py-3 text-left">Ordered by</th>
                        <th class="px-4 py-3 text-left">Occupation</th>
                        <th class="px-4 py-3 text-left">Task</th>
                        <th class="px-4 py-3 text-left">Working Hour/Day</th>
                        <th class="px-4 py-3 text-left">Salary</th>
                        <th class="px-4 py-3 text-left">Status</th>
                        <th class="px-4 py-3 text-left">Ordered At</th>
                        <th class="px-4 py-3 text-left rounded-tr-lg">Action</th>
                    </tr>
                </thead>
                <tbody v-if="filteredOrders.length > 0">
                    <tr class="hover:bg-sky-500/15 even:bg-sky-300/15" v-for="(order, index) in filteredOrders" :key="order.id">
                        <td class="border-b px-4 py-2">{{ index + 1 }}</td>
                        <td class="border-b px-4 py-2">{{ order.user ? order.user.name : 'Loading...' }}</td>
                        <td class="border-b px-4 py-2">{{ order.occupation ? order.occupation.occupation : 'Loading...' }}</td>
                        <td class="border-b px-4 py-2">{{ order.task ? order.task.task : 'Loading...' }}</td>
                        <td class="border-b px-4 py-2">{{ order.salary ? order.salary.hour : 'Loading...' }} Hours</td>
                        <td class="border-b px-4 py-2">{{ order.salary ? formatSalary(order.salary.salary) : 'Loading...' }} IDR</td>
                        <td class="border-b px-4 py-2">
                            <select :disabled="!admin" v-model="order.order_status" @focus="saveCurrentStatus(order)" @change="updateStatus(order)" :class="{ 'bg-yellow-500': order.order_status === 'Pending', 'bg-green-500': order.order_status === 'Accepted', 'bg-red-500': order.order_status === 'Rejected' }" class="rounded-md cursor-pointer text-white text-sm py-1 px-3 text-center appearance-none focus:outline-none">
                                <option value="Pending">Pending</option>
                                <option value="Accepted">Accepted</option>
                                <option value="Rejected">Rejected</option>
                            </select>
                        </td>
                        <td class="border-b px-4 py-2">{{ formatDate(order.created_at) }}</td>
                        <td class="border-b px-4 py-2 text-white">
                            <div class="flex gap-x-1 text-sm">
                                <RouterLink :to="'/orderedit/' + order.id" class="bg-sky-500 transition-all duration-300 hover:bg-opacity-50 py-1 px-2 rounded"><i class='bx bxs-edit'></i></RouterLink>
                                <button @click="confirmDelete(order.id)" class="bg-red-500 transition-all duration-300 hover:bg-opacity-50 py-1 px-2 rounded"><i class='bx bxs-trash'></i></button>
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
    </div>
</template>

<script setup>
    import { onMounted, ref, reactive, computed } from 'vue';
    import axios from 'axios';
    import { RouterLink } from 'vue-router';
    import { useAuthStore } from "@/stores/auth";
    import Swal from 'sweetalert2';
    import { format, isToday, isYesterday, parseISO } from 'date-fns';

    const authStore = useAuthStore();
    const orders = ref([]);
    const originalStatuses = reactive({});

    const admin = computed(() => {
        return authStore.user && authStore.user.data && authStore.user.data.roles === 1;
    });

    const filteredOrders = computed(() => {
        if (admin.value) {
            return orders.value;
        } else {
            return orders.value.filter(order => order.user_id === authStore.user.data.id);
        }
    });

    const formatDate = (dateStr) => {
        const date = parseISO(dateStr);
        if (isToday(date)) return 'Today';
        if (isYesterday(date)) return 'Yesterday';
        return format(date, 'MMM dd, yyyy');
    };

    onMounted(async () => {
        try {
            const response = await axios.get('http://localhost:8000/api/orders', {
                headers: { 'Authorization': `Bearer ${authStore.accessToken}` }
            });
            orders.value = await Promise.all(response.data.data.reverse().map(async order => {
                try {
                    const [userRes, occupationRes, salaryRes, taskRes] = await Promise.all([
                        axios.get(`http://localhost:8000/api/users/${order.user_id}`, { headers: { 'Authorization': `Bearer ${authStore.accessToken}` } }),
                        axios.get(`http://localhost:8000/api/occupations/${order.occupation_id}`, { headers: { 'Authorization': `Bearer ${authStore.accessToken}` } }),
                        axios.get(`http://localhost:8000/api/salaries/${order.salary_id}`, { headers: { 'Authorization': `Bearer ${authStore.accessToken}` } }),
                        axios.get(`http://localhost:8000/api/tasks/${order.task_id}`, { headers: { 'Authorization': `Bearer ${authStore.accessToken}` } })
                    ]);
                    return {
                        ...order,
                        user: userRes.data.data,
                        occupation: occupationRes.data.data,
                        salary: salaryRes.data.data,
                        task: taskRes.data.data
                    };
                } catch (error) {
                    console.error('Failed to fetch related data for order:', order.id, error);
                    return { ...order, user: { name: 'Unavailable' }, occupation: {}, salary: {}, task: {} }; // Default objects for missing data
                }
            }));
        } catch (error) {
            console.error('Failed to fetch orders:', error);
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Failed to load order data!',
            });
        }
    });

    onMounted(async () => {
        await reloadOrders();
    });

    const saveCurrentStatus = (order) => {
        originalStatuses[order.id] = order.order_status;  // Save current status before changes
    };

    const updateStatus = async (order) => {
        Swal.fire({
            title: 'Are you sure?',
            text: `Change status to "${order.order_status}"?`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, change it!'
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    const response = await axios.put(`http://localhost:8000/api/orders/${order.id}`, {
                        order_status: order.order_status
                    }, {
                        headers: {
                            'Authorization': `Bearer ${authStore.accessToken}`,
                            'Content-Type': 'application/json',
                        },
                    });
                    Swal.fire('Updated!', 'The order status has been updated.', 'success');
                } catch (error) {
                    console.error('Failed to update order status:', error);
                    Swal.fire({
                        icon: 'error',
                        title: 'Failed',
                        text: 'Failed to update order status.'
                    });
                    revertStatus(order);
                }
            } else {
                revertStatus(order);
            }
        });
    };

    const revertStatus = (order) => {
        if (originalStatuses[order.id]) {
            order.order_status = originalStatuses[order.id];  // Revert to the saved status
        }
    };

    const reloadOrders = async () => {
        try {
            const response = await axios.get('http://localhost:8000/api/orders', {
                headers: {
                    'Authorization': `Bearer ${authStore.accessToken}`,
                },
            });
            orders.value = response.data.data;
        } catch (error) {
            console.error('Failed to reload orders:', error);
        }
    };

    const confirmDelete = (id) => {
        Swal.fire({
            title: 'Are you sure?',
            text: 'You will not be able to recover this order data!',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, delete it!'
        }).then((result) => {
            if (result.isConfirmed) {
                deleteOrder(id);
            }
        });
    };

    const deleteOrder = async (id) => {
        try {
            await axios.delete(`http://localhost:8000/api/orders/${id}`, {
                headers: {
                    Authorization: `Bearer ${authStore.accessToken}`,
                },
            });
            orders.value = orders.value.filter(order => order.id !== id);
            Swal.fire('Deleted!', 'Order data successfully deleted.', 'success');
        } catch (error) {
            console.error('Failed to delete order:', error);
            Swal.fire('Failed!', 'Something went wrong! Failed to delete the data.', 'error');
        }
    };

    function formatSalary(value) {
        const numberFormat = new Intl.NumberFormat('id-ID');
        return numberFormat.format(value);
    }
</script>
