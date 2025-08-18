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

export default function Suppliers() {
  const [suppliers, setSuppliers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 13;
  const navigation = useNavigation();
  const [deletingId, setDeletingId] = useState(null);

  const fetchSuppliers = async () => {
    try {
      setLoading(true);
      const res = await fetch("https://rose-candle-co.onrender.com/api/suppliers");
      const data = await res.json();
      setSuppliers(data);
    } catch (err) {
      console.error("Error fetching suppliers:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSuppliers();
  }, []);

  useFocusEffect(
    useCallback(() => {
      fetchSuppliers();
    }, [])
  );

  const handleDelete = (id) => {
    Alert.alert(
      "Eliminar proveedor",
      "¿Estás seguro de que quieres eliminar este proveedor?",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Eliminar",
          style: "destructive",
          onPress: async () => {
            setDeletingId(id);
            try {
              const res = await fetch(
                `https://rose-candle-co.onrender.com/api/suppliers/${id}`,
                { method: "DELETE" }
              );

              let body;
              try {
                body = await res.json();
              } catch (e) {
                body = await res.text();
              }
              console.log("DELETE supplier:", res.status, body);

              if (res.ok) {
                // eliminar de la UI inmediatamente
                setSuppliers((prev) => prev.filter((s) => s._id !== id));
                Alert.alert("Eliminado", "El proveedor ha sido eliminado.");
              } else {
                const errMsg =
                  (body && (body.message || body.error || JSON.stringify(body))) ||
                  `Respuesta del servidor: ${res.status}`;
                throw new Error(errMsg);
              }
            } catch (err) {
              console.error("Error eliminando proveedor:", err);
              Alert.alert("Error", err.message || "No se pudo eliminar el proveedor");
            } finally {
              setDeletingId(null);
              fetchSuppliers();
            }
          },
        },
      ]
    );
  };

  const totalPages = Math.max(1, Math.ceil(suppliers.length / itemsPerPage));
  const paginatedData = suppliers.slice(
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
      <Text style={styles.nameCell} numberOfLines={1} ellipsizeMode="tail">
        {item.name}
      </Text>

      <Text style={styles.contactCell} numberOfLines={1} ellipsizeMode="tail">
        {item.contact}
      </Text>

      <View style={styles.actionsCell}>
        <TouchableOpacity
          style={[styles.iconBtn, { backgroundColor: "#5cb85c" }]}
          onPress={() => navigation.navigate("SupplierDetails", { supplier: item })}
        >
          <MaterialIcons name="edit" size={18} color="#fff" />
        </TouchableOpacity>

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

  const renderPagination = () => (
    <View style={styles.pagination}>
      <TouchableOpacity
        disabled={currentPage === 1}
        onPress={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
      >
        <Text style={[styles.pageBtn, currentPage === 1 && styles.disabled]}>Anterior</Text>
      </TouchableOpacity>

      {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
        <TouchableOpacity key={page} onPress={() => setCurrentPage(page)}>
          <Text style={[styles.pageNumber, page === currentPage && styles.activePage]}>
            {page}
          </Text>
        </TouchableOpacity>
      ))}

      <TouchableOpacity
        disabled={currentPage === totalPages}
        onPress={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
      >
        <Text style={[styles.pageBtn, currentPage === totalPages && styles.disabled]}>Siguiente</Text>
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
    <View style={styles.screen}>
      {/* headerBox y botón agregar alineados con la tabla (mismo marginHorizontal) */}
      <View style={styles.headerBox}>
        <Text style={styles.header}>Proveedores</Text>

        <TouchableOpacity
          style={styles.addButton}
          onPress={() => navigation.navigate("SupplierDetails", { supplier: null })}
        >
          <MaterialIcons name="add" size={20} color="#fff" />
          <Text style={styles.addButtonText}>Agregar</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.tableWrapper}>
        <View style={styles.table}>
          <View style={styles.tableHeader}>
            <Text style={[styles.headerText, { flex: 2 }]}>Nombre</Text>
            <Text style={[styles.headerText, { flex: 1, textAlign: "center" }]}>Contacto</Text>
            <Text style={[styles.headerText, { width: 90, textAlign: "center" }]}>Acciones</Text>
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

const styles = StyleSheet.create({
  screen: { flex: 1, padding: 16, backgroundColor: "#F9F7F3" },

  // headerBox usa el mismo marginHorizontal que tableWrapper para alinear
  headerBox: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
    marginTop: 60,
    marginHorizontal: 5, // coincide con tableWrapper
  },

  // Titulo ligeramente desplazado para alinearse con el contenido de la tabla
  header: { fontSize: 20, fontWeight: "bold", color: "#333", marginLeft: 8 },

  // Botón Agregar con color exacto y alineación correcta
  addButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#26328DFF", // color solicitado
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
  contactCell: { flex: 1, fontSize: 14, color: "#555", textAlign: "center" },
  actionsCell: { width: 90, flexDirection: "row", justifyContent: "center", alignItems: "center" },
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
