import React from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  ActivityIndicator,
} from "react-native"; // Componentes de React Native
import { Feather } from "@expo/vector-icons"; // Iconos Feather

export default function CategoriesDetailsView({
  category, // Objeto de categoría a editar, null si es nueva
  name, // Valor del campo de nombre
  setName, // Función para actualizar el nombre
  saving, // Estado de guardado (loading)
  handleSave, // Función que guarda la categoría
  navigation, // Navegación entre pantallas
}) {
  return (
    <View style={styles.screen}>
      <ScrollView contentContainerStyle={styles.container}>
        {/* Encabezado con flecha para regresar */}
        <View style={styles.headerContainer}>
          <View style={styles.headerRow}>
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <Feather name="arrow-left" size={28} color="#a0522d" />
            </TouchableOpacity>
            <Text style={styles.header}>
              {category ? "Editar Categoría" : "Nueva Categoría"} {/* Texto según acción */}
            </Text>
          </View>
        </View>

        {/* Tarjeta con formulario */}
        <View style={styles.card}>
          <Text style={styles.label}>Nombre</Text>
          <TextInput
            style={styles.input}
            value={name} // Valor del input
            onChangeText={setName} // Actualiza el valor
            placeholder="Escribe el nombre..." // Placeholder
          />

          {/* Botones */}
          <View style={styles.buttonsContainer}>
            {/* Botón guardar/modificar */}
            <TouchableOpacity
              style={[styles.button, styles.saveButton]}
              onPress={handleSave}
              disabled={saving} // Deshabilitado mientras guarda
            >
              {saving ? (
                <ActivityIndicator color="#fff" /> // Indicador mientras guarda
              ) : (
                <Text style={styles.buttonText}>
                  {category ? "Modificar" : "Guardar"} {/* Texto según acción */}
                </Text>
              )}
            </TouchableOpacity>

            {/* Botón cancelar */}
            <TouchableOpacity
              style={[styles.button, styles.cancelButton]}
              onPress={() => navigation.goBack()} // Regresa a la pantalla anterior
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
