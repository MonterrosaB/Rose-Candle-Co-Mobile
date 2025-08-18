import React from "react";
import useCategoriesMateriaDetail from "./hooks/useCategoriesMateriaDetail";
import CategoriesMateriaDetailUI from "./components/CategoriesMateriaDetailUI";

// Componente principal para la pantalla de detalle de categoría de materia
export default function CategoriesMateriaDetail() {
  // Se obtienen las props del hook personalizado
  const props = useCategoriesMateriaDetail();

  // Se renderiza la UI pasando todas las props del hook
  return <CategoriesMateriaDetailUI {...props} />;
}
