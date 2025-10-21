// import { ProductRow } from "../../types";

type ProductRow = {
  Name: string;
  Category: string;
  Qty: number;
  Price: number;
  Stock_Value: number;
  groupId?: string;
  batch_id?: string;
  length?: number;
};

// Get all rows from localStorage
export const getAllRows = (): ProductRow[] => {
  try {
    return JSON.parse(localStorage.getItem("editRows") || "[]");
  } catch (error) {
    console.error("❌ Error loading data from localStorage:", error);
    return [];
  }
};

// Group data by groupId
export const getGroupedData = (allRows: ProductRow[] = getAllRows()) => {
  const grouped = allRows.reduce((acc: any, row: any) => {
    if (!row.groupId) return acc;

    if (!acc[row.groupId]) {
      acc[row.groupId] = {
        groupId: row.groupId,
        rowCount: 0,
        totalQty: 0,
        totalAmount: 0,
        rows: [],
      };
    }

    acc[row.groupId].rowCount++;
    acc[row.groupId].totalQty += parseFloat(row.Qty) || 0;
    acc[row.groupId].totalAmount +=
      (parseFloat(row.Qty) || 0) * (parseFloat(row.Price) || 0);
    acc[row.groupId].rows.push(row);

    return acc;
  }, {});

  return Object.values(grouped);
};

// Save group to localStorage
export const saveGroupToLocalStorage = (formData: any) => {
  try {
    const groupId = `GRP-${Date.now()}`;
    const rowsWithGroupId = formData.rows.map((row: any) => ({
      ...row,
      groupId: groupId,
      Name: row.Name || "",
      Category: row.Category || "",
      Qty: parseFloat(row.Qty) || 0,
      Price: parseFloat(row.Price) || 0,
      Stock_Value: parseFloat(row.Stock_Value) || 0,
      batch_id: row.batch_id || "1",
      length: parseFloat(row.length) || 0,
    }));

    const existingData = getAllRows();
    const updatedData = [...existingData, ...rowsWithGroupId];

    localStorage.setItem("editRows", JSON.stringify(updatedData));
    console.log("✅ Group Saved:", groupId, rowsWithGroupId);
    return { success: true, groupId };
  } catch (error) {
    console.error("❌ Save Error:", error);
    return { success: false };
  }
};

// Update existing group in localStorage
export const updateGroupInLocalStorage = (data: any, editGroupId: string) => {
  try {
    const allRows = getAllRows();

    const otherRows = allRows.filter((row: any) => row.groupId !== editGroupId);

    const updatedRows = data.rows.map((row: any) => ({
      ...row,
      groupId: editGroupId,
      Name: row.Name || "",
      Category: row.Category || "",
      Qty: parseFloat(row.Qty) || 0,
      Price: parseFloat(row.Price) || 0,
      Stock_Value: parseFloat(row.Stock_Value) || 0,
    }));

    const finalData = [...otherRows, ...updatedRows];
    localStorage.setItem("editRows", JSON.stringify(finalData));

    console.log("✅ Group Updated:", editGroupId, updatedRows);
    return { success: true };
  } catch (error) {
    console.error("❌ Update Error:", error);
    return { success: false };
  }
};

// Delete group from localStorage
export const deleteGroupFromLocalStorage = (groupId: string) => {
  try {
    const allRows = getAllRows();
    const updatedRows = allRows.filter((row: any) => row.groupId !== groupId);

    localStorage.setItem("editRows", JSON.stringify(updatedRows));
    console.log("✅ Group Deleted:", groupId);
    return { success: true };
  } catch (error) {
    console.error("❌ Delete Error:", error);
    return { success: false };
  }
};

// Load edit data
export const loadEditData = () => {
  const editMode = localStorage.getItem("editMode");
  const editItem = localStorage.getItem("editItem");

  if (editMode === "true" && editItem) {
    return JSON.parse(editItem);
  }
  return null;
};

// Clear edit mode
export const clearEditMode = () => {
  localStorage.removeItem("editMode");
  localStorage.removeItem("editItem");
  localStorage.removeItem("editGroupId");
};

// Check if in edit mode
export const isEditMode = () => {
  return localStorage.getItem("editMode") === "true";
};

// Get edit group ID
export const getEditGroupId = () => {
  return localStorage.getItem("editGroupId");
};
export { ProductRow };
