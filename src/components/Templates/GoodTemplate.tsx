import React, { Component } from "react";
import { View, StyleSheet } from "react-native";
import ScanBarcode from "components/Molecules/ScanBarcode";
import GoodList from "components/Organisms/GoodList";
import { Responses } from "services/api/Responses";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 10,
  },
});

type Props = {
  title: string;
  data: Responses.GoodModel[];
  itemClick?: (model: Responses.GoodModel) => void;
  itemEdit: (row: number) => void;
  itemRemove: (model: Responses.GoodModel) => void;
  showScan: () => void;
};

export default class GoodTemplate extends Component<Props> {
  render() {
    const {
      title,
      data,
      itemClick,
      itemEdit,
      itemRemove,
      showScan,
    } = this.props;
    return (
      <View style={styles.container}>
        <ScanBarcode title={title} showScan={showScan} />
        <GoodList
          data={data}
          onPress={itemClick}
          onEdit={itemEdit}
          onRemove={itemRemove}
        />
      </View>
    );
  }
}
