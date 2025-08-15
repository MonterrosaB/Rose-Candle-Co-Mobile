import React, { useEffect, useState, useCallback } from "react";
import { useFocusEffect } from "@react-navigation/native";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { Feather, MaterialIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";

export default function Materials() {
  const [materials, setMaterials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 13;
  const navigation = useNavigation();

  const fetchMaterials = async () => {
    try {
      setLoading(true);
      const res = await fetch(
        "https://rose-candle-co.onrender.com/api/rawMaterials"
      );
      const data = await res.json();
      setMaterials(data);
    } catch (err) {
      console.error("Error fetching materials:", err);
    } finally {
      setLoading(false);
    }
  };

  // Cargar al montar
  useEffect(() => {
    fetchMaterials();
  }, []);

  // Recargar al volver a la pantalla
  useFocusEffect(
    useCallback(() => {
      fetchMaterials();
    }, [])
  );

  const totalPages = Math.ceil(materials.length / itemsPerPage);
  const paginatedData = materials.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const renderItem = ({ item, index }) => (
    <View
      style={[
        styles.row,
        { backgroundColor: index % 2 === 0 ? "#F2EBD9" : "#F9F7F3" }, // alterna colores
      ]}
    >
      <Text style={styles.cell}>{item.name}</Text>
      <View style={styles.rightCell}>
        <Text style={[styles.quantity, { marginEnd: 30 }]}>
          {item.currentStock} {item.unit}
        </Text>
        <TouchableOpacity
          onPress={() =>
            navigation.navigate("MaterialsDetails", { material: item })
          }
        >
          <Feather name="arrow-right" size={18} color="#a0522d" />
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderPagination = () => (
    <View style={styles.pagination}>
      <TouchableOpacity
        disabled={currentPage === 1}
        onPress={() => setCurrentPage((prev) => prev - 1)}
      >
        <Text style={[styles.pageBtn, currentPage === 1 && styles.disabled]}>
          Anterior
        </Text>
      </TouchableOpacity>

      {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
        <TouchableOpacity key={page} onPress={() => setCurrentPage(page)}>
          <Text
            style={[
              styles.pageNumber,
              page === currentPage && styles.activePage,
            ]}
          >
            {page}
          </Text>
        </TouchableOpacity>
      ))}

      <TouchableOpacity
        disabled={currentPage === totalPages}
        onPress={() => setCurrentPage((prev) => prev + 1)}
      >
        <Text
          style={[
            styles.pageBtn,
            currentPage === totalPages && styles.disabled,
          ]}
        >
          Siguiente
        </Text>
      </TouchableOpacity>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color="#A78A5E" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.headerBox}>
        <Text style={styles.header}>Materia Prima</Text>
        <MaterialIcons name="filter-list" size={24} color="#333" />
      </View>

      <View style={styles.table}>
        <View style={styles.tableHeader}>
          <Text style={styles.headerText}>Materia</Text>
          <Text style={[styles.headerText, { marginEnd: 40 }]}>Cantidad</Text>
        </View>

        <FlatList
          data={paginatedData}
          renderItem={renderItem}
          keyExtractor={(item, index) => index.toString()}
          showsVerticalScrollIndicator={false}
          ListFooterComponent={
            <View style={styles.paginationWrapper}>{renderPagination()}</View>
          }
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: "#F9F7F3" },
  headerBox: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
    marginTop: 60,
  },
  paginationWrapper: {
    marginTop: 10, // espacio desde la tabla
    marginBottom: 20, // espacio hacia el nav
  },
  header: { fontSize: 20, fontWeight: "bold", color: "#333", marginLeft: 10 },
  table: {
    backgroundColor: "#fff",
    height: 750,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: "#ddd",
    overflow: "hidden",
    marginLeft: 5,
    marginRight: 5,
  },
  tableHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "#F3F4F6",
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  headerText: { fontWeight: "bold", fontSize: 14, color: "#333" },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 14,
    paddingHorizontal: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#f2f2f2",
  },
  cell: { flex: 1, fontSize: 14, color: "#333" },
  rightCell: { flexDirection: "row", alignItems: "center", gap: 8 },
  quantity: { fontSize: 14, marginRight: 10, color: "#555" },
  loader: { flex: 1, justifyContent: "center", alignItems: "center" },
  pagination: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 12,
    backgroundColor: "#fff",
  },
  pageBtn: { fontSize: 14, paddingHorizontal: 8, color: "#333" },
  pageNumber: { fontSize: 14, paddingHorizontal: 8, color: "#333" },
  activePage: {
    fontWeight: "bold",
    backgroundColor: "#A78A5E",
    color: "#fff",
    borderRadius: 5,
    paddingHorizontal: 6,
  },
  disabled: { color: "#ccc" },
});
