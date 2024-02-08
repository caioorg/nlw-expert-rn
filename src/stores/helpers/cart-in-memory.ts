import { ProductCarProps } from "../cart.store";

export function addCart(products: ProductCarProps[], newProduct: ProductCarProps) {
  const existingProduct = products.find(({ id }) => newProduct.id === id)

  if (existingProduct) {
    return products.map((product) => existingProduct.id === product.id 
    ? {...product, quantity: product.quantity! + 1 }
    : {...product}
  )}

  return [...products, { ...newProduct, quantity: 1 }]
}

export function removeCart(products: ProductCarProps[], productId: string) {
  const updatedProducts = products.map((product => (
    product.id === productId ? 
    {
      ...product,
      quantity:  product.quantity! > 1 ? product.quantity! - 1 : 0
    } : product
  )))

  return updatedProducts.filter((product) => product.quantity! > 0)
}