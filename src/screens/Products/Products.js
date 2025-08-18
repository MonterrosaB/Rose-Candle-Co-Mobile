import React from "react"; // Importa React para poder usar JSX
import { View } from "react-native"; // Importa View para contenedores en React Native
import { useProducts } from "./hooks/useProducts"; // Importa el hook personalizado que maneja la lógica de productos
import { ProductsUI } from "./components/ProductsUI"; // Importa el componente de interfaz de usuario de productos

// Componente principal de productos
export default function Products() {
  // Obtiene todas las propiedades y funciones necesarias del hook useProducts
  const productsProps = useProducts();

  return (
    // Contenedor principal que ocupa toda la pantalla
    <View style={{ flex: 1 }}>
      {/* Renderiza la interfaz de usuario de productos pasando todas las props del hook */}
      <ProductsUI {...productsProps} />
    </View>
  );
}
