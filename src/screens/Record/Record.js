import React from "react";
import { View, ActivityIndicator, Text, StyleSheet } from "react-native";
import useRecord from "./hooks/useRecord";
import RecordUI from "./components/RecordUI";

export default function Record() {
  const { data: record, loading, error } = useRecord();

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text>Cargando datos...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.center}>
        <Text>Error al cargar datos</Text>
      </View>
    );
  }

  if (!record) {
    return (
      <View style={styles.center}>
        <Text>No hay datos para mostrar</Text>
      </View>
    );
  }

  return <RecordUI record={record} />;
}

const styles = StyleSheet.create({
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
});
