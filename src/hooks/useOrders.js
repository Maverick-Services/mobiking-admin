// hooks/useOrders.js
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import api from "@/lib/api";
import { toast } from "react-hot-toast";
import { Actions, checkPermission, Resources } from "@/lib/permissions";
import axios from "axios";
import { usePermissions } from "./usePermissions";

export const useOrders = () => {
  const queryClient = useQueryClient();
  const { checkView, checkAdd, checkEdit, checkDelete, onlyAdmin } = usePermissions()

  // Orders Permissions
  const canView = checkView(Resources.ORDERS);
  const canAdd = checkAdd(Resources.ORDERS);
  const canEdit = checkEdit(Resources.ORDERS);
  const canDelete = checkDelete(Resources.ORDERS);

  // payment links Permissions
  const canViewPayment = checkView(Resources.PAYMENT_LINKS);
  const canAddPayment = checkAdd(Resources.PAYMENT_LINKS);
  const canEditPayment = checkEdit(Resources.PAYMENT_LINKS);
  const canDeletePayment = checkDelete(Resources.PAYMENT_LINKS);

  // cancel Orders Permissions
  const canViewCancel = checkView(Resources.CANCEL_REQUESTS);
  const canAddCancel = checkAdd(Resources.CANCEL_REQUESTS);
  const canEditCancel = checkEdit(Resources.CANCEL_REQUESTS);
  const canDeleteCancel = checkDelete(Resources.CANCEL_REQUESTS);

  // Return Permissions
  const canViewReturn = checkView(Resources.RETURN_REQUESTS);
  const canAddReturn = checkAdd(Resources.RETURN_REQUESTS);
  const canEditReturn = checkEdit(Resources.RETURN_REQUESTS);
  const canDeleteReturn = checkDelete(Resources.RETURN_REQUESTS);

  // Manual Orders Permissions
  const canViewManual = checkView(Resources.MANUAL_ORDER);
  const canAddManual = checkAdd(Resources.MANUAL_ORDER);
  const canEditManual = checkEdit(Resources.MANUAL_ORDER);
  const canDeleteManual = checkDelete(Resources.MANUAL_ORDER);

  // POS Permissions
  const canViewPos = checkView(Resources.POS);
  const canAddPos = checkAdd(Resources.POS);
  const canEditPos = checkEdit(Resources.POS);
  const canDeletePos = checkDelete(Resources.POS);

  // POS Orders Tab Permissions
  const canViewPosTab = checkView(Resources.POS_ORDERS);
  const canAddPosTab = checkAdd(Resources.POS_ORDERS);
  const canEditPosTab = checkEdit(Resources.POS_ORDERS);
  const canDeletePosTab = checkDelete(Resources.POS_ORDERS);

  // all orders
  const ordersQuery = useQuery({
    queryKey: ["orders", "all"],
    queryFn: () => api.get("/orders").then((res) => res.data),
    staleTime: 1000 * 60 * 5,
    onError: (err) => toast.error(err.message || "Failed to fetch orders"),
  });

  // get orders by date
  const getOrdersByDate = ({ params }) => {
    const filtered = Object.fromEntries(
      Object.entries(params).filter(
        ([_, v]) => v !== undefined && v !== null && v !== "" && v !== "all"
      )
    );

    return useQuery({
      queryKey: ["orders", filtered],
      queryFn: () =>
        api
          .get("/orders/paginated", { params: filtered })
          .then((res) => res.data.data),
      keepPreviousData: true,
      staleTime: 1000 * 60 * 5,
      onError: (err) => {
        toast.error(err?.response?.data?.message || "Failed to fetch orders");
      },
    });
  };

  const getCancelRequestOrders = ({
    requestType,
    page,
    limit,
    startDate,
    endDate,
  }) =>
    useQuery({
      queryKey: ["orders", requestType, startDate, endDate, page, limit],
      queryFn: () =>
        api
          .get("/orders/request", {
            params: { requestType, startDate, endDate, page, limit },
          })
          .then((res) => {
            return Array.isArray(res.data) ? res.data : res.data.data;
          }),
      onError: (err) => {
        toast.error(err.message || "Failed to fetch orders");
        console.log(err);
      },
    });

  const acceptOrder = useMutation({
    mutationFn: ({ orderId, courierId }) =>
      api
        .post("/orders/accept", { orderId, courierId })
        .then((res) => res.data),
    onSuccess: () => {
      toast.success("Order accepted!");
      queryClient.invalidateQueries({ queryKey: ["order"] });
      queryClient.invalidateQueries({ queryKey: ["orders"] });
    },
    onError: (err) => toast.error(err.message || "Failed to accept order"),
  });

  const rejectOrder = useMutation({
    mutationFn: ({ orderId, reason }) =>
      api.post("/orders/reject", { orderId, reason }).then((res) => res.data),
    onSuccess: () => {
      toast.success("Order rejected!");
      queryClient.invalidateQueries({ queryKey: ["order"] });
      queryClient.invalidateQueries({ queryKey: ["orders"] });
    },
    onError: (err) => toast.error(err.message || "Failed to reject order"),
  });

  const holdOrder = useMutation({
    mutationFn: ({ orderId, reason }) =>
      api.post("/orders/hold", { orderId, reason }).then((res) => res.data),
    onSuccess: () => {
      toast.success("Order on hold!");
      queryClient.invalidateQueries({ queryKey: ["order"] });
      queryClient.invalidateQueries({ queryKey: ["orders"] });
    },
    onError: (err) => toast.error(err.message || "Failed to hold order"),
  });

  const cancelOrder = useMutation({
    mutationFn: ({ orderId, reason }) =>
      api.post("/orders/cancel", { orderId, reason }),
    onSuccess: () => {
      toast.success("Order cancelled!");
      queryClient.invalidateQueries({ queryKey: ["order"] });
      queryClient.invalidateQueries({ queryKey: ["orders"] });
    },
    onError: (err) => toast.error(err.message || "Failed to cancel order"),
  });

  const rejectCancelRequest = useMutation({
    mutationFn: ({ orderId, reason }) =>
      api.post("/users/request/cancel/reject", { orderId, reason }),
    onSuccess: () => {
      toast.success("Cancel request rejected!");
      queryClient.invalidateQueries({ queryKey: ["order"] });
      queryClient.invalidateQueries({ queryKey: ["orders"] });
    },
    onError: (err) => toast.error(err.message || "Failed to reject cancel request"),
  });

  const returnOrder = useMutation({
    mutationFn: ({ orderId }) =>
      api.post("/orders/return", { orderId }),
    onSuccess: () => {
      toast.success("Order return placed!");
      queryClient.invalidateQueries({ queryKey: ["order"] });
      queryClient.invalidateQueries({ queryKey: ["orders"] });
    },
    onError: (err) => toast.error(err.message || "Failed to return order"),
  });

  const rejectReturnRequest = useMutation({
    mutationFn: ({ orderId, reason }) =>
      api.post("/users/request/return/reject", { orderId, reason }),
    onSuccess: () => {
      toast.success("Return request rejected!");
      queryClient.invalidateQueries({ queryKey: ["order"] });
      queryClient.invalidateQueries({ queryKey: ["orders"] });
    },
    onError: (err) => toast.error(err.message || "Failed to reject return request"),
  });

  const createPosOrder = useMutation({
    mutationFn: (data) => api.post("/orders/pos/new", data),
    onSuccess: () => {
      toast.success("Order Created!");
      queryClient.invalidateQueries({ queryKey: ["orders"] });
      queryClient.invalidateQueries({ queryKey: ["productsPagination"] });
    },
    onError: (err) => {
      toast.error(err.message || "Failed to create order");
      console.error(err);
    },
  });

  const createManualOrder = useMutation({
    mutationFn: (data) => api.post("/orders/manual/new", data),
    onSuccess: () => {
      toast.success("Order Created!");
      queryClient.invalidateQueries({ queryKey: ["orders"] });
      queryClient.invalidateQueries({ queryKey: ["productsPagination"] });
    },
    onError: (err) => {
      toast.error(err.message || "Failed to create order");
      console.error(err);
    },
  });

  // send payment link
  const sendPaymentLink = useMutation({
    mutationFn: ({ data }) => api.post(`/payment/generateLink`, data),
    onSuccess: () => {
      toast.success("Link sent successfully.");
    },
    onError: (err) => {
      toast.error(err.message || "Failed to send payment link");
      console.log(err);
    },
  });

  const getPaymentLinks = useQuery({
    queryKey: ["paymentLinks"],
    queryFn: () => api.get("/payment/links").then((res) => res.data),
    keepPreviousData: true,
    staleTime: 1000 * 60 * 5,
    onError: (err) => {
      toast.error(
        err?.response?.data?.message || "Failed to fetch payment links"
      );
    },
  });

  //  Get single order by Id
  const getSingleOrderQuery = (id) =>
    useQuery({
      queryKey: ["order", id],
      queryFn: async () => {
        const res = await api.get(`/orders/details/${id}`);
        const data = res.data;

        if (!data || data.message === "Order not found") {
          throw new Error("Order not found");
        }

        return data;
      },
      staleTime: 1000 * 60 * 5,
      onError: (err) => {
        toast.error(err.message || "Failed to fetch Order");
      },
    });

  const updateOrder = useMutation({
    mutationFn: ({ data, id }) => api.put(`/orders/${id}`, data),
    onSuccess: () => {
      toast.success("Order updated successfully.");
      queryClient.invalidateQueries({ queryKey: ["order"] });
      queryClient.invalidateQueries({ queryKey: ["orders"] });
    },
    onError: (err) => {
      toast.error(err.message || "Failed to update order");
      console.error(err);
    },
  });

  const addItemInOrder = useMutation({
    mutationFn: (data) => api.post("/orders/items/add", data),
    onSuccess: () => {
      toast.success("Item Added");
      queryClient.invalidateQueries({ queryKey: ["order"] });
    },
    onError: (error) => {
      let msg = "Failed to add item in order";
      if (axios.isAxiosError(error)) {
        msg = error.response?.data?.message ?? error.message;
      }
      toast.error(msg);
    },
  });

  const removeItemFromOrder = useMutation({
    mutationFn: (data) => api.post("/orders/items/remove", data),
    onSuccess: () => {
      toast.success("Item Removed");
      queryClient.invalidateQueries({ queryKey: ["order"] });
    },
    onError: (error) => {
      let msg = "Failed to remove item from order";
      if (axios.isAxiosError(error)) {
        msg = error.response?.data?.message ?? error.message;
      }
      toast.error(msg);
    },
  });

  return {
    ordersQuery,
    getOrdersByDate,
    acceptOrder,
    cancelOrder,
    rejectCancelRequest,
    holdOrder,
    returnOrder,
    rejectReturnRequest,
    createPosOrder,
    rejectOrder,
    getSingleOrderQuery,
    updateOrder,
    addItemInOrder,
    removeItemFromOrder,
    getCancelRequestOrders,
    sendPaymentLink,
    getPaymentLinks,
    createManualOrder,
    permissions: { canView, canAdd, canEdit, canDelete },
    permissionsPayment: { canViewPayment, canAddPayment, canEditPayment, canDeletePayment },
    permissionsCancel: { canViewCancel, canAddCancel, canEditCancel, canDeleteCancel },
    permissionsReturn: { canViewReturn, canAddReturn, canEditReturn, canDeleteReturn },
    permissionsManual: { canViewManual, canAddManual, canEditManual, canDeleteManual },
    permissionsPos: { canViewPos, canAddPos, canEditPos, canDeletePos },
    permissionsPosTab: { canViewPosTab, canAddPosTab, canEditPosTab, canDeletePosTab },
    onlyAdmin
  };
};
