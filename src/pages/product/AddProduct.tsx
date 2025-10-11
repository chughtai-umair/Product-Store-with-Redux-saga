import { useEffect, useMemo, useState } from "react";
import { Button, Table, Form } from "react-bootstrap";
import { PencilSquare, Trash3, XCircle } from "react-bootstrap-icons";
import { v4 as uuidv4 } from "uuid";
import { url } from "../../api/ProductApi";

interface Product {
  id: number;
  title: string;
  price: number;
}

interface GridRow {
  id: string;
  productId?: number;
  name: string;
  quantity: number;
  price: number;
  amount: number;
}

export function AddProduct() {
  const [rows, setRows] = useState<GridRow[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [savedGrids, setSavedGrids] = useState<GridRow[][]>([]);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);

  // Fetch products from API
  useEffect(() => {
    async function fetchProducts() {
      const res = await fetch(url);
      const data = await res.json();
      setProducts(data);
    }
    fetchProducts();

    // Load saved grids from localStorage
    const stored = localStorage.getItem("savedGrids");
    if (stored) {
      setSavedGrids(JSON.parse(stored));
    }
  }, []);

  // Add new row
  const addRow = () => {
    setRows([
      ...rows,
      { id: uuidv4(), name: "", quantity: 0, price: 0, amount: 0 },
    ]);
  };

  // Handle input changes
  const handleChange = (
    id: string,
    field: keyof GridRow,
    value: string | number
  ) => {
    setRows((prev) =>
      prev.map((row) =>
        row.id === id
          ? {
              ...row,
              [field]: value,
              amount:
                field === "quantity" || field === "price"
                  ? (field === "quantity" ? Number(value) : row.quantity) *
                    (field === "price" ? Number(value) : row.price)
                  : row.amount,
            }
          : row
      )
    );
  };

  // When user selects a product, auto fill price
  const handleProductSelect = (id: string, productId: string) => {
    const selected = products.find((p) => p.id === Number(productId));
    if (!selected) return;
    setRows((prev) =>
      prev.map((row) =>
        row.id === id
          ? {
              ...row,
              productId: selected.id,
              name: selected.title,
              price: selected.price,
              amount: row.quantity * selected.price,
            }
          : row
      )
    );
  };

  // Delete row
  const deleteRow = (id: string) => {
    setRows((prev) => prev.filter((row) => row.id !== id));
  };

  // Save rows to localStorage
  const handleSave = () => {
    if (rows.length === 0) return alert("No data to save!");
    const valid = rows.every((r) => r.name && r.quantity > 0 && r.price > 0);
    if (!valid) return alert("Please fill all fields before saving!");

    const updatedGrids = [...savedGrids, rows];
    setSavedGrids(updatedGrids);
    localStorage.setItem("savedGrids", JSON.stringify(updatedGrids));
    setRows([]);
    alert("Saved successfully!");
  };

  // Calculate totals
  const totals = useMemo(() => {
    const totalQuantity = rows.reduce((sum, r) => sum + (r.quantity || 0), 0);
    const totalAmount = rows.reduce((sum, r) => sum + (r.amount || 0), 0);
    return { totalQuantity, totalAmount };
  }, [rows]);

  const handleEdit = (index: number) => {
    const allItems = savedGrids.flat();
    const itemToEdit = allItems[index];

    // Remove item and rebuild savedGrids
    const newAllItems = allItems.filter((_, i) => i !== index);

    setSavedGrids(newAllItems.length > 0 ? [newAllItems] : []);
    // Add back to rows for editing
    setRows([...rows, itemToEdit]);
  };

  const handleDelete = (index: number) => {
    const allItems = savedGrids.flat();
    const updatedItems = allItems.filter((_, i) => i !== index);

    setSavedGrids(updatedItems.length > 0 ? [updatedItems] : []);
  };

  const truncateText = (text: string, maxLength: number = 30) => {
    return text.length > maxLength
      ? `${text.substring(0, maxLength)}...`
      : text;
  };

  return (
    <div className="container my-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h5>Product Grid</h5>
        <Button variant="dark" onClick={addRow}>
          Add Row
        </Button>
      </div>

      {/* Grid Table */}
      <Table bordered hover responsive>
        <thead className="table-dark">
          <tr>
            <th>Product</th>
            <th>Quantity</th>
            <th>Price ($)</th>
            <th>Amount</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {rows.length === 0 ? (
            <tr>
              <td colSpan={5} className="text-center">
                No rows added
              </td>
            </tr>
          ) : (
            rows.map((row) => (
              <tr key={row.id}>
                <td>
                  <Form.Select
                    value={row.productId || ""}
                    className="bg-light "
                    onChange={(e) =>
                      handleProductSelect(row.id, e.target.value)
                    }
                  >
                    <option value="" className="text-secondary">
                      Select Product
                    </option>
                    {products.map((p) => (
                      <option key={p.id} value={p.id}>
                        {truncateText(p.title, 40)}
                      </option>
                    ))}
                  </Form.Select>
                </td>
                <td>
                  <Form.Control
                    type="number"
                    min="0"
                    value={row.quantity}
                    onChange={(e) =>
                      handleChange(
                        row.id,
                        "quantity",
                        parseFloat(e.target.value)
                      )
                    }
                  />
                </td>
                <td>
                  <Form.Control
                    type="number"
                    value={row.price}
                    disabled
                    className="bg-light"
                  />
                </td>
                <td>
                  <Form.Control
                    type="number"
                    value={row.amount}
                    disabled
                    className="bg-light"
                  />
                </td>
                <td className="text-center">
                  <XCircle
                    className="text-danger"
                    size={20}
                    role="button"
                    onClick={() => deleteRow(row.id)}
                  />
                </td>
              </tr>
            ))
          )}
        </tbody>

        {/* Totals Row */}
        {rows.length > 0 && (
          <tfoot className="table-light">
            <tr>
              <td colSpan={1} className="text-end fw-bold">
                Total:
              </td>

              <td colSpan={4}>
                <div className="d-flex justify-content-between">
                  <div className="d-flex align-items-center">
                    <span className="fw-semibold me-2">Total Quantity:</span>
                    <Form.Control
                      type="number"
                      value={totals.totalQuantity}
                      className="text-end bg-secondary-subtle fw-bold"
                      style={{ width: "200px" }}
                      disabled
                    />
                  </div>

                  <div className="d-flex align-items-center">
                    <span className="fw-semibold me-2">Total Amount:</span>
                    <Form.Control
                      type="number"
                      value={totals.totalAmount}
                      className="text-end bg-secondary-subtle fw-bold"
                      style={{ width: "200px" }}
                      disabled
                    />
                  </div>
                </div>
              </td>
            </tr>
          </tfoot>
        )}
      </Table>

      {rows.length > 0 && (
        <div className="text-end">
          <Button variant="success" onClick={handleSave}>
            Save All
          </Button>
        </div>
      )}

      {/* Saved Grid List */}
      {savedGrids.length > 0 && (
        <div className="mt-5">
          <h5>Saved Product Grids (Total: {savedGrids.flat().length} items)</h5>
          <Table bordered size="sm" className="mt-3">
            <thead className="table-secondary">
              <tr>
                <th>#</th>
                <th>Product</th>
                <th>Quantity</th>
                <th>Price</th>
                <th>Amount</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {savedGrids.flat().map((r, i) => (
                <tr key={i}>
                  <td>{i + 1}</td>
                  <td>{r.name}</td>
                  <td>{r.quantity}</td>
                  <td>{r.price.toFixed(2)}</td>
                  <td>{r.amount.toFixed(2)}</td>
                  <td>
                    <PencilSquare
                      className="text-primary mx-2"
                      role="button"
                      onClick={() => handleEdit(i)}
                    />
                    <Trash3
                      className="text-danger  "
                      role="button"
                      onClick={() => handleDelete(i)}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
      )}
    </div>
  );
}
