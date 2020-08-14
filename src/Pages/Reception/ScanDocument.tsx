/* eslint-disable react/no-did-mount-set-state */
import React, { Component } from "react";
import { View } from "react-native";
import { StackScreenProps } from "@react-navigation/stack";

import { BarCode, CustomButton } from "../Shared";

import { RootStackParamList } from "./Reception";

enum ScanPage {
  DOCUMENT = 1,
  GOOD = 2,
}
type ScanButtonProps = StackScreenProps<RootStackParamList, "ScanButton">;
class ScanButton extends Component<ScanButtonProps> {
  state = {
    page: ScanPage.DOCUMENT,
    id: "",
  };

  _onClick = () => {
    const { navigation } = this.props;
    navigation.push("Scan", {
      page: this.state.page,
      onGoBack: (id: string) => {
        this.setState({
          page: ScanPage.GOOD,
          id: id,
        });
        navigation.setOptions({ title: `Прием товара № ${id}` });
      },
    });
  };

  render() {
    return (
      <View>
        <CustomButton
          label={
            this.state.page === ScanPage.DOCUMENT
              ? "Сканировать документ"
              : "Сканировать товар"
          }
          onClick={this._onClick}
        />
      </View>
    );
  }
}

type ScanProps = StackScreenProps<RootStackParamList, "Scan">;
class Scan extends Component<ScanProps> {
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
    const { navigation, route } = this.props;
    const page = route.params?.page;

    this.setState({ isScanned: !this.state.isScanned });

    switch (page) {
      case ScanPage.DOCUMENT:
        const onGoBack = route.params?.onGoBack;
        if (onGoBack) {
          onGoBack(data);
        }

        break;
      case ScanPage.GOOD:
        break;
    }

    navigation.goBack();
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

export { ScanButton, Scan };
