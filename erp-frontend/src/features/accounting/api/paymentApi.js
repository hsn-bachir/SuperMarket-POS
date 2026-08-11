import api from "@/api/axios";

export const getPayments = (page = 1, search = "") =>
  api.get("/accounting/payments/", {
    params: {
      page,
      search,
    },
  });

export const getPayment = (id) =>
  api.get(`/accounting/payments/${id}/`);

export const createPayment = (data) =>
  api.post("/accounting/payments/", data);

export const cancelPayment = (id) =>
  api.post(`/accounting/payments/${id}/cancel/`);

export const deletePayment = (id) =>
  api.delete(`/accounting/payments/${id}/`);

export async function payPayment(
    id,
    paymentMethod
) {
    return api.post(
        `/accounting/payments/${id}/pay/`,
        {
            payment_method: paymentMethod,
        }
    );
}