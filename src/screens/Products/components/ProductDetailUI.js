import React from "react";
import {
  SafeAreaView,
  ScrollView,
  View,
  Text,
  TextInput,
  Image,
  StyleSheet,
  Switch,
  TouchableOpacity,
  StatusBar,
  Platform,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import { Ionicons } from "@expo/vector-icons";

export function ProductDetailUI({
  categories = [],
  collections = [],
  formData,
  imageUrl,
  pickImage,
  updateField,
  updateArrayItem,
  addArrayItem,
  removeArrayItem,
  handleSave,
  goBack,
}) {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
      <View style={[styles.header, { paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0 }]}>
        <TouchableOpacity onPress={goBack}>
          <Ionicons name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Products</Text>
        <View style={{ width: 24 }} /> 
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <TouchableOpacity onPress={pickImage}>
          <Image source={{ uri: imageUrl }} style={styles.image} resizeMode="cover" />
          <Text style={styles.touchText}>Tocar para cambiar imagen</Text>
        </TouchableOpacity>

        <Text style={styles.label}>Nombre</Text>
        <TextInput
          style={styles.input}
          value={formData.name}
          onChangeText={(text) => updateField("name", text)}
        />

        <Text style={styles.label}>Descripción</Text>
        <TextInput
          style={[styles.input, { height: 80 }]}
          value={formData.description}
          onChangeText={(text) => updateField("description", text)}
          multiline
        />

        <View style={styles.switchRow}>
          <Text style={styles.label}>Disponible</Text>
          <Switch
            value={formData.availability}
            onValueChange={(value) => updateField("availability", value)}
          />
        </View>

        <Text style={styles.label}>Categoría</Text>
        <Picker
          selectedValue={formData.idProductCategory}
          onValueChange={(val) => updateField("idProductCategory", val)}
        >
          {categories.map((cat) => (
            <Picker.Item key={cat._id} label={cat.name} value={cat._id} />
          ))}
        </Picker>

        <Text style={styles.label}>Colección</Text>
        <Picker
          selectedValue={formData.idCollection}
          onValueChange={(val) => updateField("idCollection", val)}
        >
          {collections.map((col) => (
            <Picker.Item key={col._id} label={col.name} value={col._id} />
          ))}
        </Picker>

        <Text style={styles.section}>Variantes</Text>
        {formData.variant.map((v, i) => (
          <View key={i} style={styles.arrayItem}>
            <TextInput
              style={[styles.input, { flex: 1 }]}
              value={v.variant}
              placeholder="Nombre"
              onChangeText={(text) => updateArrayItem("variant", i, "variant", text)}
            />
            <TextInput
              style={[styles.input, { flex: 1 }]}
              value={String(v.variantPrice || 0)}
              placeholder="Precio"
              keyboardType="numeric"
              onChangeText={(text) =>
                updateArrayItem("variant", i, "variantPrice", Number(text) || 0)
              }
            />
            <TouchableOpacity onPress={() => removeArrayItem("variant", i)}>
              <Text style={styles.deleteBtn}>X</Text>
            </TouchableOpacity>
          </View>
        ))}
        <TouchableOpacity
          style={styles.addBtn}
          onPress={() => addArrayItem("variant", { variant: "", variantPrice: 0 })}
        >
          <Text style={styles.addText}>+ Añadir Variante</Text>
        </TouchableOpacity>

        <Text style={styles.section}>Componentes</Text>
        {formData.components.map((c, i) => (
          <View key={i} style={styles.arrayItem}>
            <TextInput
              style={[styles.input, { flex: 1 }]}
              value={c.idComponent}
              placeholder="ID Componente"
              onChangeText={(text) => updateArrayItem("components", i, "idComponent", text)}
            />
            <TextInput
              style={[styles.input, { flex: 1 }]}
              value={String(c.amount || 0)}
              placeholder="Cantidad"
              keyboardType="numeric"
              onChangeText={(text) =>
                updateArrayItem("components", i, "amount", Number(text) || 0)
              }
            />
            <TouchableOpacity onPress={() => removeArrayItem("components", i)}>
              <Text style={styles.deleteBtn}>X</Text>
            </TouchableOpacity>
          </View>
        ))}
        <TouchableOpacity
          style={styles.addBtn}
          onPress={() => addArrayItem("components", { idComponent: "", amount: 0 })}
        >
          <Text style={styles.addText}>+ Añadir Componente</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.saveButton} disabled={true} onPress={handleSave}>
          <Text style={styles.saveText}>Guardar Cambios</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 15,
    paddingBottom: 12,
    backgroundColor: "#f5f5f5",
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  headerTitle: { fontSize: 18, fontWeight: "bold", textAlign: "center" },
  scrollContent: { padding: 15, paddingTop: 30, paddingBottom: 40 },
  image: { width: "100%", height: 220, borderRadius: 10, marginBottom: 10 },
  touchText: { textAlign: "center", marginBottom: 15, color: "#666" },
  label: { fontWeight: "bold", marginTop: 10 },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 10,
    marginVertical: 5,
  },
  switchRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginVertical: 10,
  },
  section: { fontWeight: "bold", fontSize: 16, marginTop: 20, marginBottom: 5 },
  arrayItem: { flexDirection: "row", alignItems: "center", marginBottom: 5 },
  deleteBtn: { color: "red", fontSize: 18, marginLeft: 10 },
  addBtn: {
    backgroundColor: "#eee",
    padding: 8,
    borderRadius: 5,
    alignItems: "center",
    marginVertical: 8,
  },
  addText: { color: "#333" },
  saveButton: {
    backgroundColor: "#A78A5E",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 30,
    marginBottom: 30,
  },
  saveText: { color: "#fff", fontWeight: "bold", fontSize: 16 },
});
