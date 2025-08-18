import { useState, useEffect, useCallback } from "react";
import { Alert } from "react-native";

export default function useEmployees() {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(false);

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

  useEffect(() => {
    fetchEmployees();
  }, [fetchEmployees]);

  return { employees, loading, refresh: fetchEmployees };
}
