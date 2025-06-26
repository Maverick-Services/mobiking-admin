// hooks/useOrders.js
import { useQuery, useQueryClient, useMutation } from '@tanstack/react-query'
import api from '@/lib/api'
import { toast } from 'react-hot-toast'
import { Actions, checkPermission, Resources } from '@/lib/permissions'
import { useAuthStore } from '@/store/useAuthStore'
import axios from 'axios'

export const useOrders = () => {
    const { user } = useAuthStore()
    const queryClient = useQueryClient()

    // Permissions
    const canView = checkPermission(user, Resources.ORDERS, Actions.VIEW)
    const canAdd = checkPermission(user, Resources.ORDERS, Actions.ADD)
    const canEdit = checkPermission(user, Resources.ORDERS, Actions.EDIT)
    const canDelete = checkPermission(user, Resources.ORDERS, Actions.DELETE)

    // 1️⃣ All‐orders query
    const ordersQuery = useQuery({
        queryKey: ['orders', 'all'],
        enabled: canView,
        queryFn: () => api.get('/orders').then(res => res.data),
        staleTime: 1000 * 60 * 5,
        onError: err => toast.error(err.message || 'Failed to fetch orders'),
    })

    // 2️⃣ Imperative “get by date” helper
    const getOrdersByDate = ({ startDate, endDate }) => useQuery({
        queryKey: ['orders', 'custom', startDate, endDate],
        queryFn: () =>
            api
                .get('/orders/custom', { params: { startDate, endDate } })
                .then(res => {
                    // assume API replies { data: Order[] }
                    return Array.isArray(res.data)
                        ? res.data
                        : res.data.data || []
                }),
        staleTime: 1000 * 60 * 5,
        onError: (err) => {
            toast.error(err.message || 'Failed to fetch orders');
            console.log(err)
        }
    });

    const acceptOrder = useMutation({
        mutationFn: ({ orderId, courierId }) =>
            api.post('/orders/accept', { orderId, courierId }).then(res => res.data),
        onSuccess: () => {
            toast.success('Order accepted!')
            queryClient.invalidateQueries({ queryKey: ['orders'] })
        },
        onError: err => toast.error(err.message || 'Failed to accept order'),
    })

    const rejectOrder = useMutation({
        mutationFn: ({ orderId, reason }) =>
            api.post('/orders/reject', { orderId, reason }).then(res => res.data),
        onSuccess: () => {
            toast.success('Order rejected!')
            queryClient.invalidateQueries({ queryKey: ['orders'] })
        },
        onError: err => toast.error(err.message || 'Failed to reject order'),
    })

    const holdOrder = useMutation({
        mutationFn: ({ orderId, reason }) =>
            api.post('/orders/hold', { orderId, reason }).then(res => res.data),
        onSuccess: () => {
            toast.success('Order on hold!')
            queryClient.invalidateQueries({ queryKey: ['orders'] })
        },
        onError: err => toast.error(err.message || 'Failed to hold order'),
    })

    const cancelOrder = useMutation({
        mutationFn: data => api.post('/orders/cancel', data),
        onSuccess: () => {
            toast.success('Order cancelled!')
            queryClient.invalidateQueries({ queryKey: ['orders'] })
        },
        onError: err => toast.error(err.message || 'Failed to cancel order'),
    })

    const createPosOrder = useMutation({
        mutationFn: data => api.post('/orders/pos/new', data),
        onSuccess: () => {
            toast.success('Order Created!')
            queryClient.invalidateQueries({ queryKey: ['orders'] })
        },
        onError: err => {
            toast.error(err.message || 'Failed to create order')
            console.error(err)
        },
    })

    //  Get single order by Id
    const getSingleOrderQuery = (id) => useQuery({
        queryKey: ['order', id],
        queryFn: async () => {
            const res = await api.get(`/orders/details/${id}`);
            const data = res.data;

            if (!data || data.message === 'Order not found') {
                throw new Error('Order not found');
            }

            return data;
        },
        staleTime: 1000 * 60 * 5,
        onError: (err) => {
            toast.error(err.message || 'Failed to fetch Order');
        }
    });

    const updateOrder = useMutation({
        mutationFn: ({ data, id }) => api.put(`/orders/${id}`, data),
        onSuccess: () => {
            toast.success('Order updated successfully.')
            queryClient.invalidateQueries({ queryKey: ['orders'] })
        },
        onError: err => {
            toast.error(err.message || 'Failed to update order')
            console.error(err)
        },
    })

    const addItemInOrder = useMutation({
        mutationFn: data => api.post('/orders/items/add', data),
        onSuccess: () => {
            toast.success('Item Added')
            queryClient.invalidateQueries({ queryKey: ['order'] })
        },
        onError: (error) => {
            let msg = 'Failed to add item in order'
            if (axios.isAxiosError(error)) {
                msg = error.response?.data?.message ?? error.message
            }
            toast.error(msg)
        },
    })

    const removeItemFromOrder = useMutation({
        mutationFn: data => api.post('/orders/items/remove', data),
        onSuccess: () => {
            toast.success('Item Removed')
            queryClient.invalidateQueries({ queryKey: ['order'] })
        },
        onError: (error) => {
            let msg = 'Failed to remove item from order'
            if (axios.isAxiosError(error)) {
                msg = error.response?.data?.message ?? error.message
            }
            toast.error(msg)
        },
    })



    return {
        ordersQuery,
        getOrdersByDate,
        acceptOrder,
        cancelOrder,
        holdOrder,
        createPosOrder,
        rejectOrder,
        getSingleOrderQuery,
        updateOrder,
        addItemInOrder,
        removeItemFromOrder,
        permissions: { canView, canAdd, canEdit, canDelete },
    }
}
