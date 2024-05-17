<template>
  <div>
    <!-- Header -->
    <header v-if="authStore.isLoggedIn" class="sticky top-0 bg-white z-40 shadow-lg pe-5">
      <div class="flex justify-between h-16 items-center">
        <div class="bg-sky-500 text-white flex h-full w-64 items-center justify-between ps-5 relative">
          <h1 class="text-2xl font-bold">LaborLog</h1>
          <!-- Sidebar toggle -->
          <button @click="toggleAside" class="text-white bg-sky-500 w-10 aspect-square text-lg rounded-full absolute -right-5">
            <i class='bx bx-menu'></i>
          </button>
        </div>
        <!-- Retrieving name of the authenticated user -->
        <h2 class="capitalize" v-if="authStore.user && authStore.user.data && authStore.user.data.name">
          Welcome, <b>{{ authStore.user.data.name }}</b> 👋
        </h2>
      </div>
    </header>
    <!-- End of header -->

    <!-- Sidebar -->
    <aside v-if="authStore.isLoggedIn" :class="asideClasses" class="bg-sky-500 fixed w-64 h-full transition-transform duration-300">
      <div class="pt-2 flex flex-col justify-start gap-y-1">
        <RouterLink to="/" :class="{ 'bg-sky-400': route.path === '/' }" class="text-white font-semibold mx-3 px-3 py-3 rounded-md hover:bg-sky-400">
          Dashboard
        </RouterLink>

        <!-- Protected navigation menu only for admin -->
        <RouterLink v-if="admin" to="/userlist" :class="{ 'bg-sky-400': route.path === '/userlist' || route.path === '/usercreate' }" class="text-white font-semibold mx-3 px-3 py-3 rounded-md hover:bg-sky-400">
          Students
        </RouterLink>
        <RouterLink v-if="admin" to="/occupationlist" :class="{ 'bg-sky-400': route.path === '/occupationlist' || route.path === '/occupationcreate' }" class="text-white font-semibold mx-3 px-3 py-3 rounded-md hover:bg-sky-400">
          Occupations
        </RouterLink>
        <RouterLink v-if="admin" to="/salarylist" :class="{ 'bg-sky-400': route.path === '/salarylist' || route.path === '/salarycreate' }" class="text-white font-semibold mx-3 px-3 py-3 rounded-md hover:bg-sky-400">
          Salaries
        </RouterLink>
        <RouterLink v-if="admin" to="/tasklist" :class="{ 'bg-sky-400': route.path === '/tasklist' || route.path === '/taskcreate' }" class="text-white font-semibold mx-3 px-3 py-3 rounded-md hover:bg-sky-400">
          Tasks
        </RouterLink>
        <!-- End of Protected navigation menu only for admin -->

        <RouterLink to="/orderlist" :class="{ 'bg-sky-400': route.path === '/orderlist' || route.path === '/ordercreate' }" class="text-white font-semibold mx-3 px-3 py-3 rounded-md hover:bg-sky-400">
          Orders
        </RouterLink>
        <button @click="logout" class="text-start text-white font-semibold mx-3 px-3 py-3 rounded-md hover:bg-sky-400">
          Logout
        </button>
      </div>
    </aside>
    <!-- End of sidebar -->

    <!-- Components content -->
    <div class="px-5 py-8 transition-all duration-300 ease-in-out" :class="{ 'ml-64': isAsideOpen, 'ml-0': !isAsideOpen }">
      <RouterView />
    </div>
    <!-- End of components content -->
  </div>
</template>

<script setup>
  import { ref, computed } from 'vue';
  import { RouterLink, RouterView } from "vue-router";
  import { useRoute, useRouter } from 'vue-router';
  import { useAuthStore } from "@/stores/auth";
  import Swal from 'sweetalert2';

  const authStore = useAuthStore();
  const isAsideOpen = ref(true); // Set the sidebar default as open

  const router = useRouter();
  const route = useRoute();

  // Define the user roles = 1 as Admin
  const admin = computed(() => {
    return authStore.user && authStore.user.data && authStore.user.data.roles === 1;
  });

  // Define the navigation toggle
  const toggleAside = () => {
    isAsideOpen.value = !isAsideOpen.value;
  };

  // Define the condition of sidebar if open or not
  const asideClasses = computed(() => [
    isAsideOpen.value ? "translate-x-0" : "-translate-x-full"
  ]);

  // Logout confirmation with sweet alert
  const logout = () => {
    Swal.fire({
      title: 'Confirm Logout?',
      text: "You will be logged out of your account.",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, log out!'
    }).then((result) => {
      if (result.isConfirmed) {
        authStore.logout();
        Swal.fire({
          title: 'Logged Out',
          text: 'Logout successfully!',
          icon: 'success',
          timer: 2000,
          timerProgressBar: true,
          didClose: () => {
            router.push({ name: "login" });
          }
        });
      }
    });
  };
</script>
