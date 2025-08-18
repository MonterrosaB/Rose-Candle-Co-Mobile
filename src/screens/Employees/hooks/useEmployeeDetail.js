import { useState, useEffect, useCallback } from "react";
import { Alert } from "react-native";

// Hook personalizado para manejar la lógica de detalle de un empleado
export default function useEmployeesDetail(id) {
  const [employee, setEmployee] = useState(null); // Estado para almacenar los datos del empleado
  const [loading, setLoading] = useState(false); // Estado de carga

  // Función para obtener los detalles de un empleado por su ID
  const fetchEmployee = useCallback(async () => {
    try {
      if (!id) return; // Si no hay ID, no hacer nada
      setLoading(true); // Activar indicador de carga
      const response = await fetch(`https://rose-candle-co.onrender.com/api/employees/${id}`); // Llamada a la API
      if (!response.ok) throw new Error("Error al cargar detalle"); // Manejo de error HTTP
      const data = await response.json(); // Parsear JSON
      setEmployee(data); // Guardar datos en estado
    } catch (error) {
      Alert.alert("Error", "No se pudo cargar la información del empleado"); // Mostrar alerta en caso de fallo
    } finally {
      setLoading(false); // Desactivar indicador de carga
    }
  }, [id]);

  // Ejecutar la carga al montar el hook o cuando cambie el ID
  useEffect(() => {
    fetchEmployee();
  }, [fetchEmployee]);

  // Retornar datos del empleado y estado de carga
  return { employee, loading };
}
