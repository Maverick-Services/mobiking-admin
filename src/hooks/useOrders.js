import { useQuery, useQueryClient, useMutation } from '@tanstack/react-query'
import api from '@/lib/api'
import { toast } from 'react-hot-toast'
import { Actions, checkPermission, Resources } from '@/lib/permissions'
import { useAuthStore } from '@/store/useAuthStore'

export const useOrders = () => {
    const { user } = useAuthStore()
    const queryClient = useQueryClient()

    // Permissions
    const canView = checkPermission(user, Resources.ORDERS, Actions.VIEW)
    const canAdd = checkPermission(user, Resources.ORDERS, Actions.ADD)
    const canEdit = checkPermission(user, Resources.ORDERS, Actions.EDIT)
    const canDelete = checkPermission(user, Resources.ORDERS, Actions.DELETE)

    // Fetch all orders
    const ordersQuery = useQuery({
        queryKey: ['orders'],
        enabled: canView,
        queryFn: () => api.get('/orders').then(res => res.data),
        staleTime: 1000 * 60 * 5,
        onError: err => {
            toast.error(err.message || 'Failed to fetch orders')
        }
    })

    // Mutation: Accept an order
    const acceptOrder = useMutation({
        mutationFn: (orderId) => api.post('/orders/accept', { orderId }).then(res => res.data),
        onSuccess: () => {
            toast.success('Order accepted!')
            // refetch the list
            queryClient.invalidateQueries({ queryKey: ['orders'] })
        },
        onError: err => {
            toast.error(err.message || 'Failed to accept order')
        }
    })

    return {
        ordersQuery,
        acceptOrder,
        permissions: {
            canView,
            canAdd,
            canEdit,
            canDelete
        }
    }
}
