<template>
    <div class="bg-white">
        <div class="max-w-7xl mx-auto py-16 px-4 sm:py-24 sm:px-6 lg:px-8">
            <div v-if="loading" class="text-center">
                <div class="inline-block animate-spin rounded-full h-8 w-8 border-4 border-blue-500 border-t-transparent"></div>
            </div>

            <div v-else-if="hairdresser" class="lg:grid lg:grid-cols-2 lg:gap-8">
                <!-- Hairdresser info -->
                <div>
                    <div class="flex items-center">
                        <div class="flex-shrink-0">
                            <img
                                class="h-32 w-32 rounded-full"
                                :src="hairdresser.profile_picture"
                                :alt="hairdresser.name"
                            />
                        </div>
                        <div class="ml-6">
                            <h1 class="text-3xl font-extrabold text-gray-900">
                                {{ hairdresser.name }}
                            </h1>
                            <p class="mt-2 text-lg text-gray-500">
                                {{ hairdresser.specialization }}
                            </p>
                        </div>
                    </div>

                    <div class="mt-8">
                        <h2 class="text-xl font-bold text-gray-900">About</h2>
                        <p class="mt-4 text-gray-500">
                            {{ hairdresser.description }}
                        </p>
                    </div>

                    <div class="mt-8">
                        <h2 class="text-xl font-bold text-gray-900">Contact Information</h2>
                        <div class="mt-4">
                            <p class="text-gray-500">
                                <span class="font-medium">Email:</span> {{ hairdresser.email }}
                            </p>
                            <p class="mt-2 text-gray-500">
                                <span class="font-medium">Phone:</span> {{ hairdresser.phone_number }}
                            </p>
                            <p class="mt-2 text-gray-500">
                                <span class="font-medium">Address:</span> {{ hairdresser.address }}
                            </p>
                        </div>
                    </div>
                </div>

                <!-- Appointment booking -->
                <div class="mt-12 lg:mt-0">
                    <div class="bg-gray-50 rounded-lg p-6">
                        <h2 class="text-xl font-bold text-gray-900">Book an Appointment</h2>
                        
                        <form @submit.prevent="handleSubmit" class="mt-6 space-y-6">
                            <div>
                                <label for="date" class="block text-sm font-medium text-gray-700">
                                    Date
                                </label>
                                <input
                                    type="date"
                                    id="date"
                                    v-model="form.date"
                                    :min="minDate"
                                    required
                                    class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                                />
                            </div>

                            <div>
                                <label for="time" class="block text-sm font-medium text-gray-700">
                                    Time
                                </label>
                                <select
                                    id="time"
                                    v-model="form.time"
                                    required
                                    class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                                >
                                    <option value="">Select a time</option>
                                    <option v-for="time in availableTimes" :key="time" :value="time">
                                        {{ time }}
                                    </option>
                                </select>
                            </div>

                            <div>
                                <label for="service" class="block text-sm font-medium text-gray-700">
                                    Service
                                </label>
                                <select
                                    id="service"
                                    v-model="form.service"
                                    required
                                    class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                                >
                                    <option value="">Select a service</option>
                                    <option v-for="service in services" :key="service.id" :value="service.id">
                                        {{ service.name }} (€{{ service.price }})
                                    </option>
                                </select>
                            </div>

                            <div v-if="error" class="text-red-500 text-sm">
                                {{ error }}
                            </div>

                            <div>
                                <button
                                    type="submit"
                                    :disabled="loading"
                                    class="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                                >
                                    <span v-if="loading">Booking...</span>
                                    <span v-else>Book Appointment</span>
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>

            <div v-else class="text-center">
                <p class="text-gray-500">Hairdresser not found.</p>
            </div>
        </div>
    </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useStore } from 'vuex';
import { hairdresserService, appointmentService } from '@/services/api';

export default {
    name: 'HairdresserDetail',
    setup() {
        const store = useStore();
        const route = useRoute();
        const router = useRouter();
        const hairdresser = ref(null);
        const loading = ref(false);
        const error = ref('');
        const form = ref({
            date: '',
            time: '',
            service: ''
        });

        const services = ref([
            {
                id: 1,
                name: 'Haircut',
                price: 25
            },
            {
                id: 2,
                name: 'Beard Trim',
                price: 15
            },
            {
                id: 3,
                name: 'Hair Coloring',
                price: 45
            }
        ]);

        const availableTimes = ref([
            '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00'
        ]);

        const minDate = computed(() => {
            const today = new Date();
            return today.toISOString().split('T')[0];
        });

        const fetchHairdresser = async () => {
            loading.value = true;
            try {
                const response = await hairdresserService.getById(route.params.id);
                hairdresser.value = response.data;
            } catch (error) {
                console.error('Error fetching hairdresser:', error);
            } finally {
                loading.value = false;
            }
        };

        const handleSubmit = async () => {
            if (!store.getters['auth/isAuthenticated']) {
                router.push({ name: 'Login', query: { redirect: route.fullPath } });
                return;
            }

            loading.value = true;
            error.value = '';

            try {
                await appointmentService.create({
                    hairdresser_id: hairdresser.value.id,
                    appointment_date: form.value.date,
                    appointment_time: form.value.time,
                    service_id: form.value.service
                });

                router.push({ name: 'Appointments' });
            } catch (err) {
                error.value = err.response?.data?.message || 'Failed to book appointment. Please try again.';
            } finally {
                loading.value = false;
            }
        };

        onMounted(fetchHairdresser);

        return {
            hairdresser,
            loading,
            error,
            form,
            services,
            availableTimes,
            minDate,
            handleSubmit
        };
    }
};
</script> 