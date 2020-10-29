import React, { Component } from "react";
import { View, StyleSheet } from "react-native";
import { BarCodeScanner } from "expo-barcode-scanner";

import { CameraPermission } from "../../Organisms";

const opacity = "rgba(0, 0, 0, .6)";
const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
  },
  layerTop: {
    flex: 2,
    backgroundColor: opacity,
  },
  layerCenter: {
    flex: 1,
    flexDirection: "row",
  },
  layerLeft: {
    flex: 1,
    backgroundColor: opacity,
  },
  focused: {
    flex: 10,
  },
  layerRight: {
    flex: 1,
    backgroundColor: opacity,
  },
  layerBottom: {
    flex: 2,
    backgroundColor: opacity,
  },
});

export type BarCodeProps = {
  onBarCodeScanned?: (data: string) => void;
};

export default class BarCode extends Component<BarCodeProps> {
  _setValue = (data: string) => {
    const { onBarCodeScanned } = this.props;
    if (onBarCodeScanned) {
      onBarCodeScanned(data);
    }
  };

  render() {
    return (
      <BarCodeScanner
        style={[StyleSheet.absoluteFill, styles.container]}
        onBarCodeScanned={(scan) => this._setValue(scan.data)}
      >
        <View style={styles.layerTop} />
        <View style={styles.layerCenter}>
          <View style={styles.layerLeft} />
          <View style={styles.focused} />
          <View style={styles.layerRight} />
        </View>
        <View style={styles.layerBottom} />
      </BarCodeScanner>
    );
  }
}
