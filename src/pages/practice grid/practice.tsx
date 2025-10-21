import { useEffect } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import Swal from "sweetalert2";
import { Plus, PlusSquare, X } from "react-bootstrap-icons";
import { useNavigate } from "react-router-dom";

interface ProductRow {
  Name: string;
  Category: string;
  Qty: number;
  Price: number;
  Stock_Value: number;
}

interface FormValues {
  rows: ProductRow[];
}

const schema = yup.object().shape({
  rows: yup
    .array()
    .of(
      yup.object().shape({
        Name: yup.string().required("Name is required"),
        Category: yup.string().required("Category is required"),
        Qty: yup
          .number()
          .required("Qty is required")
          .min(1, "Qty must be positive"),
        Price: yup
          .number()
          .required("Price is required")
          .min(1, "Price must be positive"),
        Stock_Value: yup
          .number()
          .required("Stock value is required")
          .min(1, "Stock must be positive"),
      })
    )
    .min(1, "At least one product row is required"),
});

export function Practice() {
  const navigate = useNavigate();

  const {
    control,
    handleSubmit,
    reset,
    register,
    watch,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: yupResolver(schema as any),
    defaultValues: {
      rows: [{ Name: "", Category: "", Qty: 0, Price: 0, Stock_Value: 0 }],
    },
  });

  const saveGroupToLocalStorage = (formData: any) => {
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

      const existingData = JSON.parse(localStorage.getItem("editRows") || "[]");
      const updatedData = [...existingData, ...rowsWithGroupId];

      localStorage.setItem("editRows", JSON.stringify(updatedData));
      console.log("✅ Group Saved:", groupId, rowsWithGroupId);
      return { success: true, groupId };
    } catch (error) {
      console.error("❌ Save Error:", error);
      return { success: false };
    }
  };

  const { fields, append, remove } = useFieldArray({
    control,
    name: "rows",
  });

  const formValues = watch("rows");
  useEffect(() => {
    const editMode = localStorage.getItem("editMode");
    const editItem = localStorage.getItem("editItem");

    if (editMode === "true" && editItem) {
      const editData = JSON.parse(editItem);
      console.log("✅ Loading edit data:", editData);

      // editData is an array of rows from the same group
      reset({ rows: editData });
    }
  }, [reset]);

  const calculateTotals = () => {
    const totalQty =
      formValues?.reduce((sum, row) => sum + (row?.Qty || 0), 0) || 0;
    const totalAmount =
      formValues?.reduce(
        (sum, row) => sum + (row?.Qty || 0) * (row?.Price || 0),
        0
      ) || 0;
    return { totalQty, totalAmount };
  };

  const { totalQty, totalAmount } = calculateTotals();

  const addRow = () => {
    append({ Name: "", Category: "", Qty: 0, Price: 0, Stock_Value: 0 });
  };
  const onSubmit = (data: FormValues) => {
    const invalidStock = data.rows.find((r) => r.Qty > r.Stock_Value);
    if (invalidStock) {
      Swal.fire({
        icon: "error",
        title: "Invalid Quantity",
        text: `Quantity cannot exceed stock value for "${invalidStock.Name}".`,
      });
      return;
    }

    const editMode = localStorage.getItem("editMode");
    const editGroupId = localStorage.getItem("editGroupId");

    if (editMode === "true" && editGroupId) {
      // Edit mode: Update existing group
      const allRows = JSON.parse(localStorage.getItem("editRows") || "[]");

      // Remove old rows of this group
      const otherRows = allRows.filter(
        (row: any) => row.groupId !== editGroupId
      );

      // Add updated rows with same groupId
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

      // Clear edit mode
      localStorage.removeItem("editMode");
      localStorage.removeItem("editItem");
      localStorage.removeItem("editGroupId");

      console.log("✅ Group Updated:", editGroupId, updatedRows);
    } else {
      // Add mode: Create new group
      const result = saveGroupToLocalStorage(data);
      if (!result.success) {
        Swal.fire({
          icon: "error",
          title: "Save Failed",
          text: "Failed to save the group. Please try again.",
        });
        return;
      }
    }

    Swal.fire({
      icon: "success",
      title: editMode === "true" ? "Group updated!" : "Group added!",
      timer: 1500,
      showConfirmButton: false,
    }).then(() => navigate("/practicelayout/practice-list"));
  };

  return (
    <div className="container mt-5">
      <h2 className="text-center mb-4">
        {localStorage.getItem("editMode") === "true"
          ? "Edit Product"
          : "Add Product"}
      </h2>
      <div className="d-flex gap-1 border-1  justify-content-end  align-items-center mb-4 ">
        <button className="btn btn-success" onClick={addRow}>
          <Plus className="me-2" />
          Add Row
        </button>
      </div>

      <form onSubmit={handleSubmit(onSubmit as any)}>
        <table className="table table-bordered">
          <thead className="table-dark">
            <tr>
              <th>Name</th>
              <th>Category</th>
              <th>Qty</th>
              <th>Price</th>
              <th>Stock Value</th>
              <th>Amount</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {fields.map((field, index) => {
              const currentRow = formValues?.[index];
              const amount = (currentRow?.Qty || 0) * (currentRow?.Price || 0);

              return (
                <tr key={field.id}>
                  <td>
                    <input
                      type="text"
                      className={`form-control ${
                        errors?.rows?.[index]?.Name ? "is-invalid" : ""
                      }`}
                      {...register(`rows.${index}.Name`)}
                      placeholder="Enter Name"
                    />
                    {errors?.rows?.[index]?.Name && (
                      <div className="invalid-feedback">
                        {errors.rows[index]?.Name?.message}
                      </div>
                    )}
                  </td>

                  <td>
                    <input
                      type="text"
                      className={`form-control ${
                        errors?.rows?.[index]?.Category ? "is-invalid" : ""
                      }`}
                      {...register(`rows.${index}.Category`)}
                      placeholder="Enter Category"
                    />
                    {errors?.rows?.[index]?.Category && (
                      <div className="invalid-feedback">
                        {errors.rows[index]?.Category?.message}
                      </div>
                    )}
                  </td>

                  <td>
                    <input
                      type="number"
                      className={`form-control ${
                        errors?.rows?.[index]?.Qty ? "is-invalid" : ""
                      }`}
                      {...register(`rows.${index}.Qty`, {
                        valueAsNumber: true,
                      })}
                      placeholder="Enter Qty"
                    />
                    {errors?.rows?.[index]?.Qty && (
                      <div className="invalid-feedback">
                        {errors.rows[index]?.Qty?.message}
                      </div>
                    )}
                  </td>

                  <td>
                    <input
                      type="number"
                      className={`form-control ${
                        errors?.rows?.[index]?.Price ? "is-invalid" : ""
                      }`}
                      {...register(`rows.${index}.Price`, {
                        valueAsNumber: true,
                      })}
                      placeholder="Enter Price"
                    />
                    {errors?.rows?.[index]?.Price && (
                      <div className="invalid-feedback">
                        {errors.rows[index]?.Price?.message}
                      </div>
                    )}
                  </td>

                  <td>
                    <input
                      type="number"
                      className={`form-control ${
                        errors?.rows?.[index]?.Stock_Value ? "is-invalid" : ""
                      }`}
                      {...register(`rows.${index}.Stock_Value`, {
                        valueAsNumber: true,
                      })}
                      placeholder="Enter Stock"
                    />
                    {errors?.rows?.[index]?.Stock_Value && (
                      <div className="invalid-feedback">
                        {errors.rows[index]?.Stock_Value?.message}
                      </div>
                    )}
                  </td>

                  <td>
                    <input
                      type="number"
                      className="form-control bg-light fw-bold text-success"
                      value={amount.toFixed(2)}
                      readOnly
                    />
                  </td>

                  <td className="text-center">
                    {fields.length > 1 && (
                      <X
                        onClick={() => remove(index)}
                        className="text-danger"
                        size={20}
                        role="button"
                        title="Remove Row"
                      />
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>

          <tfoot className="table-success">
            <tr>
              <td colSpan={2} className="text-end fw-bold">
                Totals:
              </td>
              <td className="fw-bold text-primary">{totalQty}</td>
              <td></td>
              <td></td>
              <td className="fw-bold text-success">
                ${totalAmount.toFixed(2)}
              </td>
              <td></td>
            </tr>
          </tfoot>
        </table>

        <div>
          <button type="submit" className="btn btn-success btn-sm">
            {localStorage.getItem("editMode") === "true" ? "Update" : "Submit"}
          </button>
        </div>
      </form>
    </div>
  );
}
