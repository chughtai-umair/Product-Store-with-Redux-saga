import { Product } from "../components/Product";
import { Container } from "react-bootstrap";
import { AddProduct } from "./product/AddProduct";
import { ListProduct } from "./product/ListProduct";

export function Main() {
  return (
    <>
      <Container className="py-4">
        <div className="text-center mb-4">
          <h1 className="mb-3">Welcome to Our Store</h1>
          <p className="mb-4 text-muted">
            Discover a variety of products at unbeatable prices!
          </p>
        </div>

        <Product />
      </Container>
    </>
  );
}
