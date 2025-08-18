import React from "react";
import { useRoute } from "@react-navigation/native"; // Hook para obtener parámetros de navegación
import useEmployeesDetail from "./hooks/useEmployeeDetail"; // Hook personalizado para lógica de detalle
import EmployeesDetailView from "./Components/EmployeesDetailView"; // Componente de presentación

// Componente que muestra el detalle de un empleado específico
export default function EmployeesDetail() {
  const route = useRoute(); // Obtener la ruta actual
  const { id } = route.params; // Extraer el parámetro 'id' de la navegación

  // Usar el hook personalizado para manejar la lógica y estados del detalle del empleado
  const props = useEmployeesDetail(id);

  // Renderizar el componente de vista pasando todas las propiedades del hook
  return <EmployeesDetailView {...props} />;
}
