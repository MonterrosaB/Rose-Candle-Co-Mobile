import React from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from "react-native";

// Componente de UI para crear o editar un proveedor
export const SupplierDetailsUI = ({
  supplier,    // Proveedor existente (null si es nuevo)
  name,        // Estado del nombre del proveedor
  contact,     // Estado del contacto del proveedor
  loading,     // Indicador de carga al guardar
  setName,     // Función para actualizar el nombre
  setContact,  // Función para actualizar el contacto
  handleSave,  // Función para guardar los cambios
}) => {
  return (
    <View style={styles.container}>
      {/* Título dinámico según si es edición o creación */}
      <Text style={styles.title}>
        {supplier ? "Editar Proveedor" : "Agregar Proveedor"}
      </Text>

      {/* Input para el nombre del proveedor */}
      <TextInput
        style={styles.input}
        placeholder="Nombre del proveedor"
        value={name}
        onChangeText={setName} // Actualiza el estado
      />

      {/* Input para el contacto del proveedor */}
      <TextInput
        style={styles.input}
        placeholder="Contacto"
        value={contact}
        onChangeText={setContact} // Actualiza el estado
      />

      {/* Botón para guardar */}
      <TouchableOpacity
        style={styles.saveButton}
        onPress={handleSave}   // Llama a la función de guardado
        disabled={loading}     // Deshabilitado mientras se guarda
      >
        {loading ? (
          <ActivityIndicator color="#fff" /> // Indicador de carga si está guardando
        ) : (
          <Text style={styles.saveText}>Guardar</Text>
        )}
      </TouchableOpacity>
    </View>
  );
};

// Estilos del componente
const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: "#F9F7F3" },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 20,
    marginTop: 60, // espacio desde la parte superior
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
