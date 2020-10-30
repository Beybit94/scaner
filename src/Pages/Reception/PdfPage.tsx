/* eslint-disable react/no-did-mount-set-state */
import React, { Component } from "react";
import { StackScreenProps } from "@react-navigation/stack";
import { View } from "react-native";

import { Pdf } from "../../components/Templates";
import { TaskService } from "../../services";

import { RootStackParamList } from "./ReceptionStackParam";

type PdfPageProps = StackScreenProps<RootStackParamList, "PdfPage">;
export default class PdfPage extends Component<PdfPageProps> {
  state = {
    url: "",
  };

  async componentDidMount() {
    const uri = await TaskService.pdf();
    this.setState({ url: uri });
  }

  render() {
    const { url } = this.state;
    if (url) {
      return <Pdf url={url} />;
    }
    return <View />;
  }
}
