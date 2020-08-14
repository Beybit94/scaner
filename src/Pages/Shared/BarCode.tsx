/* eslint-disable react/no-did-mount-set-state */
import React, { Component } from "react";
import { View, Text, StyleSheet } from "react-native";
import * as Permissions from "expo-permissions";
import { BarCodeScanner } from "expo-barcode-scanner";

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
  state = {
    CameraPermissionGranted: null,
  };

  async componentDidMount() {
    const { status } = await Permissions.askAsync(Permissions.CAMERA);
    this.setState({
      CameraPermissionGranted: status === "granted" ? true : false,
    });
  }

  _setValue = (data: string) => {
    const { onBarCodeScanned } = this.props;
    if (onBarCodeScanned) {
      onBarCodeScanned(data);
    }
  };

  render() {
    const { CameraPermissionGranted } = this.state;

    if (CameraPermissionGranted === null) {
      return (
        <View style={{ flex: 1, justifyContent: "center" }}>
          <Text>Разрешите камеру</Text>
        </View>
      );
    }

    if (CameraPermissionGranted === false) {
      return (
        <View style={{ flex: 1, justifyContent: "center" }}>
          <Text>Нет доступа к камере</Text>
        </View>
      );
    }

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
