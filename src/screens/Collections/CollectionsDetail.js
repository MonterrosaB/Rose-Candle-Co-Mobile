import React from "react";
import { View } from "react-native";
import { useCollectionsDetail } from "./hooks/useCollectionsDetail"; // Hook personalizado para manejar la lógica de detalle de colecciones
import { CollectionsDetailUI } from "./components/CollectionsDetailUI"; // Componente de UI que muestra los detalles

// Componente principal de detalle de colecciones
export default function CollectionsDetail() {
  // Obtenemos todas las propiedades necesarias desde el hook
  const detailProps = useCollectionsDetail();

  return (
    // Contenedor principal que ocupa toda la pantalla
    <View style={{ flex: 1 }}>
      {/* Renderizamos la UI pasando todas las propiedades del hook */}
      <CollectionsDetailUI {...detailProps} />
    </View>
  );
}
