import api from "@/lib/api"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import toast from "react-hot-toast"

export const usePolicies = ()=>{
    const queryClient = useQueryClient()

    const policyQuery = useQuery({
        queryKey: ['policies'],
        queryFn: ()=> api.get('/policy').then(res => res.data),
         onError: (err) => {
            toast.error(err.message || 'Error in loading data');
        }
    })

    const createPolicy = useMutation({
        mutationFn: (data)=> api.post('/policy', data),
         onSuccess: () => {
            queryClient.invalidateQueries(['policies']);
            toast.success('Policy created successfully');
        },
        onError: (err) => {
            toast.error(err.message || 'Failed to create Policy');
        }
    })

    const updatePolicy = useMutation({
        mutationFn: ({id, data})=> api.put(`/policy/${id}`, data),
         onSuccess: () => {
            queryClient.invalidateQueries(['policies']);
            toast.success('Policy updated successfully');
        },
        onError: (err) => {
            toast.error(err.message || 'Failed to update Policy');
        }
    })

    return {
        policyQuery,
        createPolicy,
        updatePolicy,
    }
}