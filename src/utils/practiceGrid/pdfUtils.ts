import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
import { ProductRow, GroupData } from "../../types";

// Initialize pdfMake with fonts
(pdfMake as any).vfs = (pdfFonts as any).pdfMake?.vfs || pdfFonts;

// Generate PDF for a single group
export const generateGroupPDF = (group: GroupData, groupIndex: number) => {
  try {
    const docDefinition = {
      content: [
        // Header
        {
          text: `Group ${groupIndex + 1} - Product Details`,
          style: "header",
        },
        {
          text: `Group ID: ${group.groupId}`,
          style: "subheader",
        },
        {
          text: `Total Items: ${group.rowCount} | Total Qty: ${
            group.totalQty
          } | Total Amount: $${group.totalAmount.toFixed(2)}`,
          style: "summary",
        },
        { text: "\n" },

        // Table
        {
          table: {
            headerRows: 1,
            widths: ["*", "*", "auto", "auto", "auto", "auto"],
            body: [
              // Header row
              [
                { text: "Name", style: "tableHeader" },
                { text: "Category", style: "tableHeader" },
                { text: "Qty", style: "tableHeader" },
                { text: "Price", style: "tableHeader" },
                { text: "Stock Value", style: "tableHeader" },
                { text: "Amount", style: "tableHeader" },
              ],
              // Data rows
              ...group.rows.map((row) => [
                row.Name,
                row.Category,
                row.Qty.toString(),
                `$${row.Price.toFixed(2)}`,
                row.Stock_Value.toString(),
                `$${(row.Qty * row.Price).toFixed(2)}`,
              ]),
              // Total row
              [
                { text: "TOTAL", style: "totalCell", colSpan: 2 },
                {},
                { text: group.totalQty.toString(), style: "totalCell" },
                { text: "", style: "totalCell" },
                { text: "", style: "totalCell" },
                {
                  text: `$${group.totalAmount.toFixed(2)}`,
                  style: "totalCell",
                },
              ],
            ],
          },
          layout: {
            fillColor: function (rowIndex: number) {
              return rowIndex === 0
                ? "#4472C4"
                : rowIndex % 2 === 0
                ? "#F2F2F2"
                : null;
            },
          },
        },
      ],
      styles: {
        header: {
          fontSize: 18,
          bold: true,
          alignment: "center",
          margin: [0, 0, 0, 10],
          color: "#2F4F4F",
        },
        subheader: {
          fontSize: 12,
          alignment: "center",
          margin: [0, 0, 0, 5],
          color: "#666666",
        },
        summary: {
          fontSize: 11,
          alignment: "center",
          margin: [0, 0, 0, 15],
          color: "#333333",
          bold: true,
        },
        tableHeader: {
          bold: true,
          fontSize: 10,
          color: "white",
          alignment: "center",
        },
        totalCell: {
          bold: true,
          fontSize: 10,
          alignment: "center",
          fillColor: "#E6E6E6",
        },
      },
      defaultStyle: {
        fontSize: 9,
      },
    };

    pdfMake
      .createPdf(docDefinition as any)
      .download(`Group_${groupIndex + 1}_${group.groupId}.pdf`);
    return { success: true };
  } catch (error) {
    console.error("❌ PDF Generation Error:", error);
    return { success: false, error };
  }
};

// Generate PDF for all groups
export const generateAllGroupsPDF = (groupedData: GroupData[]) => {
  try {
    const totalGroups = groupedData.length;
    const grandTotalQty = groupedData.reduce(
      (sum, group) => sum + group.totalQty,
      0
    );
    const grandTotalAmount = groupedData.reduce(
      (sum, group) => sum + group.totalAmount,
      0
    );

    const content: any[] = [
      // Main Header
      {
        text: "All Product Groups Report",
        style: "mainHeader",
      },
      {
        text: `Total Groups: ${totalGroups} | Grand Total Qty: ${grandTotalQty} | Grand Total Amount: $${grandTotalAmount.toFixed(
          2
        )}`,
        style: "grandSummary",
      },
      { text: "\n" },
    ];

    // Add each group
    groupedData.forEach((group, index) => {
      content.push(
        // Group Header
        {
          text: `Group ${index + 1} - ${group.groupId}`,
          style: "groupHeader",
        },
        {
          text: `Items: ${group.rowCount} | Qty: ${
            group.totalQty
          } | Amount: $${group.totalAmount.toFixed(2)}`,
          style: "groupSummary",
        },

        // Group Table
        {
          table: {
            headerRows: 1,
            widths: ["*", "*", "auto", "auto", "auto", "auto"],
            body: [
              // Header
              [
                { text: "Name", style: "tableHeader" },
                { text: "Category", style: "tableHeader" },
                { text: "Qty", style: "tableHeader" },
                { text: "Price", style: "tableHeader" },
                { text: "Stock Value", style: "tableHeader" },
                { text: "Amount", style: "tableHeader" },
              ],
              // Rows
              ...group.rows.map((row) => [
                row.Name,
                row.Category,
                row.Qty.toString(),
                `$${row.Price.toFixed(2)}`,
                row.Stock_Value.toString(),
                `$${(row.Qty * row.Price).toFixed(2)}`,
              ]),
            ],
          },
          layout: {
            fillColor: function (rowIndex: number) {
              return rowIndex === 0
                ? "#4472C4"
                : rowIndex % 2 === 0
                ? "#F8F9FA"
                : null;
            },
          },
          margin: [0, 0, 0, 15],
        }
      );

      // Add page break except for last group
      if (index < groupedData.length - 1) {
        content.push({ text: "", pageBreak: "after" });
      }
    });

    const docDefinition = {
      content,
      styles: {
        mainHeader: {
          fontSize: 20,
          bold: true,
          alignment: "center",
          margin: [0, 0, 0, 10],
          color: "#1F4E79",
        },
        grandSummary: {
          fontSize: 12,
          alignment: "center",
          margin: [0, 0, 0, 20],
          color: "#333333",
          bold: true,
          background: "#E7F3FF",
        },
        groupHeader: {
          fontSize: 14,
          bold: true,
          margin: [0, 15, 0, 5],
          color: "#2F4F4F",
        },
        groupSummary: {
          fontSize: 10,
          margin: [0, 0, 0, 10],
          color: "#666666",
          bold: true,
        },
        tableHeader: {
          bold: true,
          fontSize: 9,
          color: "white",
          alignment: "center",
        },
      },
      defaultStyle: {
        fontSize: 8,
      },
      pageMargins: [40, 60, 40, 60],
    };

    pdfMake
      .createPdf(docDefinition as any)
      .download(
        `All_Groups_Report_${new Date().toISOString().split("T")[0]}.pdf`
      );
    return { success: true };
  } catch (error) {
    console.error("❌ PDF Generation Error:", error);
    return { success: false, error };
  }
};

// Generate PDF for groups summary only (table format)
export const generateGroupsSummaryPDF = (groupedData: GroupData[]) => {
  try {
    const totalGroups = groupedData.length;
    const grandTotalQty = groupedData.reduce(
      (sum, group) => sum + group.totalQty,
      0
    );
    const grandTotalAmount = groupedData.reduce(
      (sum, group) => sum + group.totalAmount,
      0
    );

    const docDefinition = {
      content: [
        {
          text: "Product Groups Summary",
          style: "header",
        },
        { text: "\n" },

        // Summary Table
        {
          table: {
            headerRows: 1,
            widths: ["auto", "*", "auto", "auto", "auto"],
            body: [
              // Header
              [
                { text: "#", style: "tableHeader" },
                { text: "Group ID", style: "tableHeader" },
                { text: "Total Items", style: "tableHeader" },
                { text: "Total Qty", style: "tableHeader" },
                { text: "Total Amount", style: "tableHeader" },
              ],
              // Data rows
              ...groupedData.map((group, index) => [
                (index + 1).toString(),
                `Group ${index + 1}\n${group.groupId}`,
                group.rowCount.toString(),
                group.totalQty.toString(),
                `$${group.totalAmount.toFixed(2)}`,
              ]),
              // Grand Total
              [
                { text: "GRAND TOTAL", style: "totalCell", colSpan: 2 },
                {},
                { text: totalGroups.toString(), style: "totalCell" },
                { text: grandTotalQty.toString(), style: "totalCell" },
                { text: `$${grandTotalAmount.toFixed(2)}`, style: "totalCell" },
              ],
            ],
          },
          layout: {
            fillColor: function (rowIndex: number) {
              return rowIndex === 0
                ? "#4472C4"
                : rowIndex % 2 === 0
                ? "#F2F2F2"
                : null;
            },
          },
        },
      ],
      styles: {
        header: {
          fontSize: 18,
          bold: true,
          alignment: "center",
          margin: [0, 0, 0, 20],
          color: "#2F4F4F",
        },
        tableHeader: {
          bold: true,
          fontSize: 10,
          color: "white",
          alignment: "center",
        },
        totalCell: {
          bold: true,
          fontSize: 10,
          alignment: "center",
          fillColor: "#D4E6F1",
        },
      },
      defaultStyle: {
        fontSize: 9,
      },
    };

    pdfMake
      .createPdf(docDefinition as any)
      .download(`Groups_Summary_${new Date().toISOString().split("T")[0]}.pdf`);
    return { success: true };
  } catch (error) {
    console.error("❌ PDF Generation Error:", error);
    return { success: false, error };
  }
};
