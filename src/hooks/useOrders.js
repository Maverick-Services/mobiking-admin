import { useQuery, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';
import { toast } from 'react-hot-toast';
import { Actions, checkPermission, Resources } from '@/lib/permissions';
import { useAuthStore } from '@/store/useAuthStore';

export const useOrders = () => {
    const { user } = useAuthStore()
    const queryClient = useQueryClient();

    // Check permissions
    const canView = checkPermission(user, Resources.ORDERS, Actions.VIEW)
    const canAdd = checkPermission(user, Resources.ORDERS, Actions.ADD)
    const canEdit = checkPermission(user, Resources.ORDERS, Actions.EDIT)
    const canDelete = checkPermission(user, Resources.ORDERS, Actions.DELETE)

    // Get all SubCategories
    const ordersQuery = useQuery({
        queryKey: ['orders'],
        enabled: canView,
        queryFn: () => api.get('/orders').then(res => res.data),
        staleTime: 1000 * 60 * 5, // 5 minutes cache
        onError: (err) => {
            toast.error(err.message || 'Failed to fetch orders');
        }
    });


    return {
        ordersQuery,
        permissions: {
            canView,
            canAdd,
            canEdit,
            canDelete
        }
    };
};
