import React from "react";
import { View } from "react-native";
import { useProductDetail } from "./hooks/useProductDetail";
import { ProductDetailUI } from "./components/ProductDetailUI";

export default function ProductDetail({ route, navigation }) {
  const productDetailProps = useProductDetail(route.params.product, navigation);

  return (
    <View style={{ flex: 1 }}>
      <ProductDetailUI {...productDetailProps} />
    </View>
  );
}
