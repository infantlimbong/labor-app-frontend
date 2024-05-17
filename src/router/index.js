import { createRouter, createWebHistory } from 'vue-router'

import Login from '@/components/Login.vue'

import Dashboard from '@/components/Dashboard.vue'

import User from '@/components/User.vue'
import UserCreate from '@/components/UserCreate.vue'
import UserEdit from '@/components/UserEdit.vue'

import Occupation from '@/components/Occupation.vue'
import OccupationCreate from '@/components/OccupationCreate.vue'
import OccupationEdit from '@/components/OccupationEdit.vue'

import Salary from '@/components/Salary.vue'
import SalaryCreate from '@/components/SalaryCreate.vue'
import SalaryEdit from '@/components/SalaryEdit.vue'

import Task from '@/components/Task.vue'
import TaskCreate from '@/components/TaskCreate.vue'
import TaskEdit from '@/components/TaskEdit.vue'

import Order from '@/components/Order.vue'
import OrderCreate from '@/components/OrderCreate.vue'
import OrderEdit from '@/components/OrderEdit.vue'

import { useAuthStore } from '@/stores/auth'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    // Login
    {
      path: '/login',
      name: 'login',
      component: Login
    },

    // Dashboard
    {
      path: '/',
      name: 'dashboard',
      component: Dashboard
    },

    // Admin & Students
    {
      path: '/userlist',
      name: 'userlist',
      component: User
    },
    {
      path: '/usercreate',
      name: 'usercreate',
      component: UserCreate
    },
    {
      path: '/useredit/:id',
      name: 'useredit',
      component: UserEdit
    },

    // Occupations
    {
      path: '/occupationlist',
      name: 'occupationlist',
      component: Occupation
    },
    {
      path: '/occupationcreate',
      name: 'occupationcreate',
      component: OccupationCreate
    },
    {
      path: '/occupationedit/:id',
      name: 'occupationedit',
      component: OccupationEdit
    },

    // Salaries
    {
      path: '/salarylist',
      name: 'salarylist',
      component: Salary
    },
    {
      path: '/salarycreate',
      name: 'salarycreate',
      component: SalaryCreate
    },
    {
      path: '/salaryedit/:id',
      name: 'salaryedit',
      component: SalaryEdit
    },

    // Tasks
    {
      path: '/tasklist',
      name: 'tasklist',
      component: Task
    },
    {
      path: '/taskcreate',
      name: 'taskcreate',
      component: TaskCreate
    },
    {
      path: '/taskedit/:id',
      name: 'taskedit',
      component: TaskEdit
    },
    
    // Tasks
    {
      path: '/orderlist',
      name: 'orderlist',
      component: Order
    },
    {
      path: '/ordercreate',
      name: 'ordercreate',
      component: OrderCreate
    },
    {
      path: '/orderedit/:id',
      name: 'orderedit',
      component: OrderEdit
    },
  ]
})

router.beforeEach((to, from, next) => {
  const authStore = useAuthStore();

  if (to.name !== 'login' && !authStore.isLoggedIn) {
    next({ name: 'login' });
  } else {
    next();
  }
});

export default router
