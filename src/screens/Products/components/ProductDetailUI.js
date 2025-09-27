import React from "react";
import {
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
import { SafeAreaView } from "react-native-safe-area-context";

export function ProductDetailUI({
  categories = [],
  collections = [],
  rawMaterials = [],
  formData,
  pickImage,
  removeImage,
  updateField,
  updateArrayItem,
  addArrayItem,
  removeArrayItem,
  updateVariantComponent,
  addArrayItemToVariant,
  handleSave,
  handleDelete, // 👈 nuevo handler para eliminar
  goBack,
  isNew = false,
  saving = false,
}) {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }} edges={["top", "bottom"]}>
      <View style={[styles.header, { paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0 }]}>
        <TouchableOpacity onPress={goBack}>
          <Ionicons name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{isNew ? "Crear Producto" : "Editar Producto"}</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
        <Text style={styles.section}>Imágenes</Text>
        <ScrollView horizontal>
          {formData.images.map((uri, index) => (
            <View key={index} style={{ marginRight: 10, alignItems: "center" }}>
              <Image source={{ uri }} style={styles.imageSmall} />
              <TouchableOpacity onPress={() => removeImage(index)}>
                <Text style={styles.deleteBtn}>Eliminar</Text>
              </TouchableOpacity>
            </View>
          ))}
          <TouchableOpacity style={styles.addBtn} onPress={pickImage}>
            <Text style={styles.addText}>+ Añadir Imagen</Text>
          </TouchableOpacity>
        </ScrollView>

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
            value={!!formData.availability}
            onValueChange={(value) => updateField("availability", value)}
          />
        </View>

        <Text style={styles.label}>Categoría</Text>
        <Picker
          selectedValue={formData.idProductCategory}
          onValueChange={(val) => updateField("idProductCategory", val)}
        >
          <Picker.Item label="-- Seleccionar categoría --" value="" />
          {categories.map((cat) => (
            <Picker.Item key={cat._id} label={cat.name} value={cat._id} />
          ))}
        </Picker>

        <Text style={styles.label}>Colección</Text>
        <Picker
          selectedValue={formData.idCollection}
          onValueChange={(val) => updateField("idCollection", val)}
        >
          <Picker.Item label="-- Seleccionar colección --" value="" />
          {collections.map((col) => (
            <Picker.Item key={col._id} label={col.name} value={col._id} />
          ))}
        </Picker>

        <Text style={styles.section}>Receta</Text>
        {formData.recipe.map((r, i) => (
          <View key={i} style={styles.arrayItem}>
            <TextInput
              style={[styles.input, { flex: 1 }]}
              value={r.step}
              placeholder="Paso"
              onChangeText={(text) => updateArrayItem("recipe", i, "step", text)}
            />
            <TouchableOpacity onPress={() => removeArrayItem("recipe", i)}>
              <Text style={styles.deleteBtn}>X</Text>
            </TouchableOpacity>
          </View>
        ))}
        <TouchableOpacity style={styles.addBtn} onPress={() => addArrayItem("recipe", { step: "" })}>
          <Text style={styles.addText}>+ Añadir Paso</Text>
        </TouchableOpacity>

        <Text style={styles.section}>Instrucciones de Uso</Text>
        {formData.useForm.map((u, i) => (
          <View key={i} style={styles.arrayItem}>
            <TextInput
              style={[styles.input, { flex: 1 }]}
              value={u.step || ""}
              placeholder="Instrucción"
              onChangeText={(text) => updateArrayItem("useForm", i, "step", text)}
            />
            <TouchableOpacity onPress={() => removeArrayItem("useForm", i)}>
              <Text style={styles.deleteBtn}>X</Text>
            </TouchableOpacity>
          </View>
        ))}
        <TouchableOpacity style={styles.addBtn} onPress={() => addArrayItem("useForm", { step: "" })}>
          <Text style={styles.addText}>+ Añadir Instrucción</Text>
        </TouchableOpacity>

        <Text style={styles.section}>Variantes</Text>
        {formData.variant.map((v, i) => (
          <View key={i} style={{ marginBottom: 10, padding: 10, borderWidth: 1, borderColor: "#ccc", borderRadius: 8 }}>
            <TextInput
              style={styles.input}
              placeholder="Nombre Variante"
              value={v.variant}
              onChangeText={(text) => updateArrayItem("variant", i, "variant", text)}
            />
            <TextInput
              style={styles.input}
              placeholder="Precio"
              keyboardType="numeric"
              value={v.variantPrice != null ? String(v.variantPrice) : ""}
              onChangeText={(text) => updateArrayItem("variant", i, "variantPrice", text === "" ? null : Number(text))}
            />

            <Text style={{ fontWeight: "bold", marginTop: 5 }}>Componentes de la Variante</Text>
            {v.components?.map((c, j) => (
              <View key={j} style={{ flexDirection: "row", alignItems: "center", marginBottom: 5 }}>
                <Picker
                  style={{ flex: 2 }}
                  selectedValue={c.idComponent}
                  onValueChange={(val) => updateVariantComponent(i, j, "idComponent", val)}
                >
                  <Picker.Item label="-- Seleccionar Componente --" value="" />
                  {rawMaterials.map((rm) => (
                    <Picker.Item key={rm._id} label={rm.name} value={rm._id} />
                  ))}
                </Picker>
                <TextInput
                  style={[styles.input, { flex: 1 }]}
                  value={c.amount != null ? String(c.amount) : ""}
                  placeholder="Cantidad"
                  keyboardType="numeric"
                  onChangeText={(text) => updateVariantComponent(i, j, "amount", text === "" ? "" : Number(text))}
                />
              </View>
            ))}
            <TouchableOpacity
              style={styles.addBtn}
              onPress={() => addArrayItemToVariant(i, { idComponent: "", name: "", amount: 0 })}
            >
              <Text style={styles.addText}>+ Añadir Componente a Variante</Text>
            </TouchableOpacity>
          </View>
        ))}
        <TouchableOpacity
          style={styles.addBtn}
          onPress={() => addArrayItem("variant", { variant: "", variantPrice: null, components: [] })}
        >
          <Text style={styles.addText}>+ Añadir Variante</Text>
        </TouchableOpacity>

        {/* Botón Guardar */}
        <TouchableOpacity
          style={[styles.saveButton, saving && { opacity: 0.6 }]}
          disabled={saving}
          onPress={handleSave}
        >
          <Text style={styles.saveText}>
            {isNew ? (saving ? "Creando..." : "Crear Producto") : (saving ? "Guardando..." : "Guardar Cambios")}
          </Text>
        </TouchableOpacity>

        {/* Botón Eliminar solo si NO es nuevo */}
        {!isNew && (
          <TouchableOpacity
            style={[styles.deleteButton, saving && { opacity: 0.6 }]}
            disabled={saving}
            onPress={handleDelete}
          >
            <Text style={styles.deleteText}>Eliminar Producto</Text>
          </TouchableOpacity>
        )}
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
  scrollContent: { padding: 15, paddingBottom: 40 },
  imageSmall: { width: 100, height: 100, borderRadius: 8, marginBottom: 5 },
  label: { fontWeight: "bold", marginTop: 10 },
  input: { borderWidth: 1, borderColor: "#ccc", borderRadius: 8, padding: 10, marginVertical: 5 },
  switchRow: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginVertical: 10 },
  section: { fontWeight: "bold", fontSize: 16, marginTop: 20, marginBottom: 5 },
  arrayItem: { flexDirection: "row", alignItems: "center", marginBottom: 5 },
  deleteBtn: { color: "red", fontSize: 16, marginLeft: 8 },
  addBtn: { backgroundColor: "#007bff", padding: 10, borderRadius: 8, marginTop: 5, alignItems: "center" },
  addText: { color: "#fff", fontWeight: "bold" },
  saveButton: { backgroundColor: "#28a745", padding: 15, borderRadius: 8, marginTop: 20, alignItems: "center" },
  saveText: { color: "#fff", fontWeight: "bold" },
  deleteButton: { backgroundColor: "#dc3545", padding: 15, borderRadius: 8, marginTop: 10, alignItems: "center" },
  deleteText: { color: "#fff", fontWeight: "bold" },
});
