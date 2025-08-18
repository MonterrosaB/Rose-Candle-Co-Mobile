import React, { useState, useCallback } from "react";
import { View, Text, FlatList, Image, StyleSheet, ActivityIndicator, TouchableOpacity } from "react-native";
import { useFocusEffect } from "@react-navigation/native";

export default function Products({ navigation }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchProducts = () => {
    setLoading(true);
    fetch("https://rose-candle-co.onrender.com/api/products")
      .then((res) => res.json())
      .then((data) => {
        const cleanData = data.map(({ createdAt, updatedAt, __v, ...rest }) => rest);
        setProducts(cleanData);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error cargando productos:", error);
        setLoading(false);
      });
  };

  useFocusEffect(
    useCallback(() => {
      fetchProducts();
    }, [])
  );

  const renderItem = ({ item }) => {
    const imageUrl = Array.isArray(item.images) ? item.images[0] : item.images;

    return (
      <TouchableOpacity
        style={styles.card}
        onPress={() => navigation.navigate("ProductDetail", { product: item })}
      >
        <Image source={{ uri: imageUrl }} style={styles.image} resizeMode="cover" />
        <Text style={styles.name} numberOfLines={1}>{item.name}</Text>
        <Text style={styles.price}>Precio: ${item.variant?.[0]?.variantPrice ?? "N/A"}</Text>
        <Text style={styles.cost}>Categoría: {item.idProductCategory?.name ?? "Sin categoría"}</Text>
        <Text style={styles.cost}>Colección: {item.idCollection?.name ?? "Sin colección"}</Text>
        <View style={styles.footer}>
          <Text style={styles.size}>{item.variant?.[0]?.variant ?? "N/A"}</Text>
          <Text style={[styles.status,{ backgroundColor: item.availability ? "#2e7d32" : "#9e9e9e" }]}>
            {item.availability ? "Activo" : "Inactivo"}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#A78A5E" />
        <Text style={{ marginTop: 10 }}>Cargando productos...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={products}
        keyExtractor={(item) => item._id.toString()}
        renderItem={renderItem}
        numColumns={2}
        columnWrapperStyle={styles.row}
        contentContainerStyle={{ paddingVertical: 20, paddingBottom: 30 }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  centered: { flex: 1, justifyContent: "center", alignItems: "center" },
  row: { justifyContent: "space-between", paddingHorizontal: 10 },
  card: { backgroundColor: "#f9f9f9", borderRadius: 12, padding: 10, marginBottom: 20, flex: 1, marginHorizontal: 5, shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4, elevation: 3 },
  image: { width: "100%", height: 120, borderRadius: 10, marginBottom: 8 },
  name: { fontSize: 14, fontWeight: "600", color: "#333" },
  price: { fontSize: 13, color: "#A78A5E", marginTop: 4 },
  cost: { fontSize: 12, color: "#555", marginTop: 2 },
  footer: { flexDirection: "row", justifyContent: "space-between", marginTop: 8, alignItems: "center" },
  size: { fontSize: 12, backgroundColor: "#f0c14b", paddingHorizontal: 8, paddingVertical: 3, borderRadius: 12, overflow: "hidden" },
  status: { fontSize: 11, color: "#fff", paddingHorizontal: 8, paddingVertical: 3, borderRadius: 12, overflow: "hidden" },
});
