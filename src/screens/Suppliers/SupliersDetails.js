import React from "react";
import { useSupplierDetails } from "./hooks/useSupplierDetails";
import { SupplierDetailsUI } from "./components/SupplierDetailsUI";

export default function SupplierDetails() {
  const supplierDetailsProps = useSupplierDetails();
  return <SupplierDetailsUI {...supplierDetailsProps} />;
}
