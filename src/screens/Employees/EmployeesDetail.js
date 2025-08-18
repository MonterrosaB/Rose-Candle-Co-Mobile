import React from "react";
import { useRoute } from "@react-navigation/native";
import useEmployeesDetail from "./hooks/useEmployeeDetail";
import EmployeesDetailView from "./Components/EmployeesDetailView";

export default function EmployeesDetail() {
  const route = useRoute();
  const { id } = route.params;
  const props = useEmployeesDetail(id);
  return <EmployeesDetailView {...props} />;
}
