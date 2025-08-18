import React from "react";
import { View, Text, FlatList, ActivityIndicator, TouchableOpacity, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";

export default function EmployeesView({ employees, loading, refresh, onDelete }) {
  const navigation = useNavigation(); // <-- ahora siempre tienes navigation

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
        <Text>Cargando empleados...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Encabezado */}
      <View style={styles.header}>
        <Text style={styles.title}>Empleados</Text>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => navigation.navigate("EmployeesDetail")}
        >
          <Text style={styles.addButtonText}>Añadir</Text>
        </TouchableOpacity>
      </View>

      {/* Lista de empleados */}
      <FlatList
        contentContainerStyle={{ paddingBottom: 30 }}
        data={employees}
        keyExtractor={(item) => item.id?.toString() ?? Math.random().toString()}
        onRefresh={refresh}
        refreshing={loading}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <View>
              <Text style={styles.name}>{item.name}</Text>
              <Text style={styles.role}>{item.role}</Text>
            </View>
            <View style={styles.actions}>
              <TouchableOpacity
                style={styles.editButton}
                onPress={() => navigation.navigate("EmployeesDetail", { id: item.id })}
              >
                <Text style={styles.editText}>Editar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.deleteButton}
                onPress={() => onDelete(item.id)}
              >
                <Text style={styles.deleteText}>Eliminar</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
        ListEmptyComponent={
          <View style={styles.center}>
            <Text>No hay empleados registrados.</Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 60, // baja el título y el botón
    backgroundColor: "#fff"
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20
  },
  title: {
    fontSize: 22,
    fontWeight: "bold"
  },
  addButton: {
    backgroundColor: "#007bff",
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 6
  },
  addButtonText: {
    color: "#fff",
    fontWeight: "bold"
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center"
  },
  card: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    marginBottom: 12,
    backgroundColor: "#f2f2f2",
    borderRadius: 8
  },
  name: {
    fontWeight: "bold",
    fontSize: 16
  },
  role: {
    fontSize: 14,
    color: "#555"
  },
  actions: {
    flexDirection: "row",
    gap: 10
  },
  editButton: {
    backgroundColor: "#ffc107",
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 6
  },
  editText: {
    color: "#000",
    fontWeight: "bold"
  },
  deleteButton: {
    backgroundColor: "#dc3545",
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 6
  },
  deleteText: {
    color: "#fff",
    fontWeight: "bold"
  }
});
