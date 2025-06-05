// lib/permissions.js

// resources
export const Resources = {
    DASHBOARD: 'dashboard',
    ORDERS: 'orders',
    CUSTOMERS: 'customers',
    NOTIFICATIONS: 'notifications',
    CATEGORIES: 'categories',
    PRODUCTS: 'products',
    PRODUCT_GROUPS: 'product-groups',
    MEDIA: 'media',
    USERS: 'users',
    SETTINGS: 'settings',
    POLICIES: 'policies',
    ABOUT_US: 'about-us',
    CONTACT_US: 'contact-us',
};


// possible actions
export const Actions = {
    VIEW: 'view',
    ADD: 'add',
    EDIT: 'edit',
    DELETE: 'delete',
};

// Frontend helper to check permissions against session.user
export function checkPermission(user, resource, action) {
    if (!user) return false;
    if (user.role === 'admin') return true;
    if (user.role === 'sub-admin') {
        const perms = user.permissions?.[resource];
        return !!perms?.[action];
    }
    return false;
}

export function onlyAdminPermission(user) {
    if (user?.role === 'admin') return true;
    return false;
}