<?php 
require(__DIR__ . '/../partials/header.php');
require_once(__DIR__ . '/../../lib/Security.php');
$security = Security::getInstance();
?>

<div class="container mx-auto mt-8 flex justify-center">
    <form action="/admin/hairdressers/create" method="POST" class="w-full max-w-md bg-dark-100 p-6 rounded shadow-lg border border-dark-50">
        <h2 class="text-2xl font-bold mb-6 text-center text-white">Create New Hairdresser</h2>

        <?php if (isset($errors) && !empty($errors)): ?>
            <div class="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
                <ul class="list-disc list-inside">
                    <?php foreach ($errors as $error): ?>
                        <li><?= htmlspecialchars($error); ?></li>
                    <?php endforeach; ?>
                </ul>
            </div>
        <?php endif; ?>

        <!-- CSRF Token -->
        <input type="hidden" name="csrf_token" value="<?= $security->generateCSRFToken(); ?>">

        <!-- Email -->
        <div class="mb-4">
            <label class="block mb-1 font-semibold text-gray-200" for="email">Email</label>
            <input 
                type="email"
                name="email"
                id="email"
                class="w-full bg-dark-200 text-white border border-dark-50 rounded px-3 py-2 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                required
                value="<?= htmlspecialchars($email ?? ''); ?>"
            >
            <p class="text-red-400 text-sm mt-1">Required</p>
        </div>

        <!-- Name -->
        <div class="mb-4">
            <label class="block mb-1 font-semibold text-gray-200" for="name">Name</label>
            <input
                type="text"
                name="name"
                id="name"
                class="w-full bg-dark-200 text-white border border-dark-50 rounded px-3 py-2 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                required
                value="<?= htmlspecialchars($name ?? ''); ?>"
            >
            <p class="text-red-400 text-sm mt-1">Required</p>
        </div>

        <!-- Password -->
        <div class="mb-4">
            <label class="block mb-1 font-semibold text-gray-200" for="password">Password</label>
            <input
                type="password"
                name="password"
                id="password"
                class="w-full bg-dark-200 text-white border border-dark-50 rounded px-3 py-2 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                required
            >
            <p class="text-red-400 text-sm mt-1">Required</p>
            <p class="text-gray-400 text-sm mt-1">Must be at least 8 characters long and contain uppercase, lowercase, number, and special character</p>
        </div>

        <!-- Confirm Password -->
        <div class="mb-4">
            <label class="block mb-1 font-semibold text-gray-200" for="confirm_password">Confirm Password</label>
            <input
                type="password"
                name="confirm_password"
                id="confirm_password"
                class="w-full bg-dark-200 text-white border border-dark-50 rounded px-3 py-2 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                required
            >
            <p class="text-red-400 text-sm mt-1">Required</p>
        </div>

        <!-- Specialization -->
        <div class="mb-4">
            <label class="block mb-1 font-semibold text-gray-200" for="specialization">Specialization</label>
            <input
                type="text"
                name="specialization"
                id="specialization"
                class="w-full bg-dark-200 text-white border border-dark-50 rounded px-3 py-2 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                required
                value="<?= htmlspecialchars($specialization ?? ''); ?>"
            >
            <p class="text-red-400 text-sm mt-1">Required</p>
        </div>

        <!-- Phone Number -->
        <div class="mb-4">
            <label class="block mb-1 font-semibold text-gray-200" for="phone_number">Phone Number</label>
            <input
                type="text"
                name="phone_number"
                id="phone_number"
                class="w-full bg-dark-200 text-white border border-dark-50 rounded px-3 py-2 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                value="<?= htmlspecialchars($phoneNumber ?? ''); ?>"
            >
            <p class="text-gray-400 text-sm mt-1">Optional</p>
        </div>

        <!-- Address -->
        <div class="mb-4">
            <label class="block mb-1 font-semibold text-gray-200" for="address">Address</label>
            <input
                type="text"
                name="address"
                id="address"
                class="w-full bg-dark-200 text-white border border-dark-50 rounded px-3 py-2 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                value="<?= htmlspecialchars($address ?? ''); ?>"
            >
            <p class="text-gray-400 text-sm mt-1">Optional</p>
        </div>

        <button type="submit" class="w-full bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition duration-200">
            Create Hairdresser
        </button>
    </form>
</div>

<?php require(__DIR__ . '/../partials/footer.php'); ?>
