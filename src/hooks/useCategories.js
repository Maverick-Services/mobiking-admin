import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';
import { toast } from 'react-hot-toast';
import { Actions, checkPermission, Resources } from '@/lib/permissions';
import { useAuthStore } from '@/store/useAuthStore';

export const useCategories = () => {
    const { user } = useAuthStore()
    const queryClient = useQueryClient();

    // Check permissions
    const canView = checkPermission(user, Resources.CATEGORIES, Actions.VIEW)
    const canAdd = checkPermission(user, Resources.CATEGORIES, Actions.ADD)
    const canEdit = checkPermission(user, Resources.CATEGORIES, Actions.EDIT)
    const canDelete = checkPermission(user, Resources.CATEGORIES, Actions.DELETE)

    // Get all Categories
    const categoriesQuery = useQuery({
        queryKey: ['categories'],
        enabled: canView,
        queryFn: () => api.get('/categories').then(res => res.data),
        staleTime: 1000 * 60 * 5, // 5 minutes cache
        onError: (err) => {
            toast.error(err.message || 'Failed to fetch categories');
        }
    });

    // Create Category mutation
    const createCategory = useMutation({
        mutationFn: ({ data }) => api.post('/categories/createCategory', data),
        enabled: canAdd,
        onSuccess: () => {
            queryClient.invalidateQueries(['categories']);
            toast.success('Category created successfully');
        },
        onError: (err) => {
            toast.error(err.message || 'Failed to create category');
        }
    });

    // Update Category mutation
    const updateCategory = useMutation({
        mutationFn: ({ id, data }) => api.put(`/categories/${id}`, data),
        enabled: canEdit,
        onSuccess: () => {
            queryClient.invalidateQueries(['categories']);
            toast.success('Category updated successfully');
        },
        onError: (err) => {
            toast.error(err.message || 'Failed to update Category');
        }
    });

    // Delete Category mutation
    const deleteCategory = useMutation({
        mutationFn: (id) => api.delete(`/categories/${id}`),
        enabled: canDelete,
        onSuccess: () => {
            queryClient.invalidateQueries(['categories']);
            toast.success('Category deleted successfully');
        },
        onError: (err) => {
            toast.error(err.message || 'Failed to delete Category');
        }
    });

    return {
        // categoriesQuery, createCategory, deleteCategory,
        categoriesQuery, deleteCategory, updateCategory, createCategory,
        permissions: {
            canView,
            canAdd,
            canEdit,
            canDelete
        }
    };
};
