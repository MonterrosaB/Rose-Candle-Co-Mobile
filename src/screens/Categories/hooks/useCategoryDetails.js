import { useState } from "react"; // Importa useState para manejar estado local
import { useNavigation, useRoute } from "@react-navigation/native"; // Hooks de navegación
import { Alert } from "react-native"; // Para mostrar alertas en la app

// URL base de la API de categorías de productos
const ApiCategories = "https://rose-candle-co.onrender.com/api/productCategories";

export default function useCategoryDetails() {
  const navigation = useNavigation(); // Hook para navegar entre pantallas
  const route = useRoute(); // Hook para obtener parámetros de la ruta
  const category = route.params?.category || null; // Si viene una categoría, la usamos, sino null

  // Estado para el nombre de la categoría (editando o nueva)
  const [name, setName] = useState(category ? category.name : "");
  // Estado para saber si se está guardando (mostrar spinner/deshabilitar botón)
  const [saving, setSaving] = useState(false);

  // Función para guardar la categoría (crear o actualizar)
  const handleSave = async () => {
    try {
      setSaving(true); // Activamos indicador de guardado
      const data = { name }; // Datos que se enviarán a la API
      const url = category ? `${ApiCategories}/${category._id}` : ApiCategories; // URL depende de si es editar o crear
      const method = category ? "PUT" : "POST"; // Método HTTP según acción

      // Llamada a la API
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      // Si la respuesta no es correcta, lanzamos un error
      if (!res.ok)
        throw new Error(
          category ? "Error al actualizar categoría" : "Error al crear categoría"
        );

      // Si todo va bien, mostramos alerta de éxito
      Alert.alert(
        "Éxito",
        category ? "Categoría actualizada." : "Categoría creada."
      );

      // Volvemos a la pantalla anterior
      navigation.goBack();
    } catch (error) {
      // Si hay error, lo mostramos en alerta
      Alert.alert("Error", error.message);
    } finally {
      setSaving(false); // Desactivamos indicador de guardado
    }
  };

  // Retornamos todas las variables y funciones que usarán los componentes
  return {
    category, // La categoría editada (o null si es nueva)
    name, // Nombre de la categoría
    setName, // Función para actualizar el nombre
    saving, // Estado de guardado
    handleSave, // Función para guardar
    navigation, // Navegación para volver o ir a otra pantalla
  };
}
