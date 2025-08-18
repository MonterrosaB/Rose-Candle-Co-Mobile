import { useState } from "react";
import { useNavigation, useRoute } from "@react-navigation/native";
import { Alert } from "react-native";

// URL base de la API para colecciones
const ApiCollections = "https://rose-candle-co.onrender.com/api/collections";

// Hook personalizado para manejar la lógica de detalle de una colección
export function useCollectionsDetail() {
  const navigation = useNavigation(); // Para navegar entre pantallas
  const route = useRoute(); // Para obtener parámetros enviados al navegar
  const collection = route.params?.collection || null; // Si se recibe una colección, la usamos; si no, es null

  // Estado del nombre de la colección
  const [name, setName] = useState(collection ? collection.name : "");
  // Estado de guardado, indica si se está enviando la información
  const [saving, setSaving] = useState(false);

  // Función para guardar la colección (crear o actualizar)
  const handleSave = async () => {
    try {
      setSaving(true); // Activamos el indicador de guardado
      const data = { name }; // Datos a enviar
      const url = collection ? `${ApiCollections}/${collection._id}` : ApiCollections; // Si hay colección, hacemos PUT, si no, POST
      const method = collection ? "PUT" : "POST";

      // Petición a la API
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!res.ok)
        throw new Error(collection ? "Error al actualizar colección" : "Error al crear colección");

      // Mensaje de éxito
      Alert.alert("Éxito", collection ? "Colección actualizada." : "Colección creada.");
      navigation.goBack(); // Volvemos a la pantalla anterior
    } catch (error) {
      Alert.alert("Error", error.message); // Mostramos cualquier error
    } finally {
      setSaving(false); // Desactivamos el indicador de guardado
    }
  };

  // Retornamos todos los valores y funciones necesarios para la UI
  return { collection, name, setName, saving, handleSave, navigation };
}
