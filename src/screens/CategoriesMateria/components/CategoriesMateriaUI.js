import React from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";

export default function CategoriesMateriaUI({
  loading,
  paginatedData,
  deletingId,
  currentPage,
  totalPages,
  setCurrentPage,
  handleDelete,
  navigation,
}) {
  // Renderiza cada fila de la tabla con nombre y acciones
  const renderItem = ({ item, index }) => (
    <View
      style={[
        styles.row,
        { backgroundColor: index % 2 === 0 ? "#F2EBD9" : "#F9F7F3" },
      ]}
    >
      <Text style={styles.nameCell} numberOfLines={1} ellipsizeMode="tail">
        {item.name}
      </Text>

      <View style={styles.actionsCell}>
        {/* Botón Editar */}
        <TouchableOpacity
          style={[styles.iconBtn, { backgroundColor: "#5cb85c" }]}
          onPress={() =>
            navigation.navigate("CategoriesMateriaDetail", { category: item })
          }
        >
          <MaterialIcons name="edit" size={18} color="#fff" />
        </TouchableOpacity>

        {/* Botón Eliminar */}
        <TouchableOpacity
          style={[
            styles.iconBtn,
            { backgroundColor: deletingId === item._id ? "#c94c43" : "#d9534f" },
          ]}
          onPress={() => handleDelete(item._id)}
          disabled={deletingId === item._id}
        >
          {deletingId === item._id ? (
            <ActivityIndicator size="small" color="#fff" />
          ) : (
            <MaterialIcons name="delete" size={18} color="#fff" />
          )}
        </TouchableOpacity>
      </View>
    </View>
  );

  // Renderiza la paginación de la tabla
  const renderPagination = () => (
    <View style={styles.pagination}>
      <TouchableOpacity
        disabled={currentPage === 1}
        onPress={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
      >
        <Text style={[styles.pageBtn, currentPage === 1 && styles.disabled]}>
          Anterior
        </Text>
      </TouchableOpacity>

      {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
        <TouchableOpacity key={page} onPress={() => setCurrentPage(page)}>
          <Text
            style={[styles.pageNumber, page === currentPage && styles.activePage]}
          >
            {page}
          </Text>
        </TouchableOpacity>
      ))}

      <TouchableOpacity
        disabled={currentPage === totalPages}
        onPress={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
      >
        <Text
          style={[styles.pageBtn, currentPage === totalPages && styles.disabled]}
        >
          Siguiente
        </Text>
      </TouchableOpacity>
    </View>
  );

  // Loader mientras se cargan los datos
  if (loading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color="#A78A5E" />
      </View>
    );
  }

  return (
    <View style={styles.screen}>
      {/* Header con título y botón agregar */}
      <View style={styles.headerContainer}>
        <Text style={styles.header}>Categorías de Materia{"\n"}Prima</Text>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() =>
            navigation.navigate("CategoriesMateriaDetail", { category: null })
          }
        >
          <MaterialIcons name="add" size={20} color="#fff" />
          <Text style={styles.addButtonText}>Agregar</Text>
        </TouchableOpacity>
      </View>

      {/* Tabla de categorías */}
      <View style={styles.tableWrapper}>
        <View style={styles.table}>
          <View style={styles.tableHeader}>
            <Text style={[styles.headerText, { flex: 2 }]}>Nombre</Text>
            <Text
              style={[styles.headerText, { width: 90, textAlign: "center" }]}
            >
              Acciones
            </Text>
          </View>

          <FlatList
            data={paginatedData}
            renderItem={renderItem}
            keyExtractor={(item) => item._id}
            showsVerticalScrollIndicator={false}
          />
        </View>

        <View style={styles.paginationWrapper}>{renderPagination()}</View>
      </View>
    </View>
  );
}

// Estilos del componente
const styles = StyleSheet.create({
  screen: { flex: 1, padding: 16, backgroundColor: "#F9F7F3" },
  headerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 70,
    marginBottom: 20,
    marginHorizontal: 5,
  },
  header: { fontSize: 20, fontWeight: "bold", color: "#333", marginLeft: 8 },
  addButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#26328DFF",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 6,
    marginRight: 8,
  },
  addButtonText: { color: "#fff", fontWeight: "bold", marginLeft: 6 },
  tableWrapper: {
    flex: 1,
    marginHorizontal: 5,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: "#ddd",
    overflow: "hidden",
    backgroundColor: "#fff",
  },
  table: { flex: 1 },
  tableHeader: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F3F4F6",
    paddingVertical: 10,
    paddingHorizontal: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  headerText: { fontWeight: "bold", fontSize: 14, color: "#333" },
  row: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#f2f2f2",
  },
  nameCell: { flex: 2, fontSize: 14, color: "#333" },
  actionsCell: {
    width: 90,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  iconBtn: { padding: 6, borderRadius: 4, marginHorizontal: 4 },
  loader: { flex: 1, justifyContent: "center", alignItems: "center" },
  paginationWrapper: { marginTop: 10, marginBottom: 20 },
  pagination: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 12,
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderTopColor: "#ddd",
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
