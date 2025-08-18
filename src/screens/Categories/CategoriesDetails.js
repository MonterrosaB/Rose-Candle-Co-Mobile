import React from "react";
import useCategoryDetails from "./hooks/useCategoryDetails";
import CategoriesDetailsView from "./components/CategoriesDetailsView";

export default function CategoriesDetails() {
  const hook = useCategoryDetails();
  return <CategoriesDetailsView {...hook} />;
}
