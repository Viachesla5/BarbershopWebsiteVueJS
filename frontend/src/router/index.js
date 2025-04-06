import { createRouter, createWebHistory } from "vue-router";
import store from '@/store';

// Views
import Home from '@/views/Home.vue';
import Hairdressers from '@/views/hairdressers/Hairdressers.vue';
import HairdresserDetail from '@/views/hairdressers/HairdresserDetail.vue';
import Appointments from '@/views/appointments/Appointments.vue';
import Profile from '@/views/profile/Profile.vue';
import AdminDashboard from '@/views/admin/Dashboard.vue';
import Login from '@/views/auth/Login.vue';
import Register from '@/views/auth/Register.vue';

const routes = [
  {
    path: "/",
    name: "Home",
    component: Home
  },
  {
    path: "/login",
    name: "Login",
    component: Login,
    meta: { guest: true }
  },
  {
    path: "/register",
    name: "Register",
    component: Register,
    meta: { guest: true }
  },
  {
    path: "/profile",
    name: "Profile",
    component: Profile,
    meta: { requiresAuth: true }
  },
  {
    path: "/appointments",
    name: "Appointments",
    component: Appointments,
    meta: { requiresAuth: true }
  },
  {
    path: "/hairdressers",
    name: "Hairdressers",
    component: Hairdressers
  },
  {
    path: "/hairdressers/:id",
    name: "HairdresserDetail",
    component: HairdresserDetail,
    props: true
  },
  {
    path: "/admin",
    name: "AdminDashboard",
    component: AdminDashboard,
    meta: { requiresAuth: true, requiresAdmin: true }
  }
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
});

router.beforeEach((to, from, next) => {
  const isAuthenticated = store.getters['auth/isAuthenticated'];
  const isAdmin = store.getters['auth/isAdmin'];

  // Routes that require authentication
  if (to.matched.some(record => record.meta.requiresAuth)) {
    if (!isAuthenticated) {
      next({
        path: '/login',
        query: { redirect: to.fullPath }
      });
      return;
    }

    // Check for admin routes
    if (to.matched.some(record => record.meta.requiresAdmin) && !isAdmin) {
      next({ path: '/' });
      return;
    }
  }

  // Routes for guests only (login, register)
  if (to.matched.some(record => record.meta.guest) && isAuthenticated) {
    next({ path: '/' });
    return;
  }

  next();
});

export default router;
