import React from "react";
import { View, Text, Dimensions } from "react-native";
import { PieChart } from "react-native-chart-kit";

const COLORS = ["#E8DCC3", "#C2A878", "#A3A380"];
const screenWidth = Dimensions.get("window").width;

const PopularProducts = ({ data = [] }) => {
  const pieData = data.map((item, index) => ({
    name: item.productName?.length > 0 ? item.productName : `Item ${index + 1}`,
    population: item.totalQuantity,
    color: COLORS[index % COLORS.length],
    legendFontColor: "#333",
    legendFontSize: 12
  }));

  return (
    <View
      style={{
        padding: 20,
        borderRadius: 20,
        backgroundColor: "#fff",
        shadowColor: "#000",
        shadowOpacity: 0.1,
        shadowRadius: 10,
        marginBottom: 20
      }}
    >
      <Text style={{ fontSize: 18, fontWeight: "600", marginBottom: 10 }}>
        Productos Populares
      </Text>

      {data.length > 0 && (
        <PieChart
          data={pieData}
          width={screenWidth - 60}
          height={150}
          chartConfig={{
            color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`
          }}
          accessor={"population"}
          backgroundColor={"transparent"}
          paddingLeft={"10"}
          center={[0, 0]}
          absolute
        />
      )}
    </View>
  );
};

export default PopularProducts;
