import ExcelJS from "exceljs";
import { saveAs } from "file-saver";

// ✅ Product interface (adjust fields to match your real API)
export interface Product {
  id: number;
  title: string;
  price: number;
  category: string;
  description: string;
  image?: string;
}

/**
 * ✅ Generate Excel for a single product
 */
export const generateSingleProductExcel = async (
  product: Product
): Promise<void> => {
  const workbook = new ExcelJS.Workbook();
  const sheet = workbook.addWorksheet("Product Details");

  // Define columns
  sheet.columns = [
    { header: "Field", key: "field", width: 25 },
    { header: "Value", key: "value", width: 40 },
  ];

  // Add rows
  sheet.addRows([
    { field: "ID", value: product.id },
    { field: "Title", value: product.title },
    { field: "Price", value: `$${product.price}` },
    { field: "Category", value: product.category },
    { field: "Description", value: product.description },
  ]);

  // Header styling
  const headerRow = sheet.getRow(1);
  headerRow.font = { bold: true, color: { argb: "FFFFFF" } };
  headerRow.fill = {
    type: "pattern",
    pattern: "solid",
    fgColor: { argb: "0078D4" },
  };

  // Write to buffer
  const buffer = await workbook.xlsx.writeBuffer();
  saveAs(new Blob([buffer]), `${product.title}.xlsx`);
};

/**
 * ✅ Generate Excel for all products
 */
export const generateAllProductsExcel = async (
  products: Product[]
): Promise<void> => {
  const workbook = new ExcelJS.Workbook();
  const sheet = workbook.addWorksheet("All Products");

  // Define columns
  sheet.columns = [
    { header: "ID", key: "id", width: 10 },
    { header: "Title", key: "title", width: 35 },
    { header: "Price", key: "price", width: 15 },
    { header: "Category", key: "category", width: 25 },
    { header: "Description", key: "description", width: 50 },
  ];

  // Add all product rows
  products.forEach((p) => {
    sheet.addRow({
      id: p.id,
      title: p.title,
      price: `$${p.price}`,
      category: p.category,
      description: p.description,
    });
  });

  // Style header
  const headerRow = sheet.getRow(1);
  headerRow.font = { bold: true, color: { argb: "FFFFFF" } };
  headerRow.fill = {
    type: "pattern",
    pattern: "solid",
    fgColor: { argb: "0078D4" },
  };

  const buffer = await workbook.xlsx.writeBuffer();
  saveAs(new Blob([buffer]), `All_Products.xlsx`);
};
