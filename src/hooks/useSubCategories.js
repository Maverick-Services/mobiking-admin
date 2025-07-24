import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';
import { toast } from 'react-hot-toast';
import { Actions, checkPermission, Resources } from '@/lib/permissions';
import { useAuthStore } from '@/store/useAuthStore';

export const useSubCategories = () => {
    const { user } = useAuthStore()
    const queryClient = useQueryClient();

    // Check permissions
    const canView = checkPermission(user, Resources.SUB_CATEGORIES, Actions.VIEW)
    const canAdd = checkPermission(user, Resources.SUB_CATEGORIES, Actions.ADD)
    const canEdit = checkPermission(user, Resources.SUB_CATEGORIES, Actions.EDIT)
    const canDelete = checkPermission(user, Resources.SUB_CATEGORIES, Actions.DELETE)

    // Get all SubCategories
    const subCategoriesQuery = useQuery({
        queryKey: ['subCategories'],
        enabled: canView,
        queryFn: () => api.get('/categories/subCategories').then(res => res.data),
        staleTime: 1000 * 60 * 5, // 5 minutes cache
        onError: (err) => {
            toast.error(err.message || 'Failed to fetch subCategories');
        }
    });

    const getSubServiceQuery = (slug) => useQuery({
        queryKey: ['subService', slug],
        queryFn: async () => {
            const res = await api.get(`/categories/subCategories/details/${slug}`);
            const data = res.data;

            if (!data || data.message === 'Sub Service not found') {
                throw new Error('Service not found');
            }

            return data;
        },
        staleTime: 1000 * 60 * 5,
        onError: (err) => {
            toast.error(err.message || 'Failed to fetch service');
        }
    });


    // Create Category mutation
    const createSubCategory = useMutation({
        mutationFn: (data) => api.post('/categories/createSubCategory', data),
        enabled: canAdd,
        onSuccess: () => {
            queryClient.invalidateQueries(['subCategories']);
            toast.success('Sub Category created successfully');
        },
        onError: (err) => {
            toast.error(err.message || 'Failed to create sub category');
        }
    });

    // Update Category mutation
    const updateSubCategory = useMutation({
        mutationFn: ({ id, data }) => api.put(`/categories/subCategories/${id}`, data),
        enabled: canEdit,
        onSuccess: () => {
            queryClient.invalidateQueries(['subCategories']);
            toast.success('Sub Category updated successfully');
        },
        onError: (err) => {
            console.log(err)
            toast.error(err.message || 'Failed to update Category');
        }
    });

    const updateSubCategoryStatus = useMutation({
        mutationFn: ({ id, data }) => api.put(`/categories/subCategories/status/${id}`, data),
        enabled: canEdit,
        onSuccess: () => {
            queryClient.invalidateQueries(['subCategories']);
            toast.success('Sub Category Status updated successfully');
        },
        onError: (err) => {
            console.log(err)
            toast.error(err.message || 'Failed to update status');
        }
    });

    // Delete Category mutation
    const deleteSubCategory = useMutation({
        mutationFn: (id) => api.delete(`/categories/subCategories/${id}`),
        enabled: canDelete,
        onSuccess: () => {
            queryClient.invalidateQueries(['subCategories']);
            toast.success('Sub Category deleted successfully');
        },
        onError: (err) => {
            toast.error(err.message || 'Failed to delete Category');
        }
    });

    return {
        subCategoriesQuery, deleteSubCategory, updateSubCategory, updateSubCategoryStatus, createSubCategory, getSubServiceQuery,
        permissions: {
            canView,
            canAdd,
            canEdit,
            canDelete
        }
    };
};
