import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';
import { toast } from 'react-hot-toast';
import { Actions, checkPermission, Resources } from '@/lib/permissions';
import { useAuthStore } from '@/store/useAuthStore';

export const useGroups = () => {
    const { user } = useAuthStore()
    const queryClient = useQueryClient();

    // Check permissions
    const canView = checkPermission(user, Resources.PRODUCT_GROUPS, Actions.VIEW)
    const canAdd = checkPermission(user, Resources.PRODUCT_GROUPS, Actions.ADD)
    const canEdit = checkPermission(user, Resources.PRODUCT_GROUPS, Actions.EDIT)
    const canDelete = checkPermission(user, Resources.PRODUCT_GROUPS, Actions.DELETE)

    // Get all SubCategories
    const groupsQuery = useQuery({
        queryKey: ['groups'],
        enabled: canView,
        queryFn: () => api.get('/groups').then(res => res.data),
        staleTime: 1000 * 60 * 5, // 5 minutes cache
        onError: (err) => {
            toast.error(err.message || 'Failed to fetch groups');
        }
    });

    // const getGroupQuery = (slug) => useQuery({
    //     queryKey: ['product', slug],
    //     queryFn: async () => {
    //         const res = await api.get(`/groups/details/${slug}`);
    //         const data = res.data;

    //         if (!data || data.message === 'Sub Service not found') {
    //             throw new Error('Service not found');
    //         }

    //         return data;
    //     },
    //     staleTime: 1000 * 60 * 5,
    //     onError: (err) => {
    //         toast.error(err.message || 'Failed to fetch service');
    //     }
    // });


    // Create Group mutation
    const createGroup = useMutation({
        mutationFn: (data) => api.post('/groups/createGroup', data),
        enabled: canAdd,
        onSuccess: () => {
            queryClient.invalidateQueries(['groups']);
            toast.success('Group created successfully');
        },
        onError: (err) => {
            toast.error(err.message || 'Failed to create Group');
        }
    });

    // Update Group mutation
    const updateGroup = useMutation({
        mutationFn: ({ id, data }) => api.put(`/groups/${id}`, data),
        enabled: canEdit,
        onSuccess: () => {
            queryClient.invalidateQueries(['groups']);
            toast.success('Group updated successfully');
        },
        onError: (err) => {
            console.log(err)
            toast.error(err.message || 'Failed to update Group');
        }
    });

    // Delete Group mutation
    // const deleteGroup = useMutation({
    //     mutationFn: (id) => api.delete(`/groups/${id}`),
    //     enabled: canDelete,
    //     onSuccess: () => {
    //         queryClient.invalidateQueries(['groups']);
    //         toast.success('Group deleted successfully');
    //     },
    //     onError: (err) => {
    //         toast.error(err.message || 'Failed to delete Group');
    //     }
    // });

    return {
        groupsQuery, createGroup, updateGroup,
        // groupsQuery, deleteGroup, updateGroup, createGroup, getGroupQuery,
        permissions: {
            canView,
            canAdd,
            canEdit,
            canDelete
        }
    };
};
