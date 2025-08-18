import React from "react";
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, ActivityIndicator
} from "react-native";
import { Feather } from "@expo/vector-icons";

// Componente de interfaz para crear o editar una colección
export function CollectionsDetailUI({ collection, name, setName, saving, handleSave, navigation }) {
  return (
    <View style={styles.screen}>
      <ScrollView contentContainerStyle={styles.container}>
        {/* Header con botón de regreso y título */}
        <View style={styles.headerContainer}>
          <View style={styles.headerRow}>
            {/* Botón para regresar a la pantalla anterior */}
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <Feather name="arrow-left" size={28} color="#a0522d" />
            </TouchableOpacity>

            {/* Título dinámico: "Editar Colección" o "Nueva Colección" */}
            <Text style={styles.header}>
              {collection ? "Editar Colección" : "Nueva Colección"}
            </Text>
          </View>
        </View>

        {/* Card principal para formulario */}
        <View style={styles.card}>
          {/* Campo de nombre de la colección */}
          <Text style={styles.label}>Nombre</Text>
          <TextInput
            style={styles.input}
            value={name}
            onChangeText={setName}
            placeholder="Escribe el nombre..."
          />

          {/* Botones de acción: Guardar / Cancelar */}
          <View style={styles.buttonsContainer}>
            {/* Botón Guardar o Modificar */}
            <TouchableOpacity
              style={[styles.button, styles.saveButton]}
              onPress={handleSave}
              disabled={saving} // Deshabilita mientras se guarda
            >
              {saving ? (
                <ActivityIndicator color="#fff" /> // Muestra loader mientras guarda
              ) : (
                <Text style={styles.buttonText}>
                  {collection ? "Modificar" : "Guardar"}
                </Text>
              )}
            </TouchableOpacity>

            {/* Botón Cancelar */}
            <TouchableOpacity
              style={[styles.button, styles.cancelButton]}
              onPress={() => navigation.goBack()}
            >
              <Text style={styles.buttonTextCancel}>Cancelar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

// Estilos del componente
const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: "#fff" },
  container: { padding: 20, paddingBottom: 40 },
  headerContainer: {
    backgroundColor: "#F2F2F2",
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 15,
    marginBottom: 20,
    marginTop: 20,
  },
  headerRow: { flexDirection: "row", alignItems: "center" },
  header: { fontSize: 20, fontWeight: "bold", marginLeft: 10, color: "#000" },
  card: { backgroundColor: "#fff", padding: 12, borderRadius: 10, borderWidth: 2, borderColor: "#ddd" },
  label: { fontSize: 14, marginBottom: 5, fontWeight: "600" },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    borderRadius: 6,
    marginBottom: 15,
    backgroundColor: "#fff",
  },
  buttonsContainer: { flexDirection: "row", justifyContent: "space-between", marginTop: 10 },
  button: { flex: 1, padding: 12, borderRadius: 6, alignItems: "center", marginHorizontal: 5 },
  saveButton: { backgroundColor: "#7D7954" },
  cancelButton: { backgroundColor: "#F2EBD9" },
  buttonText: { color: "#fff", fontWeight: "bold" },
  buttonTextCancel: { color: "#7D7954", fontWeight: "bold" },
});
