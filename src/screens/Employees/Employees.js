import React from "react";
import useEmployees from "./hooks/useEmployees"; // Hook personalizado que maneja la lógica de empleados
import EmployeesView from "./Components/EmployeesView"; // Componente de presentación
import { useNavigation } from "@react-navigation/native"; // Hook para la navegación entre pantallas

// Componente principal de la lista de empleados
export default function Employees() {
  const props = useEmployees(); // Obtener datos y funciones del hook personalizado
  const navigation = useNavigation(); // Obtener objeto de navegación

  // Renderizar el componente de presentación, pasando todas las props del hook y la navegación
  return <EmployeesView {...props} navigation={navigation} />;
}
