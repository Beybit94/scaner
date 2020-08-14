/* eslint-disable react/no-did-mount-set-state */
import React, { Component, ReactElement } from "react";
import * as Permissions from "expo-permissions";
import { View, Text } from "react-native";

export type CameraPermissionProps = {
  children?: ReactElement | ReactElement[];
};

export default class CameraPermission extends Component<CameraPermissionProps> {
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

    return this.props.children;
  }
}
