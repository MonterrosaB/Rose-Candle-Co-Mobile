// src/screens/Materials.js
import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator } from "react-native";
import { MaterialIcons, Feather } from "@expo/vector-icons";

export default function Materials() {
  const [materials, setMaterials] = useState([]);
  const [loading, setLoading] = useState(true);

  const getMaterials = async () => {
    try {
      const res = await fetch("https://rose-candle-co.onrender.com/api/rawMaterials");
      const data = await res.json();
      setMaterials(data);
    } catch (error) {
      console.error("Error fetching materials:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getMaterials();
  }, []);

  const renderItem = ({ item }) => (
    <View style={styles.row}>
      <Text style={styles.cell}>{item.name}</Text>
      <View style={styles.rightCell}>
        <Text style={[styles.quantity, { marginEnd: 10 }]}>{item.currentStock} { item.unit}</Text>
        <TouchableOpacity>
          <Feather name="arrow-right" size={18} color="#a0522d" />
        </TouchableOpacity>
      </View>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color="#a0522d" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.headerBox}>
        <Text style={styles.header}>Materiales</Text>
        <MaterialIcons name="filter-list" size={24} color="#333" />
      </View>

      <View style={styles.table}>
        <View style={styles.tableHeader}>
          <Text style={styles.headerText}>Materia</Text>
          <Text style={[styles.headerText, { marginEnd: 20 }]}>Cantidad</Text>
        </View>

        <FlatList
          data={materials}
          renderItem={renderItem}
          keyExtractor={(item, index) => index.toString()}
          showsVerticalScrollIndicator={false}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#fff",
  },
  headerBox: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  header: {
    marginTop:60,
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 30
  },
  table: {
    backgroundColor: "#fff",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#ddd",
    padding: 8,
  },
  tableHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  headerText: {
    fontWeight: "bold",
    fontSize: 14,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#f2f2f2",
  },
  cell: {
    flex: 1,
    fontSize: 14,
  },
  rightCell: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  quantity: {
    fontSize: 14,
    marginRight: 8,
  },
  loader: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
