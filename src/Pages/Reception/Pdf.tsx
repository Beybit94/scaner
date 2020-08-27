/* eslint-disable react/no-did-mount-set-state */
import React, { Component } from "react";
import { StackScreenProps } from "@react-navigation/stack";
import { Share } from "react-native";
import PDFReader from "rn-pdf-reader-js";
import { FileSystem } from "expo";

import {
  Endpoints,
  LocalStorage,
  StorageKeys,
  TaskModel,
} from "../../components";

import { RootStackParamList } from "./Reception";

type PdfProps = StackScreenProps<RootStackParamList, "Pdf">;
export default class PdfFile extends Component<PdfProps> {
  state = {
    uri: "",
  };
  async componentDidMount() {
    const task = await LocalStorage.getItem<TaskModel>(StorageKeys.ACTIVE_TASK);
    if (task) {
      this.setState({
        uri: `${Endpoints.BASE}${Endpoints.PDF}?PlanNum=${task.PlanNum}&TaskId=${task.Id}`,
      });
    }
  }
  render() {
    const { uri } = this.state;
    return <PDFReader source={{ uri: uri }} />;
  }
}
