import React from "react";
import { View, Text } from "react-native";
import { PieChart } from "react-native-svg-charts"; // Verifica que esté correctamente instalado

const PopularProducts = ({ data = [] }) => { // valor por defecto
  const pieData = data.map((item, index) => ({
    value: item.totalQuantity,
    svg: { fill: ["#E8DCC3", "#C2A878", "#A3A380"][index % 3] },
    key: `pie-${index}`
  }));

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
      <Text style={{ fontSize: 18, fontWeight: "600", marginBottom: 10 }}>Productos Populares</Text>

      {data.length > 0 && <PieChart style={{ height: 150 }} data={pieData} />}

      {data.map((item, index) => (
        <View key={item._id} style={{ flexDirection: "row", alignItems: "center", marginTop: 5 }}>
          <View style={{
            width: 12,
            height: 12,
            backgroundColor: ["#E8DCC3", "#C2A878", "#A3A380"][index % 3],
            marginRight: 10,
            borderRadius: 6
          }} />
          <Text>{item.productName?.length > 10 ? item.productName.slice(0, 10) + "..." : item.productName}</Text>
        </View>
      ))}
    </View>
  );
};

export default PopularProducts;
