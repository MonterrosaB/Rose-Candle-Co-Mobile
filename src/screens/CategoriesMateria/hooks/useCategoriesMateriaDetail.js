import { useState } from "react";
import { useNavigation, useRoute } from "@react-navigation/native";
import { Alert } from "react-native";

// Hook personalizado para manejar la lógica de detalle de categoría de materias primas
export default function useCategoriesMateriaDetail() {
  const navigation = useNavigation();
  const route = useRoute();

  // Se obtiene la categoría desde los parámetros de la ruta, si existe
  const category = route.params?.category ?? null;

  // Estado para el nombre de la categoría y para indicar si se está guardando
  const [name, setName] = useState(category ? category.name : "");
  const [saving, setSaving] = useState(false);

  // Función que guarda o crea la categoría según corresponda
  const handleSave = async () => {
    // Validación básica: nombre obligatorio
    if (!name.trim()) {
      Alert.alert("Error", "El nombre de la categoría es obligatorio.");
      return;
    }

    setSaving(true);
    try {
      const payload = { name: name.trim() };
      let res;

      // Si existe categoría, se hace PUT para actualizar; si no, POST para crear
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

      // Se intenta parsear JSON, si falla se toma como texto plano
      let body;
      try {
        body = await res.json();
      } catch {
        body = await res.text();
      }

      // Si la respuesta es correcta, se notifica al usuario y se regresa
      if (res.ok) {
        Alert.alert(
          category ? "Guardado" : "Creado",
          category
            ? "Los cambios se guardaron correctamente."
            : "Categoría creada correctamente."
        );
        navigation.goBack();
      } else {
        // Manejo de error detallado según la respuesta del servidor
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

  // Se retornan todos los valores y funciones necesarios para el componente UI
  return {
    name,
    setName,
    saving,
    handleSave,
    navigation,
    category,
  };
}
