export type UserCredentials = {
  email: string;
  password: string;
};

export type LoginResponse = {
  token: string;
};

export type Products = {
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
};
export type CartItem = {
  product: Products;
  quantity: number;
};
export type CartState = {
  items: CartItem[];
};
