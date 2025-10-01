import { useState, useEffect } from "react";
import Toast from "react-native-toast-message";

const ApiAuth = "https://rose-candle-co.onrender.com/api/auth/verifyEmployee";
const ApiEmployees = "https://rose-candle-co.onrender.com/api/employees";

export const useProfile = () => {
  const [formData, setFormData] = useState({
    id: "",
    name: "",
    surnames: "",
    phone: "",
    email: "",
    dui: "",
    user: "",
    password: "**********",
  });
  const [loading, setLoading] = useState(false);

  const getProfile = async () => {
    try {
      setLoading(true);
      const res = await fetch(ApiAuth, { credentials: "include" });
      if (!res.ok) throw new Error("Error al verificar usuario");

      const data = await res.json();
      const empRes = await fetch(`${ApiEmployees}/${data.id}`);
      if (!empRes.ok) throw new Error("Error al cargar empleado");
      const empData = await empRes.json();

      setFormData({
        id: empData._id || empData.id,
        name: empData.name || "",
        surnames: empData.surnames || "",
        phone: empData.phone || "",
        email: empData.email || "",
        dui: empData.dui || "",
        user: empData.user || "",
        password: "**********",
      });
    } catch (err) {
      console.error(err);
      Toast.show({ type: "error", text1: "No se pudo cargar el perfil" });
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async () => {
    try {
      setLoading(true);
      const sendData = { ...formData };
      if (sendData.password === "**********") delete sendData.password;

      const res = await fetch(`${ApiEmployees}/${formData.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(sendData),
      });
      if (!res.ok) throw new Error("Error al actualizar perfil");

      const result = await res.json();
      Toast.show({ type: "success", text1: "Perfil actualizado correctamente" });

      setFormData({
        ...formData,
        ...result,
        password: "**********",
      });
    } catch (err) {
      console.error(err);
      Toast.show({ type: "error", text1: "Error al guardar cambios" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getProfile();
  }, []);

  return { formData, setFormData, loading, getProfile, updateProfile };
};
