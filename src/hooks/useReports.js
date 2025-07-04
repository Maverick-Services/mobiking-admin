import api from "@/lib/api"
import { useMutation } from "@tanstack/react-query"
import toast from "react-hot-toast"

export const useReports = () => {
    const reportMutation = useMutation({
        mutationFn: (data) => api.post("/reports/modules", data),
        onSuccess: () => {
            toast.success("Report generated successfully.")
        },
        onError: (err) => {
            toast.error(err.message || "Failed to generate report")
        },
    })

    return {
        reportMutation,
    }
}
