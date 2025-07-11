import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';
import { toast } from 'react-hot-toast';
import { Actions, checkPermission, onlyAdminPermission, Resources } from '@/lib/permissions';
import { useAuthStore } from '@/store/useAuthStore';

export const useUsers = () => {
    // export const useUsers = ({ role, page = 1, pageSize = 10 }) => {
    // const { data: session } = useSession();
    // const user = session?.user
    const { user } = useAuthStore()
    const queryClient = useQueryClient();

    const canView = checkPermission(user, Resources.USERS, Actions.VIEW)
    const canAdd = checkPermission(user, Resources.USERS, Actions.ADD)
    const canEdit = checkPermission(user, Resources.USERS, Actions.EDIT)
    const canDelete = checkPermission(user, Resources.USERS, Actions.DELETE)
    const onlyAdmin = onlyAdminPermission(user)

    // // Get all users
    const usersQuery = ({ role = "user", page = 1, limit = 10 }) => useQuery({
        queryKey: ['users', role, page, limit],
        queryFn: () => api.get(`/users/all/paginated?role=${role}&page=${page}&limit=${limit}`).then(res => res.data),
        keepPreviousData: true,
        enabled: canView,
        staleTime: 1000 * 60 * 5,
        onError: (err) => {
            toast.error(err.message || 'Failed to fetch users');
        },
        onSettled: () => {
            queryClient.invalidateQueries(['users']);
        }
    });

    // Get all employees
    const employeesQuery = ({ role, page, limit }) => useQuery({
        queryKey: ['employees', role, page, limit],
        queryFn: () => api.get(`/users/all/paginated?role=${role}&page=${page}&limit=${limit}`).then(res => res.data),
        keepPreviousData: true,
        enabled: canView,
        staleTime: 1000 * 60 * 5,
        onError: (err) => {
            toast.error(err.message || 'Failed to fetch employees');
        },
        onSettled: () => {
            queryClient.invalidateQueries(['employees']);
        }
    });

    // Create User mutation
    const createUser = useMutation({
        mutationFn: (data) => api.post('/users/createUser', data),
        enabled: canAdd,
        onSuccess: () => {
            queryClient.invalidateQueries(['users']);
            toast.success('User created successfully');
        },
        onError: (err) => {
            toast.error(err.message || 'Failed to create User');
        }
    });

    // // Update User mutation
    const updateUser = useMutation({
        mutationFn: ({ id, data }) => api.put(`/users/employees/${id}`, data),
        enabled: canEdit,
        onSuccess: () => {
            queryClient.invalidateQueries(['users']);
            toast.success('User updated successfully');
        },
        onError: (err) => {
            toast.error(err.message || 'Failed to update User');
        }
    });

    // // Delete User mutation
    const deleteUser = useMutation({
        mutationFn: (id) => api.delete(`/users/employees/${id}`),
        enabled: canDelete,
        onSuccess: () => {
            queryClient.invalidateQueries(['users']);
            toast.success('User deleted successfully');
        },
        onError: (err) => {
            toast.error(err.message || 'Failed to delete User');
        }
    });

    // // change password
    // const changePassword = useMutation({
    //     mutationFn: ({ id, currentPassword, newPassword, confirmNewPassword }) =>
    //         api.patch(`/users/${id}/password`, { currentPassword, newPassword, confirmNewPassword }),
    //     enabled: onlyAdmin,
    //     onSuccess: () => {
    //         toast.success('Password changed successfully');
    //     },
    //     onError: err => {
    //         toast.error(err.response?.data?.message || 'Failed to change password');
    //     }
    // });

    // Create User mutation
    const createCustomer = useMutation({
        mutationFn: (data) => api.post('/users/createCustomer', data),
        enabled: canAdd,
        onSuccess: () => {
            queryClient.invalidateQueries(['users']);
            toast.success('Customer created successfully');
        },
        onError: (err) => {
            toast.error(err.message || 'Failed to create customer');
        }
    });

    return {
        usersQuery,
        createUser,
        updateUser,
        deleteUser,
        employeesQuery,
        // changePassword,
        createCustomer,
        permissions: {
            canView,
            canAdd,
            canDelete,
            canEdit,
            onlyAdmin
        }
    };
};
