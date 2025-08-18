import React from "react";
import { View } from "react-native";
import { useProducts } from "./hooks/useProducts";
import { ProductsUI } from "./components/ProductsUI";

export default function Products() {
  const productsProps = useProducts();

  return (
    <View style={{ flex: 1 }}>
      <ProductsUI {...productsProps} />
    </View>
  );
}
