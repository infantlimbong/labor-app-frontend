<template>
    <div class="max-w-6xl mx-auto">
        <div class="flex justify-between items-center mb-6">
            <h1 class="text-2xl font-semibold">Occupations</h1>
            <RouterLink to="/occupationcreate" class="bg-sky-500 hover:bg-sky-400 text-white text-sm font-semibold py-2 px-4 rounded-md">Add Occupation</RouterLink>
        </div>
        <div class="overflow-x-auto">
            <table class="min-w-full table-auto rounded-lg overflow-hidden">
                <thead class="bg-sky-500/20">
                    <tr class="border-y text-xs uppercase text-sky-700">
                        <th class="px-4 py-3 text-left rounded-tl-lg">No.</th>
                        <th class="px-4 py-3 text-left">Occupation</th>
                        <th class="px-4 py-3 text-left">Supervisor</th>
                        <th class="px-4 py-3 text-left rounded-tr-lg">Action</th>
                    </tr>
                </thead>
                <tbody v-if="occupations && occupations.length > 0">
                    <tr class="hover:bg-sky-500/15 even:bg-sky-300/15" v-for="(occupation, index) in occupations" :key="occupation.id">
                        <td class="border-b px-4 py-2">{{ index + 1 }}</td>
                        <td class="border-b px-4 py-2 capitalize">{{ occupation.occupation }}</td>
                        <td class="border-b px-4 py-2">{{ occupation.supervisor }}</td>
                        <td class="border-b px-4 py-2 text-white">
                            <div class="flex gap-x-1 text-sm">
                                <RouterLink :to="'/occupationedit/' + occupation.id" class="bg-sky-500 transition-all duration-300 hover:bg-opacity-50 py-1 px-2 rounded"><i class='bx bxs-edit'></i></RouterLink>
                                <button @click="confirmDelete(occupation.id)" class="bg-red-500 transition-all duration-300 hover:bg-opacity-50 py-1 px-2 rounded"><i class='bx bxs-trash'></i></button>
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
    import { onMounted, ref } from 'vue';
    import axios from 'axios';
    import { RouterLink } from 'vue-router';
    import { useAuthStore } from "@/stores/auth";
    import Swal from 'sweetalert2';

    const authStore = useAuthStore();
    const occupations = ref([]);

    // Retrieving occupations data
    onMounted(async () => {
        try {
            const response = await axios.get('http://localhost:8000/api/occupations', {
                headers: {
                    Authorization: `Bearer ${authStore.accessToken}`,
                },
            });
            occupations.value = response.data.data;
        } catch (error) {
            console.error('Failed to fetch occupations:', error);
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Failed to load occupation data!',
            });
        }
    });

    // Delete data confirmation
    const confirmDelete = (id) => {
        Swal.fire({
            title: 'Are you sure?',
            text: 'You will not be able to recover this occupation data!',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, delete it!'
        }).then((result) => {
            if (result.isConfirmed) {
                deleteOccupation(id);
            }
        });
    };

    // Deleting data
    const deleteOccupation = async (id) => {
        try {
            await axios.delete(`http://localhost:8000/api/occupations/${id}`, {
                headers: {
                    Authorization: `Bearer ${authStore.accessToken}`,
                },
            });
            occupations.value = occupations.value.filter(occupation => occupation.id !== id);
            Swal.fire(
                'Deleted!',
                'Occupation data successfully deleted.',
                'success'
            );
        } catch (error) {
            console.error('Failed to delete occupation:', error);
            Swal.fire(
                'Failed!',
                'Something went wrong! Failed to delete the data.',
                'error'
            );
        }
    };
</script>
