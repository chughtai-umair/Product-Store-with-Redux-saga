import React, { useEffect } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import Swal from "sweetalert2";
import { X } from "react-bootstrap-icons";
import { useNavigate } from "react-router-dom";

interface ProductRow {
  Name: string;
  Category: string;
  Qty: string;
  Price: string;
  Stock_Value: string;
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
        Qty: yup.string().required("Qty is required"),
        Price: yup.string().required("Price is required"),
        Stock_Value: yup.string().required("Stock value is required"),
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
    formState: { errors },
  } = useForm<FormValues>({
    resolver: yupResolver(schema as any),
    defaultValues: {
      rows: [
        {
          Name: "",
          Category: "",
          Qty: "",
          Price: "",
          Stock_Value: "",
        },
      ],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "rows",
  });

  const addRow = () => {
    append({
      Name: "",
      Category: "",
      Qty: "",
      Price: "",
      Stock_Value: "",
    });
  };

  const onSubmit = (data: FormValues) => {
    // Get existing data from localStorage
    const existingData = localStorage.getItem("formData");
    const savedGrids = existingData ? JSON.parse(existingData) : [];

    // Add new data
    const newData = [...savedGrids, ...data.rows];
    localStorage.setItem("formData", JSON.stringify(newData));

    // Success toast
    const Toast = Swal.mixin({
      toast: true,
      position: "top-end",
      showConfirmButton: false,
      timer: 2000,
      timerProgressBar: true,
      didOpen: (toast) => {
        toast.onmouseenter = Swal.stopTimer;
        toast.onmouseleave = Swal.resumeTimer;
      },
    });

    Toast.fire({
      icon: "success",
      title: "Data submitted successfully!",
    }).then(() => {
      // Navigate to list page after toast
      navigate("/product-list");
    });
  };

  return (
    <div className="container mt-5">
      <h2 className="text-center mb-4">Add Product Data</h2>

      <form onSubmit={handleSubmit(onSubmit as any)}>
        <div className="d-flex justify-content-between align-items-center mb-3">
          <button type="button" onClick={addRow} className="btn btn-primary">
            + Add Row
          </button>
          <button
            type="button"
            onClick={() => navigate("/product-list")}
            className="btn btn-outline-secondary"
          >
            View Saved Data
          </button>
        </div>

        <table className="table table-bordered align-middle">
          <thead className="table-dark">
            <tr>
              <th>Name</th>
              <th>Category</th>
              <th>Qty</th>
              <th>Price</th>
              <th>Stock Value</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {fields.map((field, index) => (
              <tr key={field.id}>
                {["Name", "Category", "Qty", "Price", "Stock_Value"].map(
                  (key) => (
                    <td key={key}>
                      <input
                        type="text"
                        className={`form-control ${
                          errors?.rows?.[index]?.[key as keyof ProductRow]
                            ? "is-invalid"
                            : ""
                        }`}
                        {...(control.register
                          ? control.register(
                              `rows.${index}.${key as keyof ProductRow}`
                            )
                          : {})}
                        placeholder={`Enter ${key.replace("_", " ")}`}
                      />
                      {errors?.rows?.[index]?.[key as keyof ProductRow] && (
                        <div className="invalid-feedback">
                          {
                            errors?.rows?.[index]?.[key as keyof ProductRow]
                              ?.message as string
                          }
                        </div>
                      )}
                    </td>
                  )
                )}
                <td className="text-center">
                  {fields.length > 1 && (
                    <X
                      onClick={() => remove(index)}
                      className="text-danger fs-5"
                      size={24}
                      role="button"
                      title="Remove Row"
                      style={{ cursor: "pointer" }}
                    />
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="">
          <button type="submit" className="btn btn-success btn-lg">
            Submit
          </button>
        </div>
      </form>
    </div>
  );
}
