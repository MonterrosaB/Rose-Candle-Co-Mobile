import React from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";

export default function RecordUI({ record }) {
  // Para inspeccionar la estructura real del JSON:
  console.log("RecordUI data:", record);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Detalle del registro</Text>

      <View style={styles.card}>
        <Text style={styles.label}>Material:</Text>
        <Text style={styles.value}>{record?.material ?? "Sin material"}</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.label}>Cantidad:</Text>
        <Text style={styles.value}>{record?.quantity ?? "0"}</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.label}>Fecha:</Text>
        <Text style={styles.value}>{record?.date ?? "No disponible"}</Text>
      </View>

      {/* Agrega más campos si tu API los devuelve */}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: "#f9f9f9",
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 20,
  },
  card: {
    backgroundColor: "#fff",
    padding: 15,
    marginBottom: 15,
    borderRadius: 10,
    elevation: 2,
  },
  label: {
    fontSize: 16,
    color: "#555",
  },
  value: {
    fontSize: 18,
    fontWeight: "600",
    marginTop: 5,
  },
});
