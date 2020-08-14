/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { Component } from "react";
import { View } from "react-native";
import { StackScreenProps } from "@react-navigation/stack";

import { BarCode, CustomButton } from "../Shared";

import { RootStackParamList } from "./Reception";

type ScanDocumentButtonProps = StackScreenProps<
  RootStackParamList,
  "ScanDocumentButton"
>;
class ScanDocumentButton extends Component<ScanDocumentButtonProps> {
  _onClick = () => {
    const { navigation } = this.props;
    navigation.push("ScanDocument");
  };

  render() {
    return (
      <View>
        <CustomButton label="Сканировать документ" onClick={this._onClick} />
      </View>
    );
  }
}

type ScanDocumentProps = StackScreenProps<RootStackParamList, "ScanDocument">;
class ScanDocument extends Component<ScanDocumentProps> {
  state = {
    isScanned: false,
  };

  componentDidMount() {
    const { navigation } = this.props;
    navigation.addListener("focus", () => {
      this.setState({ isScanned: false });
    });
  }

  _barCodeSacanned = (data: string) => {
    const { navigation } = this.props;
    this.setState({ isScanned: !this.state.isScanned });
    navigation.push("ScanGoodButton", { id: data });
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

export { ScanDocumentButton, ScanDocument };
