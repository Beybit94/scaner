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
    navigation.push("ScanDocument", { id: "1" });
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
  componentDidMount() {
    const { route } = this.props;
    const { id } = route.params;
    //const id = navigation.getParam("id", "");
  }

  _barCodeSacanned = ({ data }: any) => {
    const { navigation } = this.props;
    //navigation.push("ScanGood");
    console.warn(data);
  };

  render() {
    return <BarCode label="" onBarCodeScanned={this._barCodeSacanned} />;
  }
}

export { ScanDocumentButton, ScanDocument };
