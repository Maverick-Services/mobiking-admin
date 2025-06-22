import api from "@/lib/api";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import toast from "react-hot-toast";


export const useQueries = () => {
    const queryClient = useQueryClient();

    const queriesQuery = useQuery({
        queryKey: ['queries'],
        queryFn: () => api.get('/queries').then(res => res.data),
        staleTime: 1000 * 60,
        onError: (err) => {
            toast.error(err.message || 'Failed to fetch queries');
        }
    });

    const assignQueries = useMutation({
        mutationFn: (data) => api.post('/queries/assign', data),
        onSuccess: () => {
            queryClient.invalidateQueries(['queries']);
            toast.success("Queries Assigned Successfully")
        },
        onError: (err) => {
            toast.error(err.message || 'Failed to assign queries');
        }
    })

    const sendReply = useMutation({
        mutationFn: (data) => api.post('/queries/reply', data),
        onSuccess: () => {
            queryClient.invalidateQueries(['queries']);
            toast.success("Reply sent successfully")
        },
        onError: (err) => {
            toast.error(err.message || 'Failed to send reply.');
        }
    })

    const closeQuery = useMutation({
        mutationFn: (data) => api.post('/queries/close', data),
        onSuccess: () => {
            queryClient.invalidateQueries(['queries']);
            toast.success("Query Close successfully")
        },
        onError: (err) => {
            toast.error(err.message || 'Failed to Close Query.');
        }
    })

    return {
        queriesQuery, assignQueries, sendReply, closeQuery
    }
}