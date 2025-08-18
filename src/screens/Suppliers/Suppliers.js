import React from "react";
import { useSuppliers } from "./hooks/useSuppliers";
import { SuppliersUI } from "./components/SuppliersUI";

export default function Suppliers() {
  const suppliersProps = useSuppliers();
  return <SuppliersUI {...suppliersProps} />;
}
