import React, { useCallback } from "react";
import EmployeesView from "./Components/EmployeesView";
import useEmployees from "./hooks/useEmployees";
import { useFocusEffect } from "@react-navigation/native";

export default function Employees() {
  const { employees, loading, refresh, onDelete } = useEmployees();

  // Refrescar cuando la pantalla gana foco (al volver desde detalle)
  useFocusEffect(
    useCallback(() => {
      refresh();
    }, [refresh])
  );

  return (
    <EmployeesView
      employees={employees}
      loading={loading}
      refresh={refresh}
      onDelete={onDelete}
    />
  );
}
