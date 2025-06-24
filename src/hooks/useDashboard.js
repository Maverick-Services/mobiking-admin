// hooks/useDashboard.js
import api from "@/lib/api";
import { useQuery } from "@tanstack/react-query";

export const useTotalOrders = () => {
    return useQuery({
        queryKey: ["dashboard", "orders", "count"],
        queryFn: async () => {
            const res = await api.get("/reports/orders/count").then(res => res.data);
            return res.data;
        },
        staleTime: 5 * 60 * 1000, // 5 mins (optional)
        onError: (err) => {
            toast.error(err.message || 'Failed to fetch data');
        },
    });
};

export const useTotalCustomers = () => {
    return useQuery({
        queryKey: ["dashboard", "customers", "count"],
        queryFn: async () => {
            const res = await api.get("/reports/customers/count").then(res => res.data);
            return res.data;
        },
        staleTime: 5 * 60 * 1000, // 5 mins (optional)
        onError: (err) => {
            toast.error(err.message || 'Failed to fetch data');
        },
    });
};

export const useTotalSales = () => {
    return useQuery({
        queryKey: ["dashboard", "sales", "count"],
        queryFn: async () => {
            const res = await api.get("/reports/sales/total").then(res => res.data);
        },
        staleTime: 5 * 60 * 1000, // 5 mins (optional)
        onError: (err) => {
            toast.error(err.message || 'Failed to fetch data');
        },
    });
};
