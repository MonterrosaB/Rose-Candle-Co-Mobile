import { useState } from "react";
import { useNavigation, useRoute } from "@react-navigation/native";
import { Alert } from "react-native";

export const useSupplierDetails = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const supplier = route.params?.supplier || null;

  const [name, setName] = useState(supplier ? supplier.name : "");
  const [contact, setContact] = useState(supplier ? supplier.contact : "");
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    if (!name.trim() || !contact.trim()) {
      Alert.alert("Error", "Por favor completa todos los campos.");
      return;
    }

    setLoading(true);
    try {
      let res;
      if (supplier) {
        res = await fetch(
          `https://rose-candle-co.onrender.com/api/suppliers/${supplier._id}`,
          {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name, contact }),
          }
        );
      } else {
        res = await fetch("https://rose-candle-co.onrender.com/api/suppliers", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name, contact }),
        });
      }

      const data = await res.json();
      if (res.ok) {
        Alert.alert("Éxito", supplier ? "Proveedor actualizado." : "Proveedor agregado.");
        navigation.goBack();
      } else {
        const errMsg = data?.message || data?.error || `Respuesta inesperada: ${res.status}`;
        throw new Error(errMsg);
      }
    } catch (err) {
      console.error("Error guardando proveedor:", err);
      Alert.alert("Error", err.message || "No se pudo guardar el proveedor.");
    } finally {
      setLoading(false);
    }
  };

  return {
    supplier,
    name,
    contact,
    loading,
    setName,
    setContact,
    handleSave,
  };
};
