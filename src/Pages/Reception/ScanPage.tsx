import React, { Component } from "react";
import { StackScreenProps } from "@react-navigation/stack";

import { BarCode } from "../../components/Templates";

import { RootStackParamList } from "./ReceptionStackParam";

type ScanPageProps = StackScreenProps<RootStackParamList, "ScanPage">;
export default class ScanPage extends Component<ScanPageProps> {
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

    this.setState({ isScanned: !this.state.isScanned });
    try {
      const onGoBack = route.params?.onGoBack;
      if (onGoBack) {
        onGoBack(data);
      }
    } finally {
      navigation.goBack();
    }
  };

  render() {
    return (
      <BarCode
        onScaned={this.state.isScanned ? undefined : this._barCodeSacanned}
      />
    );
  }
}
