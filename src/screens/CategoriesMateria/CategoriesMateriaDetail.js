import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  ActivityIndicator,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import { useNavigation, useRoute } from "@react-navigation/native";

export default function CategoriesMateriaDetail() {
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
        // editar
        res = await fetch(
          `https://rose-candle-co.onrender.com/api/rawMaterialCategories/${category._id}`,
          {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
          }
        );
      } else {
        // crear
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
      } catch (e) {
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

  return (
    <View style={styles.screen}>
      <ScrollView contentContainerStyle={styles.container}>
        {/* Encabezado gris con flecha y texto */}
        <View style={styles.headerContainer}>
          <View style={styles.headerRow}>
            <TouchableOpacity onPress={() => navigation.navigate("CategoriesMateria")}>
              <Feather name="arrow-left" size={28} color="#a0522d" />
            </TouchableOpacity>
            <Text style={styles.header}>
              {category ? "Editar Categoría" : "Agregar Categoría"}
            </Text>
          </View>
        </View>

        {/* Formulario */}
        <Text style={styles.label}>Nombre de la categoría</Text>
        <TextInput
          style={styles.input}
          value={name}
          onChangeText={setName}
        />

        {/* Botones */}
        <View style={styles.buttonsContainer}>
          <TouchableOpacity
            style={[styles.button, styles.saveButton]}
            onPress={handleSave}
            disabled={saving}
          >
            {saving ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.buttonText}>Guardar</Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.button, styles.cancelButton]}
            onPress={() => navigation.goBack()}
            disabled={saving}
          >
            <Text style={styles.buttonTextCancel}>Cancelar</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: "#fff" },
  container: { padding: 20, paddingBottom: 40 },

  headerContainer: {
    backgroundColor: "#F2F2F2",
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 15,
    marginBottom: 20,
    marginTop: 40,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  header: {
    fontSize: 20,
    fontWeight: "bold",
    marginLeft: 10,
    color: "#000",
  },

  label: { fontSize: 14, marginBottom: 5, fontWeight: "600" },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 8,
    borderRadius: 6,
    marginBottom: 15,
    backgroundColor: "#fff",
  },

  buttonsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
  },
  button: {
    flex: 1,
    padding: 12,
    borderRadius: 6,
    alignItems: "center",
    marginHorizontal: 5,
  },
  saveButton: { backgroundColor: "#7D7954" },
  cancelButton: { backgroundColor: "#F2EBD9" },
  buttonText: { color: "#fff", fontWeight: "bold" },
  buttonTextCancel: { color: "#7D7954", fontWeight: "bold" },
});
