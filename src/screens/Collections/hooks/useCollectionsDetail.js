import { useState } from "react";
import { useNavigation, useRoute } from "@react-navigation/native";
import { Alert } from "react-native";

const ApiCollections = "https://rose-candle-co.onrender.com/api/collections";

export function useCollectionsDetail() {
  const navigation = useNavigation();
  const route = useRoute();
  const collection = route.params?.collection || null;

  const [name, setName] = useState(collection ? collection.name : "");
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    try {
      setSaving(true);
      const data = { name };
      const url = collection ? `${ApiCollections}/${collection._id}` : ApiCollections;
      const method = collection ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok)
        throw new Error(collection ? "Error al actualizar colección" : "Error al crear colección");

      Alert.alert("Éxito", collection ? "Colección actualizada." : "Colección creada.");
      navigation.goBack();
    } catch (error) {
      Alert.alert("Error", error.message);
    } finally {
      setSaving(false);
    }
  };

  return { collection, name, setName, saving, handleSave, navigation };
}
