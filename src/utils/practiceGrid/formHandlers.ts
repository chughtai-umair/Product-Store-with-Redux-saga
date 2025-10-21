import Swal from "sweetalert2";
import { NavigateFunction } from "react-router-dom";
import { FormValues } from "../../types";
import {
  saveGroupToLocalStorage,
  updateGroupInLocalStorage,
  clearEditMode,
  isEditMode,
  getEditGroupId,
} from "./localStorageUtils";
import { validateStock } from "./calculationUtils";

// Handle form submission
export const handleFormSubmit = async (
  data: FormValues,
  navigate: NavigateFunction
) => {
  // Validate stock
  const invalidStock = validateStock(data.rows);
  if (invalidStock) {
    Swal.fire({
      icon: "error",
      title: "Invalid Quantity",
      text: `Quantity cannot exceed stock value for "${invalidStock.Name}".`,
    });
    return;
  }

  const editMode = isEditMode();
  const editGroupId = getEditGroupId();

  try {
    if (editMode && editGroupId) {
      // Update existing group
      const result = updateGroupInLocalStorage(data, editGroupId);
      if (!result.success) {
        throw new Error("Failed to update group");
      }
      clearEditMode();
    } else {
      // Save new group
      const result = saveGroupToLocalStorage(data);
      if (!result.success) {
        throw new Error("Failed to save group");
      }
    }

    // Show success message
    await Swal.fire({
      icon: "success",
      title: editMode ? "Group updated!" : "Group added!",
      timer: 1500,
      showConfirmButton: false,
    });

    // Navigate to list page
    navigate("/practicelayout/practice-list");
  } catch (error) {
    Swal.fire({
      icon: "error",
      title: "Save Failed",
      text: "Failed to save the group. Please try again.",
    });
  }
};

// Handle form reset
export const handleFormReset = (reset: any) => {
  reset({
    rows: [{ Name: "", Category: "", Qty: 0, Price: 0, Stock_Value: 0 }],
  });
};

// Add new row to form
export const addNewRow = (append: any) => {
  append({ Name: "", Category: "", Qty: 0, Price: 0, Stock_Value: 0 });
};
