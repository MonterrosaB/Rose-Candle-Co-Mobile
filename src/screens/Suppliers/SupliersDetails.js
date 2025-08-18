// Importamos React para poder definir el componente
import React from "react";

// Importamos un *custom hook* que maneja la lógica relacionada a los detalles de un proveedor
// (ejemplo: obtener la info de un proveedor específico, actualizarlo, manejar estados de carga, etc.)
import { useSupplierDetails } from "./hooks/useSupplierDetails";

// Importamos el componente de UI que se encarga solo de mostrar los detalles del proveedor
import { SupplierDetailsUI } from "./components/SupplierDetailsUI";

// Componente contenedor principal
export default function SupplierDetails() {
  // Llamamos al hook para obtener toda la lógica y datos relacionados con el proveedor
  const supplierDetailsProps = useSupplierDetails();

  // Renderizamos la interfaz, pasando todas las props al componente de presentación
  return <SupplierDetailsUI {...supplierDetailsProps} />;
}
