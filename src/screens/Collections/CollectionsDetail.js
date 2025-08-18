import React from "react";
import { View } from "react-native";
import { useCollectionsDetail } from "./hooks/useCollectionsDetail";
import { CollectionsDetailUI } from "./components/CollectionsDetailUI";

export default function CollectionsDetail() {
  const detailProps = useCollectionsDetail();

  return (
    <View style={{ flex: 1 }}>
      <CollectionsDetailUI {...detailProps} />
    </View>
  );
}
