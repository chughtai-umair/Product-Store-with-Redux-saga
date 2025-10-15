// ProductList.tsx
import React, { useEffect, useState } from "react";
import { PencilSquare, Trash3, Plus } from "react-bootstrap-icons";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

interface ProductRow {
  Name: string;
  Category: string;
  Qty: string;
  Price: string;
  Stock_Value: string;
}

export function ProductList() {
  const [savedGrids, setSavedGrids] = useState<ProductRow[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const storedData = localStorage.getItem("formData");
    if (storedData) {
      setSavedGrids(JSON.parse(storedData));
    }
  }, []);

  const handleEdit = (index: number) => {
    // For now, just navigate back to form - you can enhance this
    navigate("/practice");
  };

  const handleDelete = (index: number) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        const updated = savedGrids.filter((_, i) => i !== index);
        setSavedGrids(updated);
        localStorage.setItem("formData", JSON.stringify(updated));

        Swal.fire("Deleted!", "Your record has been deleted.", "success");
      }
    });
  };

  return (
    <div className="container mt-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Product List ({savedGrids.length} items)</h2>
        <button
          onClick={() => navigate("/practice")}
          className="btn btn-primary"
        >
          <Plus className="me-2" />
          Add New Product
        </button>
      </div>

      {savedGrids.length > 0 ? (
        <div className="table-responsive">
          <table className="table table-bordered table-hover">
            <thead className="table-dark">
              <tr>
                <th>#</th>
                <th>Name</th>
                <th>Category</th>
                <th>Qty</th>
                <th>Price</th>
                <th>Stock Value</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {savedGrids.map((row, index) => (
                <tr key={index}>
                  <td>{index + 1}</td>
                  <td>{row.Name}</td>
                  <td>{row.Category}</td>
                  <td>{row.Qty}</td>
                  <td>${row.Price}</td>
                  <td>${row.Stock_Value}</td>
                  <td>
                    <PencilSquare
                      className="text-primary mx-2"
                      role="button"
                      title="Edit"
                      onClick={() => handleEdit(index)}
                    />
                    <Trash3
                      className="text-danger"
                      role="button"
                      title="Delete"
                      onClick={() => handleDelete(index)}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="text-center py-5">
          <h4 className="text-muted">No products found</h4>
          <p>Click "Add New Product" to get started</p>
        </div>
      )}
    </div>
  );
}
