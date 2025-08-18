// useProductDetail.js
import { useState, useEffect } from "react"; // useState para manejar estado, useEffect para efectos secundarios
import * as ImagePicker from "expo-image-picker"; // Para seleccionar imágenes desde la galería
import { Alert } from "react-native"; // Para mostrar alertas

// Hook personalizado para manejar detalle de un producto
export function useProductDetail(product, navigation) {
  // Estados para categorías, colecciones y nueva imagen seleccionada
  const [categories, setCategories] = useState([]);
  const [collections, setCollections] = useState([]);
  const [newImage, setNewImage] = useState(null);

  // Estado para manejar el formulario del producto
  const [formData, setFormData] = useState({
    name: product.name || "",
    description: product.description || "",
    availability: Boolean(product.availability), // Convierte a booleano
    variant: Array.isArray(product.variant) ? product.variant : [],
    components: Array.isArray(product.components) ? product.components : [],
    recipe: Array.isArray(product.recipe) ? product.recipe : [],
    useForm: Array.isArray(product.useForm) ? product.useForm : [],
    idProductCategory: product.idProductCategory?._id || product.idProductCategory || "",
    idCollection: product.idCollection?._id || product.idCollection || "",
  });

  // Determina la URL de la imagen a mostrar
  const imageUrl = newImage
    ? newImage.uri // Si hay nueva imagen seleccionada
    : Array.isArray(product.images)
    ? product.images[0] // Si es array, toma la primera
    : product.images; // Si no, usa directamente

  // useEffect para cargar categorías y colecciones al montar el hook
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Obtener categorías desde la API
        const resCat = await fetch("https://rose-candle-co.onrender.com/api/productCategories");
        const textCat = await resCat.text(); // Obtener texto
        try {
          const dataCat = JSON.parse(textCat); // Intentar parsear JSON
          setCategories(Array.isArray(dataCat) ? dataCat : []); // Guardar solo si es array
        } catch {
          console.error("Respuesta inválida para categorías:", textCat);
          setCategories([]);
        }

        // Obtener colecciones desde la API
        const resCol = await fetch("https://rose-candle-co.onrender.com/api/collections");
        const textCol = await resCol.text();
        try {
          const dataCol = JSON.parse(textCol);
          setCollections(Array.isArray(dataCol) ? dataCol : []);
        } catch {
          console.error("Respuesta inválida para colecciones:", textCol);
          setCollections([]);
        }
      } catch (error) {
        console.error("Error al cargar categorías o colecciones", error);
      }
    };

    fetchData();
  }, []); // Solo al montar

  // Función para seleccionar imagen desde la galería
  const pickImage = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaType.IMAGE,
        allowsEditing: true,
        quality: 0.8,
      });

      if (!result.canceled) {
        setNewImage(result.assets[0]); // Guardar imagen seleccionada
      }
    } catch (e) {
      console.error("Error al seleccionar imagen:", e);
    }
  };

  // Actualiza un campo simple del formulario
  const updateField = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  // Actualiza un objeto dentro de un array del formulario
  const updateArrayItem = (field, index, key, value) => {
    const updated = Array.isArray(formData[field]) ? [...formData[field]] : [];
    if (!updated[index]) return; // Si el índice no existe, no hacer nada
    updated[index] = { ...updated[index], [key]: value };
    setFormData((prev) => ({ ...prev, [field]: updated }));
  };

  // Agrega un nuevo elemento a un array del formulario
  const addArrayItem = (field, item) => {
    setFormData((prev) => ({ ...prev, [field]: [...(prev[field] || []), item] }));
  };

  // Elimina un elemento de un array del formulario
  const removeArrayItem = (field, index) => {
    const updated = Array.isArray(formData[field]) ? [...formData[field]] : [];
    updated.splice(index, 1);
    setFormData((prev) => ({ ...prev, [field]: updated }));
  };

  // Función para guardar cambios del producto
  const handleSave = async () => {
    try {
      let response;

      if (newImage) {
        // Si hay nueva imagen, usamos FormData
        const form = new FormData();
        form.append("name", formData.name);
        form.append("description", formData.description);
        form.append("availability", formData.availability ? "true" : "false");
        form.append("idProductCategory", formData.idProductCategory);
        form.append("idCollection", formData.idCollection);
        form.append("variant", JSON.stringify(formData.variant));
        form.append("components", JSON.stringify(formData.components));
        form.append("recipe", JSON.stringify(formData.recipe));
        form.append("useForm", JSON.stringify(formData.useForm));
        form.append("image", {
          uri: newImage.uri,
          name: "product.jpg",
          type: "image/jpeg",
        });

        response = await fetch(
          `https://rose-candle-co.onrender.com/api/products/${product._id}`,
          {
            method: "PUT",
            body: form, // No definir Content-Type para que FormData funcione
          }
        );
      } else {
        // Sin nueva imagen, enviamos JSON
        const payload = {
          ...formData,
          availability: formData.availability ? "true" : "false",
        };

        response = await fetch(
          `https://rose-candle-co.onrender.com/api/products/${product._id}`,
          {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
          }
        );
      }

      const text = await response.text();
      console.log("Status:", response.status);
      console.log("Response:", text);

      if (!response.ok) throw new Error("Error al actualizar");

      Alert.alert("Éxito", "Producto actualizado correctamente");
      navigation.goBack(); // Regresa a la pantalla anterior
    } catch (error) {
      console.error(error);
      Alert.alert("Error", "No se pudo actualizar el producto");
    }
  };

  // Retorna todas las variables y funciones que se usarán en la UI
  return {
    categories,
    collections,
    formData,
    imageUrl,
    pickImage,
    updateField,
    updateArrayItem,
    addArrayItem,
    removeArrayItem,
    handleSave,
  };
}
