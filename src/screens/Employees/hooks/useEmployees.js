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
      setEmployees(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("fetchEmployees error:", error);
      Alert.alert("Error", "No se pudo cargar la lista de empleados");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchEmployees();
  }, [fetchEmployees]);

  const onDelete = async (id) => {
    try {
      const response = await fetch(`https://rose-candle-co.onrender.com/api/employees/${id}`, {
        method: "DELETE",
      });
      if (!response.ok) throw new Error("Error al eliminar empleado");
      // actualizar estado local
      setEmployees((prev) => prev.filter((e) => e._id !== id));
    } catch (error) {
      console.error("onDelete error:", error);
      Alert.alert("Error", "No se pudo eliminar el empleado");
    }
  };

  return { employees, loading, refresh: fetchEmployees, onDelete };
}
