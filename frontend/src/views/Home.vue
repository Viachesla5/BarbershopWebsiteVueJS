<template>
    <div class="bg-white">
        <!-- Hero section -->
        <div class="relative bg-gray-900">
            <div class="absolute inset-0">
                <img
                    class="w-full h-full object-cover"
                    src="@/assets/images/hero-bg.jpg"
                    alt="Barbershop interior"
                />
                <div class="absolute inset-0 bg-gray-900 mix-blend-multiply" />
            </div>
            <div class="relative max-w-7xl mx-auto py-24 px-4 sm:py-32 sm:px-6 lg:px-8">
                <h1 class="text-4xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl">
                    Welcome to Our Barbershop
                </h1>
                <p class="mt-6 text-xl text-gray-300 max-w-3xl">
                    Experience the best haircuts and grooming services in town. Our professional hairdressers are ready to give you the perfect look.
                </p>
                <div class="mt-10">
                    <router-link
                        to="/hairdressers"
                        class="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                    >
                        Book an Appointment
                    </router-link>
                </div>
            </div>
        </div>

        <!-- Featured hairdressers -->
        <div class="max-w-7xl mx-auto py-16 px-4 sm:py-24 sm:px-6 lg:px-8">
            <div class="text-center">
                <h2 class="text-3xl font-extrabold text-gray-900 sm:text-4xl">
                    Our Professional Hairdressers
                </h2>
                <p class="mt-4 text-lg text-gray-500">
                    Meet our team of skilled professionals
                </p>
            </div>

            <div class="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
                <div v-for="hairdresser in featuredHairdressers" :key="hairdresser.id" class="bg-white overflow-hidden shadow rounded-lg">
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
                        <div class="mt-6">
                            <router-link
                                :to="`/hairdressers/${hairdresser.id}`"
                                class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                            >
                                View Profile
                            </router-link>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Services section -->
        <div class="bg-gray-50">
            <div class="max-w-7xl mx-auto py-16 px-4 sm:py-24 sm:px-6 lg:px-8">
                <div class="text-center">
                    <h2 class="text-3xl font-extrabold text-gray-900 sm:text-4xl">
                        Our Services
                    </h2>
                    <p class="mt-4 text-lg text-gray-500">
                        Professional grooming services for men and women
                    </p>
                </div>

                <div class="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
                    <div v-for="service in services" :key="service.id" class="bg-white overflow-hidden shadow rounded-lg">
                        <div class="p-6">
                            <h3 class="text-lg font-medium text-gray-900">
                                {{ service.name }}
                            </h3>
                            <p class="mt-2 text-sm text-gray-500">
                                {{ service.description }}
                            </p>
                            <p class="mt-4 text-lg font-medium text-gray-900">
                                €{{ service.price }}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { ref, onMounted } from 'vue';
import { hairdresserService } from '@/services/api';

export default {
    name: 'Home',
    setup() {
        const featuredHairdressers = ref([]);
        const services = ref([
            {
                id: 1,
                name: 'Haircut',
                description: 'Professional haircut with styling',
                price: 25
            },
            {
                id: 2,
                name: 'Beard Trim',
                description: 'Beard trimming and shaping',
                price: 15
            },
            {
                id: 3,
                name: 'Hair Coloring',
                description: 'Professional hair coloring service',
                price: 45
            }
        ]);

        onMounted(async () => {
            try {
                const response = await hairdresserService.getAll();
                featuredHairdressers.value = response.data.slice(0, 3);
            } catch (error) {
                console.error('Error fetching hairdressers:', error);
            }
        });

        return {
            featuredHairdressers,
            services
        };
    }
};
</script> 