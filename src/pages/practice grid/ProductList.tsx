// ProductList.tsx
import { useEffect, useState } from "react";
import { PencilSquare, Trash3, FileEarmarkPdf } from "react-bootstrap-icons";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

// Import utilities
import {
  getGroupedData,
  deleteGroupFromLocalStorage,
} from "../../utils/practiceGrid/localStorageUtils";
import {
  generateGroupPDF,
  generateAllGroupsPDF,
  generateGroupsSummaryPDF,
} from "../../utils/practiceGrid/pdfUtils";

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
    const grouped = getGroupedData();
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
        const result = deleteGroupFromLocalStorage(groupId);

        if (result.success) {
          loadGroupedData();
          Swal.fire("Deleted!", "Your group has been deleted.", "success");
        } else {
          Swal.fire("Error!", "Failed to delete the group.", "error");
        }
      }
    });
  };

  // PDF Functions
  const handleGeneratePDF = (group: any, index: number) => {
    const result = generateGroupPDF(group, index);
    if (result.success) {
      Swal.fire({
        icon: "success",
        title: "PDF Generated!",
        text: "Group PDF has been downloaded.",
        timer: 2000,
        showConfirmButton: false,
      });
    } else {
      Swal.fire({
        icon: "error",
        title: "PDF Generation Failed",
        text: "Failed to generate PDF. Please try again.",
      });
    }
  };

  const handleGenerateAllPDF = () => {
    if (groupedData.length === 0) {
      Swal.fire({
        icon: "warning",
        title: "No Data",
        text: "No groups available to generate PDF.",
      });
      return;
    }

    const result = generateAllGroupsPDF(groupedData);
    if (result.success) {
      Swal.fire({
        icon: "success",
        title: "PDF Generated!",
        text: "All groups PDF has been downloaded.",
        timer: 2000,
        showConfirmButton: false,
      });
    } else {
      Swal.fire({
        icon: "error",
        title: "PDF Generation Failed",
        text: "Failed to generate PDF. Please try again.",
      });
    }
  };
  const handleGenerateSummaryPDF = () => {
    if (groupedData.length === 0) {
      Swal.fire({
        icon: "warning",
        title: "No Data",
        text: "No groups available to generate PDF.",
      });
      return;
    }

    const result = generateGroupsSummaryPDF(groupedData);
    if (result.success) {
      Swal.fire({
        icon: "success",
        title: "PDF Generated!",
        text: "Groups summary PDF has been downloaded.",
        timer: 2000,
        showConfirmButton: false,
      });
    } else {
      Swal.fire({
        icon: "error",
        title: "PDF Generation Failed",
        text: "Failed to generate PDF. Please try again.",
      });
    }
  };

  // Calculate grand totals
  const calculateGrandTotals = () => {
    const grandTotalItems = groupedData.reduce(
      (sum, group) => sum + group.rowCount,
      0
    );
    const grandTotalQty = groupedData.reduce(
      (sum, group) => sum + group.totalQty,
      0
    );
    const grandTotalAmount = groupedData.reduce(
      (sum, group) => sum + group.totalAmount,
      0
    );

    return {
      totalItems: grandTotalItems,
      totalQty: grandTotalQty,
      totalAmount: grandTotalAmount,
    };
  };

  const { totalItems, totalQty, totalAmount } = calculateGrandTotals();

  return (
    <div className="container mt-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Product Groups ({groupedData.length} groups)</h2>
        <div className="d-flex gap-2">
          <button
            className="btn btn-outline-danger btn-sm"
            onClick={handleGenerateAllPDF}
            disabled={groupedData.length === 0}
          >
            <FileEarmarkPdf className="me-1" />
            All Groups PDF
          </button>
          <button
            className="btn btn-outline-info btn-sm"
            onClick={handleGenerateSummaryPDF}
            disabled={groupedData.length === 0}
          >
            <FileEarmarkPdf className="me-1" />
            Summary PDF
          </button>
        </div>
      </div>

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
                <th>PDF</th>
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
                    <span className="fw-bold text-primary">
                      {group.rowCount}{" "}
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
                  <td>
                    <button
                      className="btn btn-outline-danger btn-sm"
                      onClick={() => handleGeneratePDF(group, index)}
                      title="Generate PDF for this group"
                    >
                      <FileEarmarkPdf className="me-1" />
                      PDF
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>{" "}
            <tfoot className="table-success">
              <tr>
                <td colSpan={2} className="text-end fw-bold">
                  GRAND TOTALS:
                </td>
                <td className="fw-bold text-primary">{totalItems} </td>
                <td className="fw-bold text-primary">{totalQty}</td>
                <td colSpan={3} className="fw-bold text-success">
                  ${totalAmount.toFixed(2)}
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      ) : (
        <div className="text-center py-5">
          <h4 className="text-muted">No product groups found</h4>
          <p>Click "Add New Group" to get started</p>
        </div>
      )}
    </div>
  );
}
