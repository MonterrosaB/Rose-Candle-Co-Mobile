import { useState } from "react";
import { useNavigation, useRoute } from "@react-navigation/native";
import { Alert } from "react-native";

const ApiCategories = "https://rose-candle-co.onrender.com/api/productCategories";

export default function useCategoryDetails() {
  const navigation = useNavigation();
  const route = useRoute();
  const category = route.params?.category || null;

  const [name, setName] = useState(category ? category.name : "");
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    try {
      setSaving(true);
      const data = { name };
      const url = category ? `${ApiCategories}/${category._id}` : ApiCategories;
      const method = category ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!res.ok)
        throw new Error(category ? "Error al actualizar categoría" : "Error al crear categoría");

      Alert.alert("Éxito", category ? "Categoría actualizada." : "Categoría creada.");
      navigation.goBack();
    } catch (error) {
      Alert.alert("Error", error.message);
    } finally {
      setSaving(false);
    }
  };

  return {
    category,
    name,
    setName,
    saving,
    handleSave,
    navigation,
  };
}
