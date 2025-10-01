import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  StyleSheet,
  Switch,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { useRoute, useNavigation } from "@react-navigation/native";

export default function EmployeesDetail() {
  const route = useRoute();
  const navigation = useNavigation();

  const employeeParam = route.params?.employee; 
  const updateEmployeeList = route.params?.updateEmployeeList; 

  const [employee, setEmployee] = useState(
    employeeParam
      ? { ...employeeParam } // Traemos solo los campos existentes
      : {
          name: "",
          surnames: "",
          email: "",
          phone: "",
          dui: "",
          user: "",
          role: "",
          password: "",
          isActive: true,
        }
  );

  const [loading, setLoading] = useState(false);

  const setField = (field, value) =>
    setEmployee((prev) => ({ ...prev, [field]: value }));

  const validateFields = () => {
    if (!employee.name || employee.name.trim().length < 3) {
      Alert.alert("Validación", "El nombre debe tener al menos 3 caracteres");
      return false;
    }
    if (!employee.surnames || employee.surnames.trim().length < 3) {
      Alert.alert("Validación", "Los apellidos deben tener al menos 3 caracteres");
      return false;
    }
    if (!employee.email) {
      Alert.alert("Validación", "El correo es obligatorio");
      return false;
    }
    const emailRegex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
    if (!emailRegex.test(employee.email)) {
      Alert.alert("Validación", "Formato de correo inválido");
      return false;
    }
    if (!/^\d{4}-\d{4}$/.test(employee.phone)) {
      Alert.alert("Validación", "El teléfono debe tener formato ####-####");
      return false;
    }
    if (!/^[0-9]{8}-[0-9]$/.test(employee.dui)) {
      Alert.alert("Validación", "El DUI debe tener formato ########-#");
      return false;
    }
    if (!employee.user || employee.user.trim().length < 3) {
      Alert.alert("Validación", "El usuario debe tener al menos 3 caracteres");
      return false;
    }
    if (!employee.role || !["admin", "employee"].includes(employee.role)) {
      Alert.alert("Validación", "El rol debe ser 'admin' o 'employee'");
      return false;
    }
    if (!employee._id && employee.password.length < 8) {
      Alert.alert("Validación", "La contraseña debe tener mínimo 8 caracteres");
      return false;
    }
    return true;
  };

  const onSave = async () => {
    if (!validateFields()) return;

    setLoading(true);
    try {
      const isEdit = Boolean(employee._id);
      const url = isEdit
        ? `https://rose-candle-co.onrender.com/api/employees/${employee._id}`
        : "https://rose-candle-co.onrender.com/api/registerEmployees";
      const method = isEdit ? "PUT" : "POST";

      // Construimos payload sin deleted
      const payload = { ...employee };

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const t = await res.text().catch(() => null);
        throw new Error(t || "Error guardando empleado");
      }

      const saved = await res.json();

      if (typeof updateEmployeeList === "function") {
        // Para creación, la API actual solo devuelve {message}, no el empleado
        if (!isEdit && payload) updateEmployeeList(payload);
        else if (isEdit && saved?.employee) updateEmployeeList(saved.employee);
      }

      Alert.alert("Éxito", `Empleado ${isEdit ? "actualizado" : "creado"}`);
      navigation.goBack();
    } catch (e) {
      Alert.alert("Error", e.message || "No se pudo guardar");
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
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>
          {employee._id ? "Editar empleado" : "Nuevo empleado"}
        </Text>

        <Text style={styles.label}>Nombre</Text>
        <TextInput
          style={styles.input}
          value={employee.name}
          onChangeText={(t) => setField("name", t)}
          placeholder="Nombre"
        />

        <Text style={styles.label}>Apellidos</Text>
        <TextInput
          style={styles.input}
          value={employee.surnames}
          onChangeText={(t) => setField("surnames", t)}
          placeholder="Apellidos"
        />

        <Text style={styles.label}>Email</Text>
        <TextInput
          style={styles.input}
          value={employee.email}
          onChangeText={(t) => setField("email", t)}
          placeholder="Email"
          keyboardType="email-address"
        />

        <Text style={styles.label}>Teléfono</Text>
        <TextInput
          style={styles.input}
          value={employee.phone}
          onChangeText={(t) => setField("phone", t)}
          placeholder="1234-5678"
          keyboardType="phone-pad"
        />

        <Text style={styles.label}>DUI</Text>
        <TextInput
          style={styles.input}
          value={employee.dui}
          onChangeText={(t) => setField("dui", t)}
          placeholder="########-#"
        />

        <Text style={styles.label}>Usuario</Text>
        <TextInput
          style={styles.input}
          value={employee.user}
          onChangeText={(t) => setField("user", t)}
          placeholder="Usuario"
        />

        <Text style={styles.label}>Rol</Text>
        <TextInput
          style={styles.input}
          value={employee.role}
          onChangeText={(t) => setField("role", t)}
          placeholder="admin / employee"
        />

        <Text style={styles.label}>Contraseña</Text>
        <TextInput
          style={styles.input}
          value={employee.password}
          onChangeText={(t) => setField("password", t)}
          placeholder="Contraseña"
          secureTextEntry
        />

        <View style={styles.switchContainer}>
          <Text style={styles.label}>Activo</Text>
          <Switch
            value={employee.isActive}
            onValueChange={(v) => setField("isActive", v)}
          />
        </View>

        <TouchableOpacity style={styles.saveButton} onPress={onSave}>
          <Text style={styles.saveText}>
            {employee._id ? "Actualizar" : "Crear"}
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 16, paddingTop: 20, backgroundColor: "#fff" },
  title: { fontSize: 22, fontWeight: "bold", marginBottom: 20 },
  label: { marginTop: 8, fontWeight: "600" },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 6,
    padding: 10,
    marginTop: 6,
  },
  saveButton: {
    marginTop: 24,
    backgroundColor: "#28a745",
    paddingVertical: 12,
    borderRadius: 6,
    alignItems: "center",
    marginBottom: 20,
  },
  saveText: { color: "#fff", fontWeight: "bold", fontSize: 16 },
  center: { flex: 1, alignItems: "center", justifyContent: "center" },
  switchContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 12,
    justifyContent: "space-between",
  },
});
