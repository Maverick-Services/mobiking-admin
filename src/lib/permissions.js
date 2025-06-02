// lib/permissions.js

// Define resources
export const Resources = {
    MEDIA: 'media',
    SERVICES: 'services',
    BLOGS: 'blogs',
    CATEGORIES: 'categories',
    TAGS: 'tags',
    USERS: 'users',
    SETTINGS: 'settings',
    ENQUIRIES: 'enquiries'
};

// Define possible actions
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

// Add this permission check function
function hasPermission(permissions, resource, action) {
    if (!permissions) return false;
    const resourcePerms = permissions[resource];
    return resourcePerms?.[action];
}

// export async function requirePermissionApi(req, resource, action) {
//     try {
//         // ⚠️ Fix: Use headers() and cookies() when calling getServerSession
//         const session = await getServerSession({ headers: headers(), cookies: cookies() }, authOptions);

//         if (!session?.user) {
//             return Response.json({ error: "Unauthorized" }, { status: 401 });
//         }

//         if (session.user.role === 'admin') return null;

//         if (session.user.role === 'sub-admin') {
//             if (hasPermission(session.user.permissions, resource, action)) {
//                 return null;
//             }
//         }

//         return Response.json({ error: "Forbidden" }, { status: 403 });
//     } catch (error) {
//         console.error('Permission Error:', error);
//         return Response.json(
//             { error: "Internal Server Error" },
//             { status: 500 }
//         );
//     }
// }

export function onlyAdminPermission(user) {
    if (user?.role === 'admin') return true;
    return false;
}