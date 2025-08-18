import React from "react";
import { View, Text, Animated } from "react-native";

// Componente de tarjeta que muestra estadísticas como pedidos, ingresos o usuarios
const CardWidget = ({ bgColor, textColor, title, value, increment }) => {
  // Valor animado para animar el número
  const animatedValue = new Animated.Value(0);

  // Efecto que se ejecuta cada vez que cambia 'value'
  React.useEffect(() => {
    Animated.timing(animatedValue, {
      toValue: value, // Animar hasta el valor actual
      duration: 800,  // Duración de la animación en milisegundos
      useNativeDriver: false, // 'false' porque animamos un valor de texto
    }).start();
  }, [value]);

  return (
    <View
      style={{
        backgroundColor: bgColor, // Color de fondo de la tarjeta
        padding: 20,              // Espaciado interno
        borderRadius: 20,         // Bordes redondeados
        marginBottom: 10,         // Margen inferior entre tarjetas
        minWidth: 110,            // Ancho mínimo
        maxWidth: 160,            // Ancho máximo
        flex: 1,                  // Crece para ocupar espacio disponible
      }}
    >
      {/* Título de la tarjeta */}
      <Text style={{ fontSize: 16, fontWeight: "600", color: textColor }}>
        {title}
      </Text>

      {/* Valor principal animado */}
      <Animated.Text
        style={{
          fontSize: 24,
          fontWeight: "700",
          color: textColor,
          marginTop: 10,
        }}
      >
        {value}
      </Animated.Text>

      {/* Incremento adicional */}
      <Text style={{ fontSize: 14, color: textColor }}>+{increment}</Text>
    </View>
  );
};

export default CardWidget;
