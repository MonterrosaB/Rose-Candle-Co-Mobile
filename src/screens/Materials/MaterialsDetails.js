import React from "react"; // Importa React
import { useMaterialsDetails } from "./hooks/useMaterialsDetails.js"; // Hook personalizado para manejar la lógica
import MaterialsDetailsView from "./components/MaterialsDetailsView.js"; // Componente UI que renderiza la pantalla

// Componente principal de la pantalla de detalles de materiales
export default function MaterialsDetails({ route, navigation }) {
  // Llamamos al hook pasando route y navigation
  const props = useMaterialsDetails({ route, navigation });

  // Renderizamos la UI pasando todas las propiedades del hook
  return <MaterialsDetailsView {...props} />;
}
