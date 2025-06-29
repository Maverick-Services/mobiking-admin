// hooks/useDashboard.js
import api from "@/lib/api";
import { useQuery } from "@tanstack/react-query";

// Total Orders
export const useTotalOrders = () => {
    return useQuery({
        queryKey: ["dashboard", "orders", "count"],
        queryFn: async () => {
            const res = await api.get("/reports/orders/count").then(res => res.data);
            return res.data;
        },
        staleTime: 20 * 1000,
        onError: (err) => {
            toast.error(err.message || 'Failed to fetch data');
        },
    });
};

// Total Customers
export const useTotalCustomers = () => {
    return useQuery({
        queryKey: ["dashboard", "customers", "count"],
        queryFn: async () => {
            const res = await api.get("/reports/customers/count").then(res => res.data);
            return res.data;
        },
        staleTime: 20 * 1000,
        onError: (err) => {
            toast.error(err.message || 'Failed to fetch data');
        },
    });
};

// Total Sales
export const useTotalSales = () => {
    return useQuery({
        queryKey: ["dashboard", "sales", "count"],
        queryFn: async () => {
            const res = await api.get("/reports/sales/total").then(res => res.data);
            return res.data;
        },
        staleTime: 5 * 60 * 1000, // 5 mins (optional)
        onError: (err) => {
            toast.error(err.message || 'Failed to fetch data');
        },
    });
};

// Sales of One Day
export const useSalesOfOneDay = (startDate, endDate) => {
    return useQuery({
        queryKey: ['dashboard', startDate, endDate],
        queryFn: async () => {
            const res = await api.get('reports/sales/custom', {
                params: { startDate, endDate }
            }).then(res => res.data)
            return res.data;
        },
        enabled: !!startDate && !!endDate,
        staleTime: 5 * 60 * 1000,
        onError: (err) => {
            console.log(err)
            toast.error(err.message)
        }
    })
}

// customers count for chart
export const useCustomerCount = (startDate, endDate) => {
    return useQuery({
        queryKey: ['dashboard', startDate, endDate],
        queryFn: async () => {
            const res = await api.get('reports/customers', {
                params: { startDate, endDate }
            }).then(res => res.data)
            return res.data;
        },
        enabled: !!startDate && !!endDate,
        staleTime: 60 * 1000,
        onError: (err) => {
            console.log(err)
            toast.error(err.message)
        }
    })
}