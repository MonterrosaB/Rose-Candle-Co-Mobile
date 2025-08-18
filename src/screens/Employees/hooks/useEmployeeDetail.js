import { useState, useEffect, useCallback } from "react";
import { Alert } from "react-native";

export default function useEmployeesDetail(id) {
  const [employee, setEmployee] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchEmployee = useCallback(async () => {
    try {
      if (!id) return; // si es nuevo, no carga nada
      setLoading(true);
      const response = await fetch(`https://rose-candle-co.onrender.com/api/employees/${id}`);
      if (!response.ok) throw new Error("Error al cargar detalle");
      const data = await response.json();
      setEmployee(data);
    } catch (error) {
      Alert.alert("Error", "No se pudo cargar la información del empleado");
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchEmployee();
  }, [fetchEmployee]);

  return { employee, loading };
}
