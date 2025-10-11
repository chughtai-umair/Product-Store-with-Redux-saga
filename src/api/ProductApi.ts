import { Products } from "../types";
export const url = "https://fakestoreapi.com/products";

export async function fetchProductsApi(): Promise<Products[]> {
  try {
    const res = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    console.log("Fetch products response status:", res.status);

    const body = await res.json().catch(() => ({}));

    if (!res.ok) {
      const err =
        (body && (body as any).error) ||
        res.statusText ||
        "Fetch products failed";
      throw new Error(err);
    }

    return body as Products[];
  } catch (error) {
    console.error("Error fetching products:", error);
    throw error;
  }
}
