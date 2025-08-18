import React from "react";
import { View, Text } from "react-native";

const LowStockList = ({ materials = [] }) => { // valor por defecto
  return (
    <View style={{
      padding: 20,
      borderRadius: 20,
      backgroundColor: "#fff",
      shadowColor: "#000",
      shadowOpacity: 0.1,
      shadowRadius: 10,
      marginBottom: 20
    }}>
      <Text style={{ fontSize: 18, fontWeight: "600", marginBottom: 10 }}>Materiales con Poco Stock</Text>

      {materials.map((item) => (
        <View key={item._id} style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: 5 }}>
          <Text>{item.materialName?.length > 15 ? item.materialName.slice(0, 15) + "..." : item.materialName}</Text>
          <Text>{item.stock}</Text>
        </View>
      ))}
    </View>
  );
};

export default LowStockList;
