import React from "react";
import { useMaterials } from "./hooks/useMaterials.js";
import MaterialsView from "./components/MaterialsView.js";

export default function Materials() {
  const props = useMaterials(); 
  return <MaterialsView {...props} />;
}
