import React from "react";
import useCategories from "./hooks/useCategories";
import CategoriesView from "./components/CategoriesView";

export default function Categories() {
  const hook = useCategories();
  return <CategoriesView {...hook} />;
}
