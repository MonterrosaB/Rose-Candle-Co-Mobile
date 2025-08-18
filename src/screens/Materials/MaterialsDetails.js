import React from "react";
import { useMaterialsDetails } from "./hooks/useMaterialsDetails.js";
import MaterialsDetailsView from "./components/MaterialsDetailsView.js";

export default function MaterialsDetails({ route, navigation }) {
  const props = useMaterialsDetails({ route, navigation });
  return <MaterialsDetailsView {...props} />;
}
