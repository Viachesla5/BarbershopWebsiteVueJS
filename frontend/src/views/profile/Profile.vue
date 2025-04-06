<template>
    <div class="bg-white">
        <div class="max-w-7xl mx-auto py-16 px-4 sm:py-24 sm:px-6 lg:px-8">
            <div class="text-center">
                <h2 class="text-3xl font-extrabold text-gray-900 sm:text-4xl">
                    My Profile
                </h2>
                <p class="mt-4 text-lg text-gray-500">
                    Manage your account information
                </p>
            </div>

            <div class="mt-12 max-w-3xl mx-auto">
                <div class="bg-white shadow overflow-hidden sm:rounded-lg">
                    <div class="px-4 py-5 sm:px-6">
                        <div class="flex items-center">
                            <div class="flex-shrink-0">
                                <img
                                    class="h-16 w-16 rounded-full"
                                    :src="user.profile_picture || '/default-avatar.png'"
                                    alt="Profile picture"
                                />
                            </div>
                            <div class="ml-4">
                                <h3 class="text-lg leading-6 font-medium text-gray-900">
                                    {{ user.username }}
                                </h3>
                                <p class="mt-1 max-w-2xl text-sm text-gray-500">
                                    {{ user.email }}
                                </p>
                            </div>
                        </div>
                    </div>

                    <div class="border-t border-gray-200 px-4 py-5 sm:px-6">
                        <form @submit.prevent="handleSubmit" class="space-y-6">
                            <div>
                                <label for="username" class="block text-sm font-medium text-gray-700">
                                    Username
                                </label>
                                <input
                                    type="text"
                                    id="username"
                                    v-model="form.username"
                                    class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                                />
                            </div>

                            <div>
                                <label for="email" class="block text-sm font-medium text-gray-700">
                                    Email
                                </label>
                                <input
                                    type="email"
                                    id="email"
                                    v-model="form.email"
                                    class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                                />
                            </div>

                            <div>
                                <label for="phone_number" class="block text-sm font-medium text-gray-700">
                                    Phone Number
                                </label>
                                <input
                                    type="tel"
                                    id="phone_number"
                                    v-model="form.phone_number"
                                    class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                                />
                            </div>

                            <div>
                                <label for="address" class="block text-sm font-medium text-gray-700">
                                    Address
                                </label>
                                <textarea
                                    id="address"
                                    v-model="form.address"
                                    rows="3"
                                    class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                                ></textarea>
                            </div>

                            <div>
                                <label for="profile_picture" class="block text-sm font-medium text-gray-700">
                                    Profile Picture
                                </label>
                                <input
                                    type="file"
                                    id="profile_picture"
                                    @change="handleFileChange"
                                    accept="image/*"
                                    class="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                                />
                            </div>

                            <div class="border-t border-gray-200 pt-5">
                                <h3 class="text-lg font-medium text-gray-900">
                                    Change Password
                                </h3>
                                <div class="mt-4 space-y-6">
                                    <div>
                                        <label for="current_password" class="block text-sm font-medium text-gray-700">
                                            Current Password
                                        </label>
                                        <input
                                            type="password"
                                            id="current_password"
                                            v-model="form.current_password"
                                            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                                        />
                                    </div>

                                    <div>
                                        <label for="new_password" class="block text-sm font-medium text-gray-700">
                                            New Password
                                        </label>
                                        <input
                                            type="password"
                                            id="new_password"
                                            v-model="form.new_password"
                                            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                                        />
                                    </div>

                                    <div>
                                        <label for="new_password_confirmation" class="block text-sm font-medium text-gray-700">
                                            Confirm New Password
                                        </label>
                                        <input
                                            type="password"
                                            id="new_password_confirmation"
                                            v-model="form.new_password_confirmation"
                                            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div v-if="error" class="text-red-500 text-sm">
                                {{ error }}
                            </div>

                            <div class="flex justify-end">
                                <button
                                    type="submit"
                                    :disabled="loading"
                                    class="ml-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                                >
                                    <span v-if="loading">Saving...</span>
                                    <span v-else>Save Changes</span>
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { ref, onMounted } from 'vue';
import { useStore } from 'vuex';
import { userService } from '@/services/api';

export default {
    name: 'Profile',
    setup() {
        const store = useStore();
        const user = ref({});
        const loading = ref(false);
        const error = ref('');
        const form = ref({
            username: '',
            email: '',
            phone_number: '',
            address: '',
            current_password: '',
            new_password: '',
            new_password_confirmation: ''
        });
        const profilePicture = ref(null);

        const fetchUser = async () => {
            try {
                const response = await userService.getProfile();
                user.value = response.data;
                form.value = {
                    username: response.data.username,
                    email: response.data.email,
                    phone_number: response.data.phone_number || '',
                    address: response.data.address || '',
                    current_password: '',
                    new_password: '',
                    new_password_confirmation: ''
                };
            } catch (error) {
                console.error('Error fetching user profile:', error);
            }
        };

        const handleFileChange = (event) => {
            profilePicture.value = event.target.files[0];
        };

        const handleSubmit = async () => {
            if (form.value.new_password && form.value.new_password !== form.value.new_password_confirmation) {
                error.value = 'New passwords do not match';
                return;
            }

            loading.value = true;
            error.value = '';

            try {
                const formData = new FormData();
                Object.keys(form.value).forEach(key => {
                    if (form.value[key]) {
                        formData.append(key, form.value[key]);
                    }
                });

                if (profilePicture.value) {
                    formData.append('profile_picture', profilePicture.value);
                }

                await userService.updateProfile(formData);
                await store.dispatch('auth/fetchUser');
                error.value = '';
            } catch (err) {
                error.value = err.response?.data?.message || 'Failed to update profile. Please try again.';
            } finally {
                loading.value = false;
            }
        };

        onMounted(fetchUser);

        return {
            user,
            loading,
            error,
            form,
            handleFileChange,
            handleSubmit
        };
    }
};
</script> 