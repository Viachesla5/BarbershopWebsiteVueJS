<template>
    <div class="bg-white">
        <div class="max-w-7xl mx-auto py-16 px-4 sm:py-24 sm:px-6 lg:px-8">
            <div class="text-center">
                <h2 class="text-3xl font-extrabold text-gray-900 sm:text-4xl">
                    Our Hairdressers
                </h2>
                <p class="mt-4 text-lg text-gray-500">
                    Find the perfect hairdresser for your needs
                </p>
            </div>

            <!-- Search and filter -->
            <div class="mt-8 max-w-3xl mx-auto">
                <div class="flex flex-col sm:flex-row gap-4">
                    <div class="flex-1">
                        <input
                            v-model="searchQuery"
                            type="text"
                            placeholder="Search hairdressers..."
                            class="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                        />
                    </div>
                    <div class="flex-1">
                        <select
                            v-model="selectedSpecialization"
                            class="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                        >
                            <option value="">All Specializations</option>
                            <option v-for="spec in specializations" :key="spec" :value="spec">
                                {{ spec }}
                            </option>
                        </select>
                    </div>
                </div>
            </div>

            <!-- Hairdressers grid -->
            <div class="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
                <div
                    v-for="hairdresser in filteredHairdressers"
                    :key="hairdresser.id"
                    class="bg-white overflow-hidden shadow rounded-lg"
                >
                    <div class="p-6">
                        <div class="flex items-center">
                            <div class="flex-shrink-0">
                                <img
                                    class="h-16 w-16 rounded-full"
                                    :src="hairdresser.profile_picture"
                                    :alt="hairdresser.name"
                                />
                            </div>
                            <div class="ml-4">
                                <h3 class="text-lg font-medium text-gray-900">
                                    {{ hairdresser.name }}
                                </h3>
                                <p class="text-sm text-gray-500">
                                    {{ hairdresser.specialization }}
                                </p>
                            </div>
                        </div>
                        <div class="mt-4">
                            <p class="text-sm text-gray-500">
                                {{ hairdresser.description }}
                            </p>
                        </div>
                        <div class="mt-6 flex justify-between">
                            <router-link
                                :to="`/hairdressers/${hairdresser.id}`"
                                class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                            >
                                View Profile
                            </router-link>
                            <button
                                v-if="isAuthenticated"
                                @click="bookAppointment(hairdresser)"
                                class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-blue-700 bg-blue-100 hover:bg-blue-200"
                            >
                                Book Appointment
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Loading state -->
            <div v-if="loading" class="text-center mt-8">
                <div class="inline-block animate-spin rounded-full h-8 w-8 border-4 border-blue-500 border-t-transparent"></div>
            </div>

            <!-- No results -->
            <div v-if="!loading && filteredHairdressers.length === 0" class="text-center mt-8">
                <p class="text-gray-500">No hairdressers found matching your criteria.</p>
            </div>
        </div>
    </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue';
import { useStore } from 'vuex';
import { useRouter } from 'vue-router';
import { hairdresserService } from '@/services/api';

export default {
    name: 'Hairdressers',
    setup() {
        const store = useStore();
        const router = useRouter();
        const hairdressers = ref([]);
        const loading = ref(false);
        const searchQuery = ref('');
        const selectedSpecialization = ref('');
        const specializations = ref([]);

        const isAuthenticated = computed(() => store.getters['auth/isAuthenticated']);

        const filteredHairdressers = computed(() => {
            return hairdressers.value.filter(hairdresser => {
                const matchesSearch = hairdresser.name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
                                    hairdresser.specialization.toLowerCase().includes(searchQuery.value.toLowerCase());
                const matchesSpecialization = !selectedSpecialization.value ||
                                           hairdresser.specialization === selectedSpecialization.value;
                return matchesSearch && matchesSpecialization;
            });
        });

        const fetchHairdressers = async () => {
            loading.value = true;
            try {
                const response = await hairdresserService.getAll();
                hairdressers.value = response.data;
                // Extract unique specializations
                specializations.value = [...new Set(response.data.map(h => h.specialization))];
            } catch (error) {
                console.error('Error fetching hairdressers:', error);
            } finally {
                loading.value = false;
            }
        };

        const bookAppointment = (hairdresser) => {
            router.push({
                name: 'Appointments',
                query: { hairdresser: hairdresser.id }
            });
        };

        onMounted(fetchHairdressers);

        return {
            hairdressers,
            loading,
            searchQuery,
            selectedSpecialization,
            specializations,
            filteredHairdressers,
            isAuthenticated,
            bookAppointment
        };
    }
};
</script> 