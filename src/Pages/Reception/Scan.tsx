import React, { Component } from "react";
import { StackScreenProps } from "@react-navigation/stack";
import { Alert } from "react-native";

import { BarCode } from "../Shared";

import { RootStackParamList } from "./Reception";
import { ReceptionPage } from "./Good";

type ScanProps = StackScreenProps<RootStackParamList, "Scan">;
export default class Scan extends Component<ScanProps> {
  state = {
    isScanned: false,
  };

  componentDidMount() {
    const { navigation } = this.props;
    navigation.addListener("focus", () => {
      this.setState({ isScanned: false });
    });
  }

  _barCodeSacanned = async (data: string) => {
    const { navigation, route } = this.props;
    const page = route.params?.page;

    this.setState({ isScanned: !this.state.isScanned });
    try {
      const onGoBack = route.params?.onGoBack;
      if (onGoBack) {
        onGoBack(data);
      }
    } catch (ex) {
      Alert.alert(
        "Error signing in",
        JSON.stringify(ex.message),
        [{ text: "OK" }],
        { cancelable: false }
      );
    } finally {
      navigation.goBack();
    }
  };

  render() {
    return (
      <BarCode
        onBarCodeScanned={
          this.state.isScanned ? undefined : this._barCodeSacanned
        }
      />
    );
  }
}
