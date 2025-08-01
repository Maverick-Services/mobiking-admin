import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';
import { toast } from 'react-hot-toast';
import { Resources } from '@/lib/permissions';
import { usePermissions } from './usePermissions';

export const useSubCategories = () => {
    const queryClient = useQueryClient();
    const { checkView, checkAdd, checkEdit, checkDelete } = usePermissions()

    // Permissions
    const canView = checkView(Resources.SUB_CATEGORIES)
    const canAdd = checkAdd(Resources.SUB_CATEGORIES)
    const canEdit = checkEdit(Resources.SUB_CATEGORIES)
    const canDelete = checkDelete(Resources.SUB_CATEGORIES)

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
