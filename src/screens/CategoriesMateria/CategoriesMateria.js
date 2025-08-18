import React from "react";
import useCategoriesMateria from "./hooks/useCategoriesMateria";
import CategoriesMateriaUI from "./components/CategoriesMateriaUI";

// Componente principal para la pantalla de categorías de materias
export default function CategoriesMateria() {
  // Se obtienen las props del hook personalizado
  const props = useCategoriesMateria();

  // Se renderiza la UI pasando todas las props del hook
  return <CategoriesMateriaUI {...props} />;
}
