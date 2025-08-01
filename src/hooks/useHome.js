import api from "@/lib/api"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import toast from "react-hot-toast";


export const useHome = () => {
    const queryClient = useQueryClient();

    const homeQuery = useQuery({
        queryKey: ['home'],
        queryFn: () => api.get('/home').then(res => res.data),
        onError: (err) => {
            toast.error(err.message || 'Failed to fetch Home Layout');
        }
    })

    const updateHome = useMutation({
        mutationFn: (data) => api.put('/home/683ec8e43b89a8e66dba4274', data),
        onSuccess: () => {
            queryClient.invalidateQueries(['home']);
            toast.success('Home updated successfully');
        },
        onError: (err) => {
            toast.error(err.message || 'Failed to update home');
        }
    })

    return {
        homeQuery, updateHome
    }
}