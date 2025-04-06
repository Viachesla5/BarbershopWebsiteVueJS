<template>
    <div class="min-h-screen bg-gray-100">
        <!-- Navigation -->
        <nav class="bg-white shadow-lg">
            <div class="max-w-7xl mx-auto px-4">
                <div class="flex justify-between h-16">
                    <div class="flex">
                        <!-- Logo -->
                        <div class="flex-shrink-0 flex items-center">
                            <router-link to="/" class="text-xl font-bold text-gray-800">
                                Barbershop
                            </router-link>
                        </div>
                        <!-- Navigation Links -->
                        <div class="hidden sm:ml-6 sm:flex sm:space-x-8">
                            <router-link
                                to="/"
                                class="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
                            >
                                Home
                            </router-link>
                            <router-link
                                to="/hairdressers"
                                class="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
                            >
                                Hairdressers
                            </router-link>
                            <router-link
                                v-if="isAuthenticated"
                                to="/appointments"
                                class="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
                            >
                                Appointments
                            </router-link>
                            <router-link
                                v-if="isAdmin"
                                to="/admin"
                                class="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
                            >
                                Admin
                            </router-link>
                        </div>
                    </div>
                    <!-- Right side menu -->
                    <div class="hidden sm:ml-6 sm:flex sm:items-center">
                        <div class="ml-3 relative">
                            <div v-if="isAuthenticated" class="flex items-center space-x-4">
                                <router-link
                                    to="/profile"
                                    class="text-gray-500 hover:text-gray-700 px-3 py-2 rounded-md text-sm font-medium"
                                >
                                    Profile
                                </router-link>
                                <button
                                    @click="logout"
                                    class="text-gray-500 hover:text-gray-700 px-3 py-2 rounded-md text-sm font-medium"
                                >
                                    Logout
                                </button>
                            </div>
                            <div v-else class="flex items-center space-x-4">
                                <router-link
                                    to="/login"
                                    class="text-gray-500 hover:text-gray-700 px-3 py-2 rounded-md text-sm font-medium"
                                >
                                    Login
                                </router-link>
                                <router-link
                                    to="/register"
                                    class="bg-blue-500 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-600"
                                >
                                    Register
                                </router-link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </nav>

        <!-- Page Content -->
        <main class="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
            <router-view />
        </main>
    </div>
</template>

<script>
import { computed } from 'vue';
import { useStore } from 'vuex';
import { useRouter } from 'vue-router';

export default {
    name: 'AppLayout',
    setup() {
        const store = useStore();
        const router = useRouter();

        const isAuthenticated = computed(() => store.getters['auth/isAuthenticated']);
        const currentUser = computed(() => store.getters['auth/currentUser']);
        const isAdmin = computed(() => currentUser.value?.is_admin);

        const logout = async () => {
            try {
                await store.dispatch('auth/logout');
                router.push('/login');
            } catch (error) {
                console.error('Logout failed:', error);
            }
        };

        return {
            isAuthenticated,
            isAdmin,
            logout
        };
    }
};
</script> 