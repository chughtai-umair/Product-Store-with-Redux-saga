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

export type ProductRow = {
  Name: string;
  Category: string;
  Qty: number;
  Price: number;
  Stock_Value: number;
  groupId?: string;
  batch_id?: string;
  length?: number;
};

export type FormValues = {
  rows: ProductRow[];
};

export type GroupData = {
  groupId: string;
  rowCount: number;
  totalQty: number;
  totalAmount: number;
  rows: ProductRow[];
};
