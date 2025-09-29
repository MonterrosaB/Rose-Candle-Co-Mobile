import React, { useState, useEffect } from "react";
import { View, Text, TextInput, TouchableOpacity, ActivityIndicator, Alert, StyleSheet } from "react-native";
import { useRoute, useNavigation } from "@react-navigation/native";

export default function EmployeesDetail({ onUpdateList }) {
  const route = useRoute();
  const navigation = useNavigation();
  const employeeParam = route.params?.employee; // Puede venir al editar
  const [employee, setEmployee] = useState(
    employeeParam || { name: "", role: "" } // Nuevo empleado si no hay params
  );
  const [loading, setLoading] = useState(false);

  // Función para actualizar campos
  const setField = (field, value) => {
    setEmployee({ ...employee, [field]: value });
  };

  const onSave = async () => {
    try {
      setLoading(true);
      const method = employee._id ? "PUT" : "POST";
      const url = employee._id
        ? `https://rose-candle-co.onrender.com/api/employees/${employee._id}`
        : "https://rose-candle-co.onrender.com/api/employees";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(employee),
      });

      if (!res.ok) throw new Error("Error al guardar");

      const savedEmployee = await res.json();

      Alert.alert("Éxito", `Empleado ${employee._id ? "actualizado" : "creado"} correctamente`);

      // Actualizar lista en vivo
      if (onUpdateList) {
        onUpdateList(savedEmployee);
      }

      // Volver a la pantalla anterior
      navigation.goBack();
    } catch (err) {
      Alert.alert("Error", "No se pudo guardar el empleado");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
        <Text>Cargando...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{employee._id ? "Editar empleado" : "Nuevo empleado"}</Text>

      <Text style={styles.label}>Nombre:</Text>
      <TextInput
        style={styles.input}
        value={employee.name}
        onChangeText={(text) => setField("name", text)}
        placeholder="Ingrese el nombre"
      />

      <Text style={styles.label}>Rol:</Text>
      <TextInput
        style={styles.input}
        value={employee.role}
        onChangeText={(text) => setField("role", text)}
        placeholder="Ingrese el rol"
      />

      <TouchableOpacity style={styles.saveButton} onPress={onSave}>
        <Text style={styles.saveText}>Guardar</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, paddingTop: 60, backgroundColor: "#fff" },
  title: { fontSize: 22, fontWeight: "bold", marginBottom: 20 },
  label: { fontSize: 16, fontWeight: "500", marginTop: 10 },
  input: { borderWidth: 1, borderColor: "#ccc", borderRadius: 6, padding: 10, marginTop: 4 },
  saveButton: { marginTop: 30, backgroundColor: "#28a745", paddingVertical: 12, borderRadius: 6, alignItems: "center" },
  saveText: { color: "#fff", fontWeight: "bold", fontSize: 16 },
  center: { flex: 1, justifyContent: "center", alignItems: "center" }
});
