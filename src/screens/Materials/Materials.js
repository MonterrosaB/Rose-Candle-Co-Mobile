import React from "react"; // Importa React
import { useMaterials } from "./hooks/useMaterials.js"; // Hook personalizado para manejar la lógica de materiales
import MaterialsView from "./components/MaterialsView.js"; // Componente UI que renderiza la lista de materiales

// Componente principal de la pantalla de materiales
export default function Materials() {
  // Llamamos al hook para obtener props necesarias
  const props = useMaterials(); 

  // Renderizamos la UI pasando todas las propiedades del hook
  return <MaterialsView {...props} />;
}
