// ProductList.tsx
import { useEffect, useState } from "react";
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
  const [groupedData, setGroupedData] = useState<any[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    loadGroupedData();
  }, []);

  const loadGroupedData = () => {
    const allRows = JSON.parse(localStorage.getItem("editRows") || "[]");
    const grouped = getGroupedData(allRows);
    setGroupedData(grouped);
  };

  const handleEdit = (groupId: string) => {
    const allRows = JSON.parse(localStorage.getItem("editRows") || "[]");
    const groupRows = allRows.filter((row: any) => row.groupId === groupId);

    if (groupRows.length === 0) return;

    console.log("✅ Loading for edit:", groupRows);
    localStorage.setItem("editItem", JSON.stringify(groupRows));
    localStorage.setItem("editMode", "true");
    localStorage.setItem("editGroupId", groupId);

    navigate("/practicelayout/practice");
  };

  const getGroupedData = (allRows: any[]) => {
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

  const handleDelete = (groupId: string) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this group!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        const allRows = JSON.parse(localStorage.getItem("editRows") || "[]");
        const updatedRows = allRows.filter(
          (row: any) => row.groupId !== groupId
        );

        localStorage.setItem("editRows", JSON.stringify(updatedRows));
        loadGroupedData();

        Swal.fire("Deleted!", "Your group has been deleted.", "success");
      }
    });
  };

  return (
    <div className="container mt-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Product Groups ({groupedData.length} groups)</h2>
        <button
          className="btn btn-primary"
          onClick={() => navigate("/practicelayout/practice")}
        >
          <Plus className="me-2" />
          Add New Group
        </button>
      </div>{" "}
      {groupedData.length > 0 ? (
        <div className="table-responsive">
          <table className="table table-bordered table-hover">
            <thead className="table-dark">
              <tr>
                <th>#</th>
                <th>Group ID</th>
                <th>Total Items</th>
                <th>Total Qty</th>
                <th>Total Amount</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {groupedData.map((group: any, index: number) => (
                <tr key={group.groupId}>
                  <td>{index + 1}</td>
                  <td>
                    <strong>Group {index + 1}</strong>
                    <br />
                    <small className="text-muted">{group.groupId}</small>
                  </td>
                  <td>
                    <span className="badge bg-info">
                      {group.rowCount} items
                    </span>
                  </td>
                  <td>
                    <span className="fw-bold text-primary">
                      {group.totalQty}
                    </span>
                  </td>
                  <td>
                    <span className="fw-bold text-success">
                      ${group.totalAmount.toFixed(2)}
                    </span>
                  </td>
                  <td>
                    <PencilSquare
                      className="text-primary mx-2"
                      role="button"
                      title="Edit Group"
                      size={18}
                      onClick={() => handleEdit(group.groupId)}
                    />
                    <Trash3
                      className="text-danger"
                      role="button"
                      title="Delete Group"
                      size={18}
                      onClick={() => handleDelete(group.groupId)}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="text-center py-5">
          <h4 className="text-muted">No product groups found</h4>
          <p>Click "Add New Product" to get started</p>
        </div>
      )}
    </div>
  );
}
