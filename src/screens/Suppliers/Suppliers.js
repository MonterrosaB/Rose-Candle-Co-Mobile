// Importamos React, necesario para definir componentes funcionales
import React from "react";

// Importamos un *custom hook* que contiene la lógica de negocio relacionada con proveedores
// (ejemplo: obtener lista, manejar loading, manejar errores, etc.)
import { useSuppliers } from "./hooks/useSuppliers";

// Importamos el componente de presentación (UI), que se encarga únicamente de mostrar los datos
import { SuppliersUI } from "./components/SuppliersUI";

// Componente principal Suppliers
export default function Suppliers() {
  // Llamamos al custom hook para obtener todas las props necesarias (estado, funciones, etc.)
  const suppliersProps = useSuppliers();

  // Renderizamos el componente de UI, pasando las props mediante spread operator {...}
  // Esto hace que SuppliersUI reciba directamente todas las propiedades generadas por useSuppliers
  return <SuppliersUI {...suppliersProps} />;
}
