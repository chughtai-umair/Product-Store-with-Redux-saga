import { ProductRow } from "../../types";

// Calculate totals for form values
export const calculateTotals = (formValues: ProductRow[] | undefined) => {
  const totalQty =
    formValues?.reduce((sum, row) => sum + (row?.Qty || 0), 0) || 0;
  const totalAmount =
    formValues?.reduce(
      (sum, row) => sum + (row?.Qty || 0) * (row?.Price || 0),
      0
    ) || 0;

  return { totalQty, totalAmount };
};

// Validate stock values
export const validateStock = (rows: ProductRow[]) => {
  return rows.find((r) => r.Qty > r.Stock_Value);
};

// Calculate amount for single row
export const calculateRowAmount = (qty: number, price: number) => {
  return (qty || 0) * (price || 0);
};

// Format currency
export const formatCurrency = (amount: number) => {
  return `$${amount.toFixed(2)}`;
};

// Generate unique group ID
export const generateGroupId = () => {
  return `GRP-${Date.now()}`;
};
