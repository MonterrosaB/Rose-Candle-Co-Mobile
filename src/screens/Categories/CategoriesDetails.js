import React from "react";
import useCategoryDetails from "./hooks/useCategoryDetails";
import CategoriesDetailsView from "./components/CategoriesDetailsView";

export default function CategoriesDetails() {
  // Obtenemos todas las propiedades y funciones del hook
  const hook = useCategoryDetails();

  // Pasamos todo al componente de presentación
  return <CategoriesDetailsView {...hook} />;
}
