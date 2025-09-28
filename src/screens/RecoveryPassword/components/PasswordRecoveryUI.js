import React, { useRef, useEffect } from "react";
import { View, Text, TextInput, TouchableOpacity, ActivityIndicator, ScrollView } from "react-native";
import { Controller } from "react-hook-form";

export const PasswordRecoveryUI = (props) => {
  const {
    step,
    userEmail,
    loading,
    control,
    handleSubmit,
    setValue,
    watch,
    handleRequest,
    handleVerify,
    handleUpdate,
    handleResendCode,
    handleGoBack,
    message,
  } = props;

  const codeInputs = useRef([]);
  const newPassword = watch("newPassword");

  useEffect(() => {
    if (step === 2) codeInputs.current[0]?.focus();
  }, [step]);

  const renderCodeInputs = () => (
    <View style={{ flexDirection: "row", justifyContent: "center", gap: 10, marginVertical: 16 }}>
      {[0, 1, 2, 3, 4].map((i) => (
        <Controller
          key={i}
          control={control}
          name={`code${i}`}
          render={({ field: { onChange, value } }) => (
            <TextInput
              style={{ width: 50, height: 50, borderWidth: 1, borderColor: "#ccc", textAlign: "center", fontSize: 20, borderRadius: 8 }}
              keyboardType="numeric"
              maxLength={1}
              ref={el => (codeInputs.current[i] = el)}
              value={value}
              onChangeText={val => {
                onChange(val);
                setValue(`code${i}`, val);
                if (val && i < 4) codeInputs.current[i + 1]?.focus();
              }}
            />
          )}
        />
      ))}
    </View>
  );

  return (
    <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: "center", padding: 24, backgroundColor: "#F0ECE6" }}>
      <View style={{ backgroundColor: "#fff", borderRadius: 20, padding: 24, shadowColor: "#000", shadowOpacity: 0.1, shadowRadius: 10 }}>
        {/* STEP 1: Solicitar código */}
        {step === 1 && (
          <View>
            <Text style={{ fontSize: 24, fontWeight: "600", marginBottom: 16 }}>Recuperar contraseña</Text>
            <Controller
              control={control}
              name="email"
              rules={{ required: "El correo es obligatorio" }}
              render={({ field: { onChange, value } }) => (
                <TextInput
                  placeholder="Correo electrónico"
                  style={{ borderWidth: 1, borderColor: "#ccc", borderRadius: 8, padding: 12, marginBottom: 16 }}
                  value={value}
                  onChangeText={onChange}
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
              )}
            />
            <TouchableOpacity onPress={handleSubmit(handleRequest)} style={{ padding: 12, borderWidth: 1, borderColor: "#C2A878", borderRadius: 8, alignItems: "center" }}>
              {loading.request ? <ActivityIndicator /> : <Text style={{ color: "#C2A878" }}>Enviar código</Text>}
            </TouchableOpacity>
            {message && <Text style={{ marginTop: 8, color: "#86918C" }}>{message}</Text>}
          </View>
        )}

        {/* STEP 2: Verificar código */}
        {step === 2 && (
          <View>
            <Text style={{ fontSize: 24, fontWeight: "600", marginBottom: 16 }}>Código de verificación</Text>
            <Text style={{ marginBottom: 16 }}>Hemos enviado un código a {userEmail}</Text>
            {renderCodeInputs()}
            <TouchableOpacity onPress={handleSubmit(handleVerify)} style={{ padding: 12, borderWidth: 1, borderColor: "#C2A878", borderRadius: 8, alignItems: "center", marginBottom: 8 }}>
              {loading.verify ? <ActivityIndicator /> : <Text style={{ color: "#C2A878" }}>Verificar</Text>}
            </TouchableOpacity>
            <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
              <TouchableOpacity onPress={handleResendCode}>
                <Text style={{ color: "#86918C", textDecorationLine: "underline" }}>
                  {loading.resend ? "Reenviando..." : "Reenviar código"}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={handleGoBack}>
                <Text style={{ color: "#86918C", textDecorationLine: "underline" }}>Volver</Text>
              </TouchableOpacity>
            </View>
            {message && <Text style={{ marginTop: 8, color: "#86918C" }}>{message}</Text>}
          </View>
        )}

        {/* STEP 3: Nueva contraseña */}
        {step === 3 && (
          <View>
            <Text style={{ fontSize: 24, fontWeight: "600", marginBottom: 16 }}>Nueva contraseña</Text>
            <Controller
              control={control}
              name="newPassword"
              rules={{ required: "La contraseña es obligatoria", minLength: 8 }}
              render={({ field: { onChange, value } }) => (
                <TextInput
                  placeholder="Nueva contraseña"
                  secureTextEntry
                  style={{ borderWidth: 1, borderColor: "#ccc", borderRadius: 8, padding: 12, marginBottom: 12 }}
                  value={value}
                  onChangeText={onChange}
                />
              )}
            />
            <Controller
              control={control}
              name="confirmPassword"
              rules={{ required: "Confirma tu contraseña", validate: val => val === newPassword || "Las contraseñas no coinciden" }}
              render={({ field: { onChange, value } }) => (
                <TextInput
                  placeholder="Confirmar contraseña"
                  secureTextEntry
                  style={{ borderWidth: 1, borderColor: "#ccc", borderRadius: 8, padding: 12, marginBottom: 16 }}
                  value={value}
                  onChangeText={onChange}
                />
              )}
            />
            <TouchableOpacity onPress={handleSubmit(handleUpdate)} style={{ padding: 12, borderWidth: 1, borderColor: "#C2A878", borderRadius: 8, alignItems: "center" }}>
              {loading.update ? <ActivityIndicator /> : <Text style={{ color: "#C2A878" }}>Actualizar</Text>}
            </TouchableOpacity>
          </View>
        )}

        {/* STEP 4: Confirmación */}
        {step === 4 && (
          <View>
            <Text style={{ fontSize: 24, fontWeight: "600", marginBottom: 16 }}>¡Contraseña actualizada!</Text>
            <Text style={{ marginBottom: 16 }}>Ya puedes iniciar sesión con tu nueva contraseña.</Text>
            <TouchableOpacity style={{ padding: 12, borderWidth: 1, borderColor: "#C2A878", borderRadius: 8, alignItems: "center" }}>
              <Text style={{ color: "#C2A878" }}>Iniciar sesión</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </ScrollView>
  );
};
