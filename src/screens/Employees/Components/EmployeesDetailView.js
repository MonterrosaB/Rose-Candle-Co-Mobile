import React from "react";
import { View, Text, TextInput, TouchableOpacity, ActivityIndicator, StyleSheet } from "react-native";

// Componente para mostrar el detalle o formulario de un empleado
export default function EmployeesDetailUI({ loading, employee, setField, onSave }) {
  // Mostrar indicador de carga mientras se obtiene la información del empleado
  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
        <Text>Cargando empleado...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Título del formulario */}
      <Text style={styles.title}>
        {employee?.id ? "Editar empleado" : "Nuevo empleado"}
      </Text>

      {/* Campo para editar el nombre del empleado */}
      <Text style={styles.label}>Nombre:</Text>
      <TextInput
        style={styles.input}
        value={employee?.name ?? ""} // valor actual o vacío
        onChangeText={(text) => setField("name", text)} // actualizar el estado externo
        placeholder="Ingrese el nombre"
      />

      {/* Campo para editar el rol del empleado */}
      <Text style={styles.label}>Rol:</Text>
      <TextInput
        style={styles.input}
        value={employee?.role ?? ""} // valor actual o vacío
        onChangeText={(text) => setField("role", text)} // actualizar el estado externo
        placeholder="Ingrese el rol"
      />

      {/* Botón para guardar los cambios */}
      <TouchableOpacity style={styles.saveButton} onPress={onSave}>
        <Text style={styles.saveText}>Guardar</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 60, // separa del borde superior
    backgroundColor: "#fff"
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 20
  },
  label: {
    fontSize: 16,
    fontWeight: "500",
    marginTop: 10
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 6,
    padding: 10,
    marginTop: 4
  },
  saveButton: {
    marginTop: 30,
    backgroundColor: "#28a745", // verde para indicar acción positiva
    paddingVertical: 12,
    borderRadius: 6,
    alignItems: "center"
  },
  saveText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center"
  }
});
