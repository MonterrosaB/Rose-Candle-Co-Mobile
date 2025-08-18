import { useState } from "react";
import { useNavigation, useRoute } from "@react-navigation/native";
import { Alert } from "react-native";

export default function useCategoriesMateriaDetail() {
  const navigation = useNavigation();
  const route = useRoute();
  const category = route.params?.category ?? null;

  const [name, setName] = useState(category ? category.name : "");
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    if (!name.trim()) {
      Alert.alert("Error", "El nombre de la categoría es obligatorio.");
      return;
    }

    setSaving(true);
    try {
      const payload = { name: name.trim() };
      let res;

      if (category) {
        res = await fetch(
          `https://rose-candle-co.onrender.com/api/rawMaterialCategories/${category._id}`,
          {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
          }
        );
      } else {
        res = await fetch(
          "https://rose-candle-co.onrender.com/api/rawMaterialCategories",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
          }
        );
      }

      let body;
      try {
        body = await res.json();
      } catch {
        body = await res.text();
      }

      if (res.ok) {
        Alert.alert(
          category ? "Guardado" : "Creado",
          category
            ? "Los cambios se guardaron correctamente."
            : "Categoría creada correctamente."
        );
        navigation.goBack();
      } else {
        const errMsg =
          (body && (body.message || body.error || JSON.stringify(body))) ||
          `Respuesta del servidor: ${res.status}`;
        throw new Error(errMsg);
      }
    } catch (err) {
      console.error("Error guardando categoría:", err);
      Alert.alert("Error", err.message || "No se pudo guardar la categoría.");
    } finally {
      setSaving(false);
    }
  };

  return {
    name,
    setName,
    saving,
    handleSave,
    navigation,
    category,
  };
}
