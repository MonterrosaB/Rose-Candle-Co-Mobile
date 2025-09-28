import { useState } from "react";
import { useForm } from "react-hook-form";

// URL base de tu API
const API = "https://rose-candle-co-1.onrender.com/api";

export const usePasswordRecovery = () => {
  const [step, setStep] = useState(1);
  const [userEmail, setUserEmail] = useState("");
  const [token, setToken] = useState(""); // <-- token para enviar en cada request
  const [loading, setLoading] = useState({
    request: false,
    verify: false,
    resend: false,
    update: false,
  });
  const [message, setMessage] = useState("");

  const { control, handleSubmit, reset, setValue, watch } = useForm();

  // --- Solicitar código ---
  const requestCode = async ({ email }) => {
    setLoading(prev => ({ ...prev, request: true }));
    try {
      const res = await fetch(`${API}/recoveryPassword/requestCode`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();

      if (res.status === 200 && data.token) {
        setToken(data.token);
        setMessage("Código enviado al correo.");
        return true;
      } else {
        setMessage(data.message || "No se pudo enviar el código");
        return false;
      }
    } catch (err) {
      setMessage("Error del servidor.");
      return false;
    } finally {
      setLoading(prev => ({ ...prev, request: false }));
    }
  };

  // --- Verificar código ---
  const verifyCode = async ({ code }) => {
    setLoading(prev => ({ ...prev, verify: true }));
    try {
      const res = await fetch(`${API}/recoveryPassword/verifyCode`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code, token }),
      });
      const data = await res.json();

      if (res.status === 200 && data.token) {
        setToken(data.token);
        setMessage("Código verificado");
        return true;
      } else {
        setMessage(data.message || "Código inválido");
        return false;
      }
    } catch (err) {
      setMessage("Error al verificar el código");
      return false;
    } finally {
      setLoading(prev => ({ ...prev, verify: false }));
    }
  };

  // --- Actualizar contraseña ---
  const updatePassword = async ({ newPassword }) => {
    setLoading(prev => ({ ...prev, update: true }));
    try {
      const res = await fetch(`${API}/recoveryPassword/newPassword`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ newPassword, token }),
      });
      const data = await res.json();

      if (res.status === 200) {
        setMessage("Contraseña actualizada");
        setToken(""); // limpiar token
        return true;
      } else {
        setMessage(data.message || "No se pudo actualizar");
        return false;
      }
    } catch (err) {
      setMessage("Error del servidor");
      return false;
    } finally {
      setLoading(prev => ({ ...prev, update: false }));
    }
  };

  // --- Handlers ---
  const handleRequest = async (data) => {
    const success = await requestCode(data);
    if (success) {
      setUserEmail(data.email);
      setStep(2);
      reset();
    }
  };

  const handleVerify = async (data) => {
    const code = [0,1,2,3,4].map(i => data[`code${i}`] || "").join("");
    if (!/^\d{5}$/.test(code)) {
      setMessage("El código debe tener 5 dígitos");
      return;
    }
    const success = await verifyCode({ code });
    if (success) setStep(3);
  };

  const handleUpdate = async (data) => {
    if (data.newPassword !== data.confirmPassword) {
      setMessage("Las contraseñas no coinciden");
      return;
    }
    const success = await updatePassword({ newPassword: data.newPassword });
    if (success) setStep(4);
  };

  const handleResendCode = async () => {
    setLoading(prev => ({ ...prev, resend: true }));
    await requestCode({ email: userEmail });
    setLoading(prev => ({ ...prev, resend: false }));
  };

  const handleGoBack = () => setStep(1);

  return {
    step,
    userEmail,
    control,
    handleSubmit,
    setValue,
    watch,
    handleRequest,
    handleVerify,
    handleUpdate,
    handleResendCode,
    handleGoBack,
    loading,
    message,
  };
};
