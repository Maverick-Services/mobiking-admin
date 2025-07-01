import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';
import { toast } from 'react-hot-toast';
import { Actions, checkPermission, Resources } from '@/lib/permissions';
import { useAuthStore } from '@/store/useAuthStore';

export const useProducts = () => {
    const { user } = useAuthStore()
    const queryClient = useQueryClient();

    // Check permissions
    const canView = checkPermission(user, Resources.PRODUCTS, Actions.VIEW)
    const canAdd = checkPermission(user, Resources.PRODUCTS, Actions.ADD)
    const canEdit = checkPermission(user, Resources.PRODUCTS, Actions.EDIT)
    const canDelete = checkPermission(user, Resources.PRODUCTS, Actions.DELETE)

    // Get all SubCategories
    const productsQuery = useQuery({
        queryKey: ['products'],
        enabled: canView,
        queryFn: () => api.get('/products').then(res => res.data),
        staleTime: 1000 * 60 * 5, // 5 minutes cache
        onError: (err) => {
            toast.error(err?.response?.data?.message  || 'Failed to fetch products');
        }
    });

    const getProductQuery = (slug) => useQuery({
        queryKey: ['product', slug],
        queryFn: async () => {
            const res = await api.get(`/products/details/${slug}`);
            const data = res.data;

            if (!data || data.message === 'Sub Service not found') {
                throw new Error('Service not found');
            }

            return data;
        },
        staleTime: 1000 * 60 * 5,
        onError: (err) => {
            toast.error(err?.response?.data?.message  || 'Failed to fetch service');
        }
    });


    // Create Product mutation
    const createProduct = useMutation({
        mutationFn: (data) => api.post('/products/createProduct', data),
        enabled: canAdd,
        onSuccess: () => {
            queryClient.invalidateQueries(['products']);
            toast.success('Product created successfully');
        },
        onError: (err) => {
            toast.error(err?.response?.data?.message  || 'Failed to create Product');
        }
    });

    // Update Product mutation
    const updateProduct = useMutation({
        mutationFn: ({ id, data }) => api.put(`/products/${id}`, data),
        enabled: canEdit,
        onSuccess: () => {
            queryClient.invalidateQueries(['products']);
            toast.success('Product updated successfully');
        },
        onError: (err) => {
            console.log(err)
            toast.error(err?.response?.data?.message || 'Failed to update Product');
        }
    });

    const addProductStock = useMutation({
        mutationFn: (data) => api.post('/products/addProductStock', data),
        enabled: canAdd,
        onSuccess: () => {
            queryClient.invalidateQueries(['products']);
            toast.success('Stock Added successfully');
        },
        onError: (err) => {
            toast.error(err?.response?.data?.message  || 'Failed to add stock.');
        }
    });

    // Delete Product mutation
    // const deleteProduct = useMutation({
    //     mutationFn: (id) => api.delete(`/products/${id}`),
    //     enabled: canDelete,
    //     onSuccess: () => {
    //         queryClient.invalidateQueries(['products']);
    //         toast.success('Product deleted successfully');
    //     },
    //     onError: (err) => {
    //         toast.error(err.message || 'Failed to delete Product');
    //     }
    // });

    return {
        productsQuery, createProduct, getProductQuery, updateProduct, addProductStock,
        // productsQuery, deleteProduct, updateProduct, createProduct, getProductQuery,
        permissions: {
            canView,
            canAdd,
            canEdit,
            canDelete,
        }
    };
};
