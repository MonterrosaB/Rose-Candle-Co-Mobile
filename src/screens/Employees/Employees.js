import React from "react";
import useEmployees from "./hooks/useEmployees";
import EmployeesView from "./Components/EmployeesView";

export default function Employees() {
  const props = useEmployees();

  // Pasamos updateEmployeeList a EmployeesView
  return <EmployeesView {...props} />;
}
