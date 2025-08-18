import React, { useEffect, useState, useCallback } from "react";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";

export default function Categories() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 13;
  const navigation = useNavigation();
  const [deletingId, setDeletingId] = useState(null);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const res = await fetch("https://rose-candle-co.onrender.com/api/productCategories");
      const data = await res.json();
      setCategories(data);
    } catch (err) {
      console.error("Error fetching categories:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = (id) => {
    Alert.alert(
      "Eliminar categoría",
      "¿Estás seguro de que quieres eliminar esta categoría?",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Eliminar",
          style: "destructive",
          onPress: async () => {
            setDeletingId(id);
            try {
              const res = await fetch(
                `https://rose-candle-co.onrender.com/api/productCategories/${id}`,
                { method: "DELETE" }
              );

              let body;
              try {
                body = await res.json();
              } catch (e) {
                body = await res.text();
              }

              console.log("DELETE response:", res.status, body);

              if (res.ok) {
                setCategories((prev) => prev.filter((c) => c._id !== id));
                Alert.alert("Eliminado", "La categoría ha sido eliminada.");
              } else {
                const errMsg =
                  (body && (body.message || body.error || JSON.stringify(body))) ||
                  `Respuesta del servidor: ${res.status}`;
                throw new Error(errMsg);
              }
            } catch (err) {
              console.error("Error eliminando categoría:", err);
              Alert.alert("Error", err.message || "No se pudo eliminar la categoría");
            } finally {
              setDeletingId(null);
              fetchCategories();
            }
          },
        },
      ]
    );
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  useFocusEffect(
    useCallback(() => {
      fetchCategories();
    }, [])
  );

  const totalPages = Math.ceil(categories.length / itemsPerPage);
  const paginatedData = categories.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const renderItem = ({ item, index }) => (
    <View
      style={[
        styles.row,
        { backgroundColor: index % 2 === 0 ? "#F2EBD9" : "#F9F7F3" },
      ]}
    >
      <Text style={styles.nameCell} numberOfLines={1}>
        {item.name}
      </Text>

      <View style={styles.actionsCell}>
        <TouchableOpacity
          style={[styles.iconBtn, { backgroundColor: "#5cb85c" }]}
          onPress={() =>
            navigation.navigate("CategoriesDetails", { category: item })
          }
        >
          <MaterialIcons name="edit" size={18} color="#fff" />
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.iconBtn,
            {
              backgroundColor: deletingId === item._id ? "#c94c43" : "#d9534f",
            },
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
  <Text style={styles.header}>Categorías</Text>
  <TouchableOpacity
    style={styles.addButton}
    onPress={() => navigation.navigate("CategoriesDetails", { category: null })}
  >
    <MaterialIcons name="add" size={20} color="#fff" />
    <Text style={styles.addButtonText}>Agregar</Text>
  </TouchableOpacity>
</View>


      <View style={styles.tableWrapper}>
        <View style={styles.table}>
          <View style={styles.tableHeader}>
            <Text style={[styles.headerText, { flex: 2 }]}>Categoría</Text>
            <Text style={[styles.headerText, { width: 90, textAlign: "center" }]}>
              Acciones
            </Text>
          </View>

          <FlatList
            data={paginatedData}
            renderItem={renderItem}
            keyExtractor={(item, index) => item._id ?? index.toString()}
            showsVerticalScrollIndicator={false}
          />
        </View>

        {renderPagination()}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: "#F9F7F3" },
 headerBox: {
  flexDirection: "row",
  justifyContent: "space-between",
  alignItems: "center",
  marginBottom: 10,
  marginTop: 60,
  marginHorizontal: 5, // ahora coincide con la tabla
},
  header: { fontSize: 20, fontWeight: "bold", color: "#333", marginLeft: 10 },
  addButton: {
    flexDirection: "row",
    backgroundColor: "#26328dff",
    paddingVertical:5,
    paddingHorizontal: 12,
    borderRadius: 6,
    alignItems: "center",
  },
  addButtonText: { color: "#fff", fontSize: 14, marginLeft: 4 },

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
  iconBtn: {
    padding: 6,
    borderRadius: 4,
    marginHorizontal: 4,
  },
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
