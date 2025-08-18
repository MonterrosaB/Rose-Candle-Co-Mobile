import React from "react";
import { View } from "react-native";
import { useCollections } from "./hooks/useCollections"; // Hook personalizado que maneja la lógica para la lista de colecciones
import { CollectionsUI } from "./components/CollectionsUI"; // Componente de UI que muestra la lista de colecciones

// Componente principal que muestra la lista de colecciones
export default function Collections() {
  // Obtenemos todas las propiedades necesarias desde el hook
  const collectionsProps = useCollections();

  return (
    // Contenedor principal que ocupa toda la pantalla
    <View style={{ flex: 1 }}>
      {/* Renderizamos la UI de colecciones pasando todas las propiedades del hook */}
      <CollectionsUI {...collectionsProps} />
    </View>
  );
}
