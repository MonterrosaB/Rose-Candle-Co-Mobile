import React from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
} from "react-native";
import { Picker } from "@react-native-picker/picker";

export default function MaterialsDetailsView(props) {
  const {
    loading,
    name, setName,
    unit, setUnit,
    currentStock, setCurrentStock,
    currentPrice, setCurrentPrice,
    category, setCategory,
    supplier, setSupplier,
    categorias,
    proveedores,
    unidades,
    handleSave,
    navigationBack
  } = props;

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#000" />
        <Text style={styles.loadingText}>Cargando...</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Editar Material</Text>

      {/* Nombre */}
      <Text style={styles.label}>Nombre del material</Text>
      <TextInput
        style={styles.input}
        placeholder="Nombre"
        value={name}
        onChangeText={setName}
      />

      {/* Unidad */}
      <Text style={styles.label}>Unidad de medida</Text>
      <View style={styles.pickerContainer}>
        <Picker
          selectedValue={unit}
          onValueChange={(value) => setUnit(value)}
          style={styles.picker}
          itemStyle={styles.pickerItem}
        >
          <Picker.Item label="Selecciona una unidad..." value={null} />
          {unidades.map((u) => (
            <Picker.Item key={u.value} label={u.label} value={u.value} />
          ))}
        </Picker>
      </View>

      {/* Stock actual */}
      <Text style={styles.label}>Stock actual</Text>
      <TextInput
        style={styles.input}
        placeholder="Cantidad en stock"
        keyboardType="numeric"
        value={currentStock}
        onChangeText={setCurrentStock}
      />

      {/* Precio actual */}
      <Text style={styles.label}>Precio actual</Text>
      <TextInput
        style={styles.input}
        placeholder="Precio unitario"
        keyboardType="numeric"
        value={currentPrice}
        onChangeText={setCurrentPrice}
      />

      {/* Categoría */}
      <Text style={styles.label}>Categoría</Text>
      <View style={styles.pickerContainer}>
        <Picker
          selectedValue={category}
          onValueChange={(value) => setCategory(value)}
          style={styles.picker}
          itemStyle={styles.pickerItem}
        >
          <Picker.Item label="Selecciona una categoría..." value={null} />
          {categorias.map((c) => (
            <Picker.Item key={c._id} label={c.name} value={c._id} />
          ))}
        </Picker>
      </View>

      {/* Proveedor */}
      <Text style={styles.label}>Proveedor</Text>
      <View style={styles.pickerContainer}>
        <Picker
          selectedValue={supplier}
          onValueChange={(value) => setSupplier(value)}
          style={styles.picker}
          itemStyle={styles.pickerItem}
        >
          <Picker.Item label="Selecciona un proveedor..." value={null} />
          {proveedores.map((p) => (
            <Picker.Item key={p._id} label={p.name} value={p._id} />
          ))}
        </Picker>
      </View>

      {/* Botones */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[styles.button, styles.cancelButton]}
          onPress={() => navigationBack.goBack()}
        >
          <Text style={styles.buttonText}>Cancelar</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, styles.saveButton]}
          onPress={handleSave}
        >
          <Text style={styles.buttonText}>Guardar</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    paddingTop: 30, // <-- BAJA EL CONTENIDO
    backgroundColor: "#fff",
    flexGrow: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: "#555",
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
    color: "#000",
  },
  label: {
    fontSize: 16,
    marginBottom: 6,
    color: "#333",
  },
  input: {
    height: 50,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    paddingHorizontal: 12,
    marginBottom: 15,
    backgroundColor: "#fafafa",
    fontSize: 16,
    color: "#000",
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    marginBottom: 15,
    backgroundColor: "#fafafa",
    justifyContent: "center",
    height: 50, // <-- MÁS ALTO
  },
  picker: {
    flex: 1,
    color: "#000",
    fontSize: 16, // <-- FUENTE FIJA
    paddingLeft: 8, // <-- MARGEN INTERIOR
  },
  pickerItem: {
    fontSize: 16, // <-- TAMBIÉN PARA IOS
    height: 50,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
  },
  button: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: "center",
    marginHorizontal: 5,
  },
  cancelButton: {
    backgroundColor: "#999",
  },
  saveButton: {
    backgroundColor: "#007AFF",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});
