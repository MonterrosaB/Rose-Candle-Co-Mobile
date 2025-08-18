import React from "react"; // Importa React para poder usar JSX
import { View } from "react-native"; // Importa View para contenedores en React Native
import { useProductDetail } from "./hooks/useProductDetail"; // Importa el hook personalizado para manejar la lógica de detalle de producto
import { ProductDetailUI } from "./components/ProductDetailUI"; // Importa el componente de interfaz de usuario para detalle de producto

// Componente principal para mostrar el detalle de un producto
export default function ProductDetail({ route, navigation }) {
  // Obtiene las propiedades y funciones necesarias del hook useProductDetail
  // Se le pasa el producto recibido por params de la ruta y el objeto navigation
  const productDetailProps = useProductDetail(route.params.product, navigation);

  return (
    // Contenedor principal que ocupa toda la pantalla
    <View style={{ flex: 1 }}>
      {/* Renderiza la interfaz de detalle del producto pasando todas las props del hook */}
      <ProductDetailUI {...productDetailProps} />
    </View>
  );
}
