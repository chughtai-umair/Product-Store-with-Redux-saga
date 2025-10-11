import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface GridItem {
  id: number;
  title: string;
  price: number;
  quantity: number;
  total: number;
}

interface GridState {
  items: GridItem[];
}

const loadFromLocalStorage = (): GridItem[] => {
  try {
    const data = localStorage.getItem("gridItems");
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
};

const saveToLocalStorage = (items: GridItem[]) => {
  localStorage.setItem("gridItems", JSON.stringify(items));
};

const initialState: GridState = {
  items: loadFromLocalStorage(),
};

const gridSlice = createSlice({
  name: "grid",
  initialState,
  reducers: {
    addItem: (state, action: PayloadAction<GridItem>) => {
      state.items.push(action.payload);
      saveToLocalStorage(state.items);
    },
    removeItem: (state, action: PayloadAction<number>) => {
      state.items = state.items.filter((i) => i.id !== action.payload);
      saveToLocalStorage(state.items);
    },
  },
});

export const { addItem, removeItem } = gridSlice.actions;
export default gridSlice.reducer;
