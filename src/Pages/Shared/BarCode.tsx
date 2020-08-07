/* eslint-disable react/no-did-mount-set-state */
import React, { Component } from "react";
import { Dimensions, View, Text } from "react-native";
import * as Permissions from "expo-permissions";
import { BarCodeScanner } from "expo-barcode-scanner";

const { width, height } = Dimensions.get("window");

type Props = {
  onBarCodeScanned: () => void;
};

export default class BarCode extends Component<Props> {
  state = {
    CameraPermissionGranted: null,
  };

  async componentDidMount() {
    const { status } = await Permissions.askAsync(Permissions.CAMERA);
    this.setState({
      CameraPermissionGranted: status === "granted" ? true : false,
    });
  }

  render() {
    const { CameraPermissionGranted } = this.state;
    const { onBarCodeScanned } = this.props;

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
      <View style={{ flex: 1, justifyContent: "center", alignSelf: "center" }}>
        <BarCodeScanner
          style={{ height: height / 1.1, width: width }}
          onBarCodeScanned={onBarCodeScanned}
        />
      </View>
    );
  }
}
