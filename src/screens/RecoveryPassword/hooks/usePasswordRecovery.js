import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-native-toast-message"; // si usas react-native-toast-message

export const usePasswordRecovery = (API) => {
  const [step, setStep] = useState(1);
  const [userEmail, setUserEmail] = useState("");
  const [loading, setLoading] = useState({
    request: false,
    verify: false,
    resend: false,
    update: false,
  });
  const [message, setMessage] = useState("");

  const { register, handleSubmit, reset, setValue, getValues, watch, formState } = useForm();

  // Solicitar código
  const requestCode = async ({ email }) => {
    setLoading((prev) => ({ ...prev, request: true }));
    try {
      const res = await fetch(`${API}/recoveryPassword/requestCode`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
        credentials: "include",
      });
      const data = await res.json();
      if (res.ok) {
        setMessage("Código enviado al correo.");
        toast.show({ type: "success", text1: "Código enviado al correo" });
        return true;
      } else {
        setMessage(data.message || "No se pudo enviar el código");
        toast.show({ type: "error", text1: data.message || "No se pudo enviar el código" });
        return false;
      }
    } catch (err) {
      setMessage("Error del servidor.");
      toast.show({ type: "error", text1: "Error del servidor" });
      return false;
    } finally {
      setLoading((prev) => ({ ...prev, request: false }));
    }
  };

  // Verificar código
  const verifyCode = async ({ code }) => {
    setLoading((prev) => ({ ...prev, verify: true }));
    try {
      const res = await fetch(`${API}/recoveryPassword/verifyCode`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code }),
        credentials: "include",
      });
      const data = await res.json();
      if (res.ok && data.message === "Code verified successfully") {
        toast.show({ type: "success", text1: "Código verificado" });
        return true;
      } else {
        toast.show({ type: "error", text1: data.message || "Código inválido" });
        return false;
      }
    } catch (err) {
      toast.show({ type: "error", text1: "Error al verificar el código" });
      return false;
    } finally {
      setLoading((prev) => ({ ...prev, verify: false }));
    }
  };

  // Actualizar contraseña
  const updatePassword = async ({ newPassword }) => {
    setLoading((prev) => ({ ...prev, update: true }));
    try {
      const res = await fetch(`${API}/recoveryPassword/newPassword`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ newPassword }),
        credentials: "include",
      });
      const data = await res.json();
      if (res.ok && data.message === "Password updated") {
        toast.show({ type: "success", text1: "Contraseña actualizada" });
        return true;
      } else {
        toast.show({ type: "error", text1: data.message || "No se pudo actualizar" });
        return false;
      }
    } catch (err) {
      toast.show({ type: "error", text1: "Error del servidor" });
      return false;
    } finally {
      setLoading((prev) => ({ ...prev, update: false }));
    }
  };

  const handleRequest = async (data) => {
    const success = await requestCode(data);
    if (success) {
      setUserEmail(data.email);
      setStep(2);
      reset();
    }
  };

  const handleVerify = async (data) => {
    const code = [0, 1, 2, 3, 4].map((i) => data[`code${i}`] || "").join("");
    if (!/^\d{5}$/.test(code)) {
      setMessage("El código debe tener 5 dígitos");
      return;
    }
    const success = await verifyCode({ code });
    if (success) {
      setStep(3);
      reset();
    }
  };

  const handleUpdate = async (data) => {
    const success = await updatePassword({ newPassword: data.newPassword });
    if (success) {
      setStep(4);
      reset();
    }
  };

  const handleResendCode = async () => {
    if (!userEmail) return;
    setLoading((prev) => ({ ...prev, resend: true }));
    await requestCode({ email: userEmail });
    setLoading((prev) => ({ ...prev, resend: false }));
  };

  const handleGoBack = () => {
    setStep(1);
    reset();
  };

  return {
    step,
    userEmail,
    loading,
    message,
    register,
    handleSubmit,
    reset,
    setValue,
    getValues,
    watch,
    formState,
    handleRequest,
    handleVerify,
    handleUpdate,
    handleResendCode,
    handleGoBack,
  };
};
