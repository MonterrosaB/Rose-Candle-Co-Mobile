import React, { useState, useEffect } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Alert, ActivityIndicator } from "react-native";
import { Picker } from "@react-native-picker/picker";

export default function MaterialsDetails({ route, navigation }) {
  const { material } = route.params;

  // Estados para el formulario
  const [name, setName] = useState(material.name);
  const [unit, setUnit] = useState(material.unit);
  const [currentStock, setCurrentStock] = useState(String(material.currentStock));
  const [currentPrice, setCurrentPrice] = useState(String(material.purchasePrice));
  const [category, setCategory] = useState(material.category?._id || "");
  const [supplier, setSupplier] = useState(material.supplier?._id || "");
  const [minStock, setMinStock] = useState(String(material.minStock));

    const unidades = [
    { label: "Kilogramo", value: "kg" },
    { label: "Gramo", value: "g" },
    { label: "Litro", value: "l" },
    { label: "Mililitro", value: "ml" },
    { label: "Pieza", value: "pieza" },
  ];

  // Listas desde la API
  const [categorias, setCategorias] = useState([]);
  const [proveedores, setProveedores] = useState([]);
  const [loading, setLoading] = useState(true);

  // Cargar datos de API
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch de categorías
        const catRes = await fetch("https://rose-candle-co.onrender.com/api/rawMaterialCategories"); // <--- PON TU API AQUÍ
        const catData = await catRes.json();
        setCategorias(catData);

        // Fetch de proveedores
        const provRes = await fetch("https://rose-candle-co.onrender.com/api/suppliers"); // <--- PON TU API AQUÍ
        const provData = await provRes.json();
        setProveedores(provData);
        setLoading(false);
      } catch (error) {
        console.error("Error cargando datos:", error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleSave = async () => {
    try {
      const res = await fetch(`https://rose-candle-co.onrender.com/api/rawMaterials/${material._id}`, { // <--- PON TU API AQUÍ
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          unit,
          currentStock: Number(currentStock),
          purchasePrice: Number(currentPrice),
          category,
          supplier,
          minStock: Number(minStock),
        }),
      });

      if (!res.ok) throw new Error("Error al guardar");

      Alert.alert("Guardado", "Los cambios han sido guardados.");
      navigation.goBack();
    } catch (error) {
      Alert.alert("Error", error.message);
    }
  };

  const handleDelete = async () => {
    Alert.alert("Eliminar", "¿Seguro que deseas eliminar este material?", [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Eliminar",
        style: "destructive",
        onPress: async () => {
          try {
            const res = await fetch(`https://rose-candle-co.onrender.com/api/rawMaterials/${material._id}`, { 
              method: "DELETE",
            });

            if (!res.ok) throw new Error("Error al eliminar");

            Alert.alert("Eliminado", "El material ha sido eliminado.");
            navigation.goBack();
          } catch (error) {
            Alert.alert("Error", error.message);
          }
        },
      },
    ]);
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#A78A5E" />
        <Text>Cargando datos...</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.header}>Editar Materia Prima</Text>

      {/* Nombre */}
      <Text style={styles.label}>Nombre</Text>
      <TextInput style={styles.input} value={name} onChangeText={setName} />

      {/* Categoría */}
      <Text style={styles.label}>Categoría</Text>
      <View style={styles.pickerContainer}>
        <Picker selectedValue={category} onValueChange={setCategory}>
          {categorias.map((cat, index) => (
            <Picker.Item key={cat._id || index} label={cat.name} value={cat._id} />
          ))}
        </Picker>
      </View>

      {/* Unidad */}
      <Text style={styles.label}>Unidad</Text>
      <View style={styles.pickerContainer}>
        <Picker selectedValue={unit} onValueChange={setUnit}>
          {unidades.map((u, index) => (
            <Picker.Item key={u.value || index} label={u.label} value={u.value} />
          ))}
        </Picker>
      </View>

      {/* Proveedor */}
      <Text style={styles.label}>Proveedor</Text>
      <View style={styles.pickerContainer}>
        <Picker selectedValue={supplier} onValueChange={setSupplier}>
          {proveedores.map((sup, index) => (
            <Picker.Item key={sup._id || index} label={sup.name} value={sup._id} />
          ))}
        </Picker>
      </View>

      {/* Stock actual */}
      <Text style={styles.label}>Cantidad actual</Text>
      <TextInput
        style={styles.input}
        value={currentStock}
        onChangeText={setCurrentStock}
        keyboardType="numeric"
      />

      {/* Precio */}
      <Text style={styles.label}>Precio</Text>
      <TextInput
        style={styles.input}
        value={currentPrice}
        onChangeText={setCurrentPrice}
        keyboardType="numeric"
      />

      {/* Botones */}
      <View style={styles.buttonsContainer}>
        <TouchableOpacity style={[styles.button, styles.saveButton]} onPress={handleSave}>
          <Text style={styles.buttonText}>Guardar</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.button, styles.deleteButton]} onPress={handleDelete}>
          <Text style={styles.buttonText1}>Eliminar</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20, backgroundColor: "#fff" },
  header: { fontSize: 20, fontWeight: "bold", marginBottom: 20 },
  label: { fontSize: 14, marginBottom: 5, fontWeight: "600" },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 8,
    borderRadius: 6,
    marginBottom: 15,
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 6,
    marginBottom: 15,
  },
  buttonsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
  },
  button: {
    flex: 1,
    padding: 12,
    borderRadius: 6,
    alignItems: "center",
    marginHorizontal: 5,
  },
  saveButton: { backgroundColor: "#7D7954" },
  deleteButton: { backgroundColor: "#F2EBD9"},
  buttonText: { color: "#fff", fontWeight: "bold" },
    buttonText1: { color: "#7D7954", fontWeight: "bold" },

  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
});
