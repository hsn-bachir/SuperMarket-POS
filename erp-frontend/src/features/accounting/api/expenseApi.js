import api from "@/api/axios";

export const getExpenses = (page = 1, search = "") =>
  api.get("/accounting/expenses/", {
    params: {
      page,
      search,
    },
  });

export const getExpense = (id) =>
  api.get(`/accounting/expenses/${id}/`);

export const createExpense = (data) =>
  api.post("/accounting/expenses/", data);

export const deleteExpense = (id) =>
  api.delete(`/accounting/expenses/${id}/`);

export const getExpenseCategories = () =>
  api.get("/accounting/expense-categories/");