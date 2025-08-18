import React from "react";
import useCategoriesMateriaDetail from "./hooks/useCategoriesMateriaDetail";
import CategoriesMateriaDetailUI from "./components/CategoriesMateriaDetailUI";

export default function CategoriesMateriaDetail() {
  const props = useCategoriesMateriaDetail();
  return <CategoriesMateriaDetailUI {...props} />;
}
