import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Button, Card, Row, Col, Container, Badge } from "react-bootstrap";
import { RootState } from "../redux/store";
import { fetchProductsRequest } from "../redux/products/ProductAction";
import { FileEarmarkArrowDownFill, Search } from "react-bootstrap-icons";
import {
  generateSingleProductPDF,
  generateAllProductsPDF,
} from "../utils/pdfGenerator";
import {
  generateSingleProductExcel,
  generateAllProductsExcel,
} from "../utils/excelGenerator";

interface ProductType {
  id: number;
  title: string;
  price: number;
  description: string;
  category: string;
  image: string;
  rating: {
    rate: number;
    count: number;
  };
}

export function Product() {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const dispatch = useDispatch();
  const { products, loading, error } = useSelector(
    (state: RootState) => state.products
  );

  // Fetch products on mount
  useEffect(() => {
    dispatch(fetchProductsRequest() as any);
  }, [dispatch]);

  // Loading state
  if (loading) {
    return (
      <div className="text-center my-5">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="text-center my-5">
        <p className="text-danger">Error: {error}</p>
        <Button
          variant="dark"
          onClick={() => dispatch(fetchProductsRequest() as any)}
        >
          Retry
        </Button>
      </div>
    );
  }

  // Combined filter: Category + Search
  const filteredProducts = products.filter((product: ProductType) => {
    const matchesCategory =
      selectedCategory === "all" || product.category === selectedCategory;
    const matchesSearch = product.title
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  // Categories
  const categories = [
    { key: "all", label: "All" },
    { key: "men's clothing", label: "Men's Clothing" },
    { key: "women's clothing", label: "Women's Clothing" },
    { key: "jewelery", label: "Jewelery" },
    { key: "electronics", label: "Electronics" },
  ];

  const handleDownloadSinglePdfFile = (product: ProductType) => {
    generateSingleProductPDF(product);
  };

  const handleDownloadAllPdfFile = () => {
    generateAllProductsPDF(filteredProducts);
  };

  const handleDownloadSingleExcelSheet = async (product: ProductType) => {
    await generateSingleProductExcel(product);
  };

  const handleDownloadAllExcelSheet = async () => {
    await generateAllProductsExcel(filteredProducts);
  };

  return (
    <>
      {/* Search Bar with Icon */}
      <Container className="text-center mb-4">
        <div
          className="position-relative d-inline-block"
          style={{ width: "50%" }}
        >
          <Search
            className="position-absolute top-50 start-0 translate-middle-y ms-3 text-muted"
            size={20}
          />
          <input
            type="text"
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="rounded-3 w-100 py-2 px-5 border border-secondary"
            style={{ paddingLeft: "40px" }}
          />
        </div>
      </Container>

      {/* Category Filter Buttons */}
      <Container className="text-center mb-4">
        {categories.map((category) => (
          <Button
            key={category.key}
            variant={
              selectedCategory === category.key ? "dark" : "outline-dark"
            }
            className="m-2"
            onClick={() => setSelectedCategory(category.key)}
          >
            {category.label}
          </Button>
        ))}
        <Button
          variant="outline-primary"
          className="m-2"
          onClick={() => handleDownloadAllPdfFile()}
        >
          <FileEarmarkArrowDownFill className="me-2" />
          All Products PDF
        </Button>
        <Button
          variant="outline-primary"
          className="m-2"
          onClick={() => handleDownloadAllExcelSheet()}
        >
          <FileEarmarkArrowDownFill className="me-2" />
          All Products Excel
        </Button>
      </Container>

      {/* No Results Message */}
      {filteredProducts.length === 0 && (
        <Container className="text-center my-5">
          <p className="text-muted">No products found matching your search.</p>
        </Container>
      )}

      {/* Products Grid */}
      <Container className="my-4">
        <Row className="g-4">
          {filteredProducts.map((product: ProductType) => (
            <Col key={product.id} lg={6} xl={4} className="mb-4">
              <Card className="shadow-sm h-100" style={{ maxWidth: "100%" }}>
                <Row className="g-0 h-100">
                  <Col md={5}>
                    <Card.Img
                      src={product.image}
                      className="h-100 w-100"
                      style={{
                        objectFit: "contain",
                        backgroundColor: "#f8f9fa",
                        padding: "10px",
                      }}
                    />
                  </Col>
                  <Col md={7}>
                    <Card.Body className="d-flex flex-column h-100">
                      <div>
                        <Badge bg="secondary" className="mb-2">
                          {product.category}
                        </Badge>

                        <Card.Title
                          className="h6"
                          style={{ fontSize: "0.95rem" }}
                        >
                          {product.title.substring(0, 50)}...
                        </Card.Title>
                        <Card.Text style={{ fontSize: "0.8rem" }}>
                          {product.description.substring(0, 80)}...
                        </Card.Text>
                        <div className="mb-2">
                          <span className="text-warning">
                            {"★".repeat(Math.floor(product.rating.rate))}
                            {"☆".repeat(5 - Math.floor(product.rating.rate))}
                          </span>
                          <small className="text-muted ms-1">
                            ({product.rating.count})
                          </small>
                        </div>
                      </div>
                      <div className="mt-auto">
                        <div className="d-flex justify-content-between align-items-center">
                          <h5 className="text-success mb-0">
                            ${product.price}
                          </h5>
                          <Button variant="primary" size="sm">
                            Add to Cart
                          </Button>
                        </div>
                        <div className="d-flex justify-content-between align-items-center mt-3">
                          <Button
                            variant="outline-success"
                            size="sm"
                            style={{ fontSize: "1rem" }}
                            onClick={() =>
                              handleDownloadSingleExcelSheet(product)
                            }
                          >
                            <FileEarmarkArrowDownFill className="me-1" />
                            Excel
                          </Button>
                          <Button
                            variant="outline-success"
                            size="sm"
                            style={{ fontSize: "1rem" }}
                            onClick={() => handleDownloadSinglePdfFile(product)}
                          >
                            <FileEarmarkArrowDownFill className="me-1" />
                            PDF
                          </Button>
                        </div>
                      </div>
                    </Card.Body>
                  </Col>
                </Row>
              </Card>
            </Col>
          ))}
        </Row>
      </Container>

      {/* Footer */}
      <footer className="text-center py-4 bg-light mt-5">
        <p className="mb-0 text-muted">
          © 2025 FakeStore | Built with React Bootstrap
        </p>
      </footer>
    </>
  );
}
