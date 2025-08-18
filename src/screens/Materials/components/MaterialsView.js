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

// Componente UI para mostrar la lista de materiales
export default function MaterialsView({
  loading,       // Indica si los datos están cargando
  materials,     // Array de materiales
  totalPages,    // Total de páginas para paginación
  currentPage,   // Página actual
  setCurrentPage,// Función para cambiar de página
  deletingId,    // ID del material que se está eliminando
  handleDelete,  // Función para eliminar un material
  navigation,    // Navegación para ir a detalles/agregar
}) {
  // Mostrar loader mientras se cargan los datos
  if (loading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color="#A78A5E" />
      </View>
    );
  }

  // Renderiza cada fila de material
  const renderItem = ({ item, index }) => (
    <View
      style={[
        styles.row,
        { backgroundColor: index % 2 === 0 ? "#F2EBD9" : "#F9F7F3" }, // Alterna color de filas
      ]}
    >
      <Text style={styles.nameCell} numberOfLines={1}>{item.name}</Text>
      <Text style={styles.qtyCell}>{item.currentStock} {item.unit}</Text>
      <View style={styles.actionsCell}>
        {/* Botón de editar */}
        <TouchableOpacity
          style={[styles.iconBtn, { backgroundColor: "#5cb85c" }]}
          onPress={() => navigation.navigate("MaterialsDetails", { material: item })}
        >
          <MaterialIcons name="edit" size={18} color="#fff" />
        </TouchableOpacity>

        {/* Botón de eliminar */}
        <TouchableOpacity
          style={[
            styles.iconBtn,
            { backgroundColor: deletingId === item._id ? "#c94c43" : "#d9534f" },
          ]}
          onPress={() => handleDelete(item._id)}
          disabled={deletingId === item._id} // Deshabilita mientras se elimina
        >
          {deletingId === item._id 
            ? <ActivityIndicator size="small" color="#fff" /> 
            : <MaterialIcons name="delete" size={18} color="#fff" />
          }
        </TouchableOpacity>
      </View>
    </View>
  );

  // Renderiza la paginación
  const renderPagination = () => (
    <View style={styles.pagination}>
      {/* Botón anterior */}
      <TouchableOpacity disabled={currentPage === 1} onPress={() => setCurrentPage(prev => prev - 1)}>
        <Text style={[styles.pageBtn, currentPage === 1 && styles.disabled]}>Anterior</Text>
      </TouchableOpacity>

      {/* Números de página */}
      {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
        <TouchableOpacity key={page} onPress={() => setCurrentPage(page)}>
          <Text style={[styles.pageNumber, page === currentPage && styles.activePage]}>{page}</Text>
        </TouchableOpacity>
      ))}

      {/* Botón siguiente */}
      <TouchableOpacity disabled={currentPage === totalPages} onPress={() => setCurrentPage(prev => prev + 1)}>
        <Text style={[styles.pageBtn, currentPage === totalPages && styles.disabled]}>Siguiente</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Encabezado con título y botón agregar */}
      <View style={styles.headerBox}>
        <Text style={styles.header}>Materia Prima</Text>
        <TouchableOpacity style={styles.addButton} onPress={() => navigation.navigate("MaterialsDetails", { material: null })}>
          <MaterialIcons name="add" size={18} color="#fff" />
          <Text style={styles.addButtonText}>Agregar</Text>
        </TouchableOpacity>
      </View>

      {/* Tabla de materiales */}
      <View style={styles.tableWrapper}>
        <View style={styles.table}>
          {/* Encabezado de la tabla */}
          <View style={styles.tableHeader}>
            <Text style={[styles.headerText, { flex: 2 }]}>Materia</Text>
            <Text style={[styles.headerText, { flex: 1, textAlign: "center" }]}>Cantidad</Text>
            <Text style={[styles.headerText, { width: 90, textAlign: "center" }]}>Acciones</Text>
          </View>

          {/* Lista de materiales */}
          <FlatList
            data={materials}
            renderItem={renderItem}
            keyExtractor={(item, index) => item._id ?? index.toString()}
            showsVerticalScrollIndicator={false}
          />
        </View>

        {/* Paginación */}
        {renderPagination()}
      </View>
    </View>
  );
}

// Estilos del componente
const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: "#F9F7F3" },
  headerBox: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
    marginTop: 60,
    marginHorizontal: 5,
  },
  header: { fontSize: 20, fontWeight: "bold", color: "#333" },
  addButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#26328dff",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 6,
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
  qtyCell: { flex: 1, fontSize: 14, color: "#555", textAlign: "center" },
  actionsCell: {
    width: 90,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  iconBtn: { padding: 6, borderRadius: 4, marginHorizontal: 4 },
  loader: { flex: 1, justifyContent: "center", alignItems: "center" },
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
