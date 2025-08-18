import React from "react";
import useCategoriesMateria from "./hooks/useCategoriesMateria";
import CategoriesMateriaUI from "./components/CategoriesMateriaUI";

export default function CategoriesMateria() {
  const props = useCategoriesMateria(); 
  return <CategoriesMateriaUI {...props} />;
}
