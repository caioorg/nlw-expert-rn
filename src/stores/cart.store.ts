import { createJSONStorage, persist } from "zustand/middleware"
import AsyncStorage from "@react-native-async-storage/async-storage"
import { create } from "zustand"
import * as cartInMemory from "./helpers/cart-in-memory"
import { ProductProps } from "@/utils/data/products"


export type ProductCarProps = ProductProps & {
  quantity?: number
}

type StateProps = {
  products: ProductCarProps[]
  addCart: (product: ProductProps) => void
  removeCart: (productId: string) => void
  clearCart: () => void
}

export const useCartStore = create(persist<StateProps>(set => ({
  products: [],
  addCart: (product: ProductProps) =>
    set((state) => ({
      products: cartInMemory.addCart(state.products, product)
    })),
  removeCart: (productId: string) =>
    set((state) => ({
      products: cartInMemory.removeCart(state.products, productId)
    })),
  clearCart: () => set(() => ({ products: [] }))
}), {
  name: "nlw-expert:cart",
  storage: createJSONStorage(() => AsyncStorage)
}))
