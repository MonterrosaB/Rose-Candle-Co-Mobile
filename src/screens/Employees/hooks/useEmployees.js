import { useState, useEffect, useCallback } from "react";
import { Alert } from "react-native";

// Hook personalizado para manejar la lógica de empleados
export default function useEmployees() {
  const [employees, setEmployees] = useState([]); // Lista de empleados
  const [loading, setLoading] = useState(false); // Estado de carga

  // Obtener lista de empleados desde la API
  const fetchEmployees = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch("https://rose-candle-co.onrender.com/api/employees");
      if (!response.ok) throw new Error("Error al cargar empleados");
      const data = await response.json();
      setEmployees(data);
    } catch (error) {
      Alert.alert("Error", "No se pudo cargar la lista de empleados");
    } finally {
      setLoading(false);
    }
  }, []);

  // Eliminar empleado por ID
  const onDelete = async (id) => {
    try {
      const response = await fetch(`https://rose-candle-co.onrender.com/api/employees/${id}`, {
        method: "DELETE",
      });
      if (!response.ok) throw new Error("Error al eliminar empleado");
      // Actualizar la lista local eliminando el empleado
      setEmployees((prev) => prev.filter((emp) => emp._id !== id));
    } catch (error) {
      Alert.alert("Error", "No se pudo eliminar el empleado");
    }
  };

  // Actualizar o agregar empleado en la lista en vivo
  const updateEmployeeList = (employee) => {
    setEmployees((prev) => {
      const index = prev.findIndex((e) => e._id === employee._id);
      if (index >= 0) {
        // Actualizar empleado existente
        const newList = [...prev];
        newList[index] = employee;
        return newList;
      } else {
        // Agregar nuevo empleado al inicio
        return [employee, ...prev];
      }
    });
  };

  // Ejecutar la carga inicial
  useEffect(() => {
    fetchEmployees();
  }, [fetchEmployees]);

  // Retornar datos y funciones
  return { employees, loading, refresh: fetchEmployees, onDelete, updateEmployeeList };
}
