/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react/no-did-mount-set-state */
import React, { Component } from "react";
import { Dimensions, View, Text } from "react-native";
import * as Permissions from "expo-permissions";
import { BarCodeScanner } from "expo-barcode-scanner";

const { width, height } = Dimensions.get("window");

export type BarCodeProps = {
  label: string;
  onBarCodeScanned: (data: any) => void;
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

  _setValue = ({ data }: any) => {
    const { onBarCodeScanned } = this.props;
    onBarCodeScanned(data);
  };

  render() {
    const { CameraPermissionGranted } = this.state;
    const { label } = this.props;

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
        <Text>{label}</Text>
        <BarCodeScanner
          style={{ height: height, width: width }}
          onBarCodeScanned={this._setValue}
        />
      </View>
    );
  }
}
