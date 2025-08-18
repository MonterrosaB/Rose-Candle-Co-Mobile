import React from "react";
import useEmployees from "./hooks/useEmployees";
import EmployeesView from "./Components/EmployeesView";
import { useNavigation } from "@react-navigation/native";

export default function Employees() {
  const props = useEmployees();
  const navigation = useNavigation(); // obtenemos navigation aquí

  return <EmployeesView {...props} navigation={navigation} />;
}
