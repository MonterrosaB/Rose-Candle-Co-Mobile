import React from "react";
import useCategories from "./hooks/useCategories";
import CategoriesView from "./components/CategoriesView";

export default function Categories() {
  // Obtenemos todas las propiedades y funciones del hook
  const hook = useCategories();

  // Pasamos todo al componente de presentación
  return <CategoriesView {...hook} />;
}
