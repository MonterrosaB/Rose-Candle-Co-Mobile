import { useState, useEffect, useCallback } from "react";
import { Alert } from "react-native";

// Hook personalizado para manejar la lógica de empleados
export default function useEmployees() {
  const [employees, setEmployees] = useState([]); // Estado para la lista de empleados
  const [loading, setLoading] = useState(false); // Estado de carga

  // Función para obtener la lista de empleados desde la API
  const fetchEmployees = useCallback(async () => {
    try {
      setLoading(true); // Activar indicador de carga
      const response = await fetch("https://rose-candle-co.onrender.com/api/employees"); // Llamada a la API
      if (!response.ok) throw new Error("Error al cargar empleados"); // Manejo de error HTTP
      const data = await response.json(); // Parsear JSON
      setEmployees(data); // Guardar datos en estado
    } catch (error) {
      Alert.alert("Error", "No se pudo cargar la lista de empleados"); // Mostrar alerta en caso de fallo
    } finally {
      setLoading(false); // Desactivar indicador de carga
    }
  }, []);

  // Ejecutar la carga inicial al montar el hook
  useEffect(() => {
    fetchEmployees();
  }, [fetchEmployees]);

  // Retornar datos, estado de carga y función de refresco
  return { employees, loading, refresh: fetchEmployees };
}
