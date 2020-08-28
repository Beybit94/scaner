/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable no-alert */
/* eslint-disable react/no-did-mount-set-state */
import React, { Component } from "react";
import { Platform, View } from "react-native";
import { StackScreenProps } from "@react-navigation/stack";
import * as FileSystem from "expo-file-system";
import FileViewer from "react-native-file-viewer";
import PDFReader from "rn-pdf-reader-js";
import PDFView from "react-native-pdf-view";

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
    this.donwloadFile();
  }

  donwloadFile = async () => {
    const task = await LocalStorage.getItem<TaskModel>(StorageKeys.ACTIVE_TASK);
    if (task) {
      const uri = `${Endpoints.BASE}${Endpoints.PDF}?PlanNum=${task.PlanNum}&TaskId=${task.Id}`;
      const fileUri = FileSystem.documentDirectory + "акт.pdf";

      const downloadObject = FileSystem.createDownloadResumable(uri, fileUri);
      const res = await downloadObject.downloadAsync();
      if (res) {
        const data = FileSystem.readAsStringAsync(res?.uri);
        console.log(data);
      }

      this.setState({ uri: uri });
    }
  };

  selectOneFile = async () => {
    try {
      let { uri } = this.state;
      if (Platform.OS === "ios") {
        uri = uri.replace("file://", "");
      }
      console.log("URI : " + uri);
      FileViewer.open(uri)
        .then(() => {})
        .catch((_err) => {
          alert(_err);
        });
    } catch (err) {
      alert("Unknown Error: " + JSON.stringify(err));
    }
  };

  renderView = () => {
    return <View />;
  };

  renderPDFReader = () => {
    const { uri } = this.state;
    return <PDFReader source={{ uri: uri }} />;
  };

  renderPDFView = () => {
    const { uri } = this.state;
    return <PDFView src={uri} />;
  };

  render() {
    return this.renderPDFView();
  }
}
