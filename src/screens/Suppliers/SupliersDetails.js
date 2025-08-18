import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
} from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";

export default function SupplierDetails() {
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
        // Actualizar proveedor existente
        res = await fetch(`https://rose-candle-co.onrender.com/api/suppliers/${supplier._id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name, contact }),
        });
      } else {
        // Crear proveedor nuevo
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
        const errMsg =
          data?.message || data?.error || `Respuesta inesperada: ${res.status}`;
        throw new Error(errMsg);
      }
    } catch (err) {
      console.error("Error guardando proveedor:", err);
      Alert.alert("Error", err.message || "No se pudo guardar el proveedor.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        {supplier ? "Editar Proveedor" : "Agregar Proveedor"}
      </Text>

      <TextInput
        style={styles.input}
        placeholder="Nombre del proveedor"
        value={name}
        onChangeText={setName}
      />

      <TextInput
        style={styles.input}
        placeholder="Contacto"
        value={contact}
        onChangeText={setContact}
      />

      <TouchableOpacity
        style={styles.saveButton}
        onPress={handleSave}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.saveText}>Guardar</Text>
        )}
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: "#F9F7F3" },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 20,
    marginTop: 60,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    backgroundColor: "#fff",
    borderRadius: 6,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    marginBottom: 12,
  },
  saveButton: {
    backgroundColor: "#A78A5E",
    paddingVertical: 12,
    borderRadius: 6,
    alignItems: "center",
    marginTop: 10,
  },
  saveText: { color: "#fff", fontWeight: "bold", fontSize: 16 },
});
