import React from "react";
import { View, Text } from "react-native";

// Componente que muestra una lista de materiales con poco stock
const LowStockList = ({ materials = [] }) => {
  return (
    <View
      style={{
        // Contenedor principal
        padding: 20,
        borderRadius: 20,
        backgroundColor: "#fff",
        shadowColor: "#000",
        shadowOpacity: 0.1,
        shadowRadius: 10,
        marginBottom: 20,
      }}
    >
      {/* Título del componente */}
      <Text style={{ fontSize: 18, fontWeight: "600", marginBottom: 10 }}>
        Materiales con Poco Stock
      </Text>

      {/* Iterar sobre los materiales recibidos */}
      {materials.map((item) => (
        <View
          key={item._id} // Usar _id como key única
          style={{
            flexDirection: "row", // Alinear nombre y cantidad en una fila
            justifyContent: "space-between", // Separar los extremos
            marginBottom: 5,
          }}
        >
          {/* Mostrar el nombre del material, truncado si es muy largo */}
          <Text>
            {item.name?.length > 15
              ? item.name.slice(0, 15) + "..." // Si es más largo que 15 caracteres
              : item.name}
          </Text>

          {/* Mostrar el stock actual con unidad */}
          <Text>{item.stockWithUnit}</Text>
        </View>
      ))}
    </View>
  );
};

export default LowStockList;
