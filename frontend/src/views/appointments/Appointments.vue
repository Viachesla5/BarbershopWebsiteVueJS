<template>
    <div class="bg-white">
        <div class="max-w-7xl mx-auto py-16 px-4 sm:py-24 sm:px-6 lg:px-8">
            <div class="text-center">
                <h2 class="text-3xl font-extrabold text-gray-900 sm:text-4xl">
                    My Appointments
                </h2>
                <p class="mt-4 text-lg text-gray-500">
                    Manage your upcoming and past appointments
                </p>
            </div>

            <!-- Filter tabs -->
            <div class="mt-8 border-b border-gray-200">
                <nav class="-mb-px flex space-x-8">
                    <button
                        v-for="tab in tabs"
                        :key="tab.name"
                        @click="selectedTab = tab.name"
                        :class="[
                            selectedTab === tab.name
                                ? 'border-blue-500 text-blue-600'
                                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300',
                            'whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm'
                        ]"
                    >
                        {{ tab.label }}
                    </button>
                </nav>
            </div>

            <!-- Appointments list -->
            <div class="mt-8">
                <div v-if="loading" class="text-center">
                    <div class="inline-block animate-spin rounded-full h-8 w-8 border-4 border-blue-500 border-t-transparent"></div>
                </div>

                <div v-else-if="filteredAppointments.length === 0" class="text-center">
                    <p class="text-gray-500">No appointments found.</p>
                </div>

                <div v-else class="space-y-6">
                    <div
                        v-for="appointment in filteredAppointments"
                        :key="appointment.id"
                        class="bg-white shadow overflow-hidden sm:rounded-lg"
                    >
                        <div class="px-4 py-5 sm:px-6">
                            <div class="flex justify-between">
                                <div>
                                    <h3 class="text-lg leading-6 font-medium text-gray-900">
                                        {{ formatDate(appointment.appointment_date) }} at {{ appointment.appointment_time }}
                                    </h3>
                                    <p class="mt-1 max-w-2xl text-sm text-gray-500">
                                        with {{ appointment.hairdresser.name }}
                                    </p>
                                </div>
                                <div class="flex items-center space-x-4">
                                    <span
                                        :class="[
                                            appointment.status === 'upcoming' ? 'bg-green-100 text-green-800' :
                                            appointment.status === 'completed' ? 'bg-gray-100 text-gray-800' :
                                            'bg-red-100 text-red-800',
                                            'px-2 inline-flex text-xs leading-5 font-semibold rounded-full'
                                        ]"
                                    >
                                        {{ appointment.status }}
                                    </span>
                                    <button
                                        v-if="appointment.status === 'upcoming'"
                                        @click="cancelAppointment(appointment.id)"
                                        class="text-red-600 hover:text-red-900"
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </div>
                        </div>
                        <div class="border-t border-gray-200 px-4 py-5 sm:px-6">
                            <dl class="grid grid-cols-1 gap-x-4 gap-y-8 sm:grid-cols-2">
                                <div class="sm:col-span-1">
                                    <dt class="text-sm font-medium text-gray-500">
                                        Service
                                    </dt>
                                    <dd class="mt-1 text-sm text-gray-900">
                                        {{ appointment.service.name }}
                                    </dd>
                                </div>
                                <div class="sm:col-span-1">
                                    <dt class="text-sm font-medium text-gray-500">
                                        Price
                                    </dt>
                                    <dd class="mt-1 text-sm text-gray-900">
                                        €{{ appointment.service.price }}
                                    </dd>
                                </div>
                            </dl>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue';
import { useStore } from 'vuex';
import { appointmentService } from '@/services/api';

export default {
    name: 'Appointments',
    setup() {
        const store = useStore();
        const appointments = ref([]);
        const loading = ref(false);
        const selectedTab = ref('upcoming');

        const tabs = [
            { name: 'upcoming', label: 'Upcoming' },
            { name: 'completed', label: 'Completed' },
            { name: 'cancelled', label: 'Cancelled' }
        ];

        const filteredAppointments = computed(() => {
            return appointments.value.filter(appointment => appointment.status === selectedTab.value);
        });

        const formatDate = (dateString) => {
            const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
            return new Date(dateString).toLocaleDateString(undefined, options);
        };

        const fetchAppointments = async () => {
            loading.value = true;
            try {
                const response = await appointmentService.getAll();
                appointments.value = response.data;
            } catch (error) {
                console.error('Error fetching appointments:', error);
            } finally {
                loading.value = false;
            }
        };

        const cancelAppointment = async (appointmentId) => {
            if (!confirm('Are you sure you want to cancel this appointment?')) {
                return;
            }

            try {
                await appointmentService.update(appointmentId, { status: 'cancelled' });
                await fetchAppointments();
            } catch (error) {
                console.error('Error cancelling appointment:', error);
            }
        };

        onMounted(fetchAppointments);

        return {
            appointments,
            loading,
            selectedTab,
            tabs,
            filteredAppointments,
            formatDate,
            cancelAppointment
        };
    }
};
</script> 