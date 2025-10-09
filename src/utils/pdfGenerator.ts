import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
(pdfMake as any).vfs = (pdfFonts as any).pdfMake?.vfs || pdfFonts;

export const generateSingleProductPDF = async (product: any) => {
  const base64Image = await getBase64ImageFromUrl(product.image);
  const docDefinition = {
    content: [
      { text: "Product Details", style: "header" },
      { text: "\n" },
      {
        columns: [
          base64Image
            ? {
                width: 120,
                image: base64Image,
                fit: [120, 120],
              }
            : {
                width: 120,
                text: "[No Image]",
                alignment: "center",
                margin: [0, 40, 0, 0],
              },
          {
            width: "*",
            text: [
              { text: `Title: ${product.title}\n\n`, bold: true },
              { text: `Category: `, bold: true },
              `${product.category}\n`,
              { text: `Price: `, bold: true },
              `$${product.price}\n`,
              { text: `Rating: `, bold: true },
              `${product.rating.rate} (${product.rating.count} reviews)\n`,
              { text: `Description:\n`, bold: true },
              product.description,
            ],
          },
        ],
      },
    ],
    styles: {
      header: {
        fontSize: 18,
        bold: true,
        alignment: "center",
        margin: [0, 0, 0, 10],
      },
    },
  };

  //   pdfMake.createPdf(docDefinition as any).download(`${product.title}.pdf`);
  pdfMake.createPdf(docDefinition as any).open();
};

export const generateAllProductsPDF = async (products: any[]) => {
  const productsWithImages = await Promise.all(
    products.map(async (product) => ({
      ...product,
      imageBase64: await getBase64ImageFromUrl(product.image),
    }))
  );

  const content = [
    { text: "All Products", style: "header" },
    ...productsWithImages.map((p) => ({
      columns: [
        p.imageBase64
          ? { image: p.imageBase64, width: 80, fit: [80, 80] }
          : { text: "[No Image]", width: 80, alignment: "center" },
        {
          text: [
            { text: `Title: ${p.title}\n\n`, bold: true },
            { text: `Category: `, bold: true },
            `${p.category}\n`,
            { text: `Price: `, bold: true },
            `$${p.price}\n`,
            { text: `Rating: `, bold: true },
            `${p.rating.rate} (${p.rating.count} reviews)\n`,
            { text: `Description:\n`, bold: true },
            p.description,
          ],
          margin: [10, 0, 0, 10],
        },
      ],
      margin: [0, 10, 0, 10],
    })),
  ];

  const docDefinition = {
    content,
    styles: {
      header: {
        fontSize: 22,
        bold: true,
        alignment: "center",
        margin: [0, 0, 0, 20],
      },
    },
  };

  //   pdfMake.createPdf(docDefinition as any).download("All_Products.pdf");
  pdfMake.createPdf(docDefinition as any).open();
};

export const getBase64ImageFromUrl = async (
  imageUrl: string
): Promise<string> => {
  try {
    // Use a CORS proxy for external images
    const proxyUrl = `https://corsproxy.io/?${encodeURIComponent(imageUrl)}`;

    const response = await fetch(proxyUrl);
    const blob = await response.blob();

    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  } catch (error) {
    console.error("Error converting image to base64:", error);
    throw error;
  }
};
