import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';
import { toast } from 'react-hot-toast';
import { Resources } from '@/lib/permissions';
import { usePermissions } from './usePermissions';

export const useGroups = () => {
    const queryClient = useQueryClient();
    const { checkView, checkAdd, checkEdit, checkDelete } = usePermissions()

    // Permissions
    const canView = checkView(Resources.PRODUCT_GROUPS)
    const canAdd = checkAdd(Resources.PRODUCT_GROUPS)
    const canEdit = checkEdit(Resources.PRODUCT_GROUPS)
    const canDelete = checkDelete(Resources.PRODUCT_GROUPS)

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

    // Update Group status
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

    // Update Group mutation
    const updateGroupStatus = useMutation({
        mutationFn: ({ id, data }) => api.put(`/groups/${id}`, data),
        onSuccess: () => {
            queryClient.invalidateQueries(['groups']);
            toast.success('Group updated successfully');
        },
        onError: (err) => {
            console.log(err)
            toast.error(err.message || 'Failed to update Group');
        }
    });

    const updateProductsInGroup = useMutation({
        mutationFn: (data) => api.post(`/groups/updateProducts`, data),
        onSuccess: () => {
            queryClient.invalidateQueries(['groups']);
            toast.success('Products added successfully');
        },
        onError: (err) => {
            console.log(err)
            toast.error(err.message || 'Failed to update Group');
        }
    })

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
        groupsQuery, createGroup, updateGroup, updateProductsInGroup, updateGroupStatus,
        // groupsQuery, deleteGroup, updateGroup, createGroup, getGroupQuery,
        permissions: {
            canView,
            canAdd,
            canEdit,
            canDelete
        }
    };
};
