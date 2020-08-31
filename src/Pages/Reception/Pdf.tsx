/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable no-alert */

import React, { Component } from "react";
import { Platform, View } from "react-native";
import { StackScreenProps } from "@react-navigation/stack";
import * as FileSystem from "expo-file-system";
import PDFReader from "rn-pdf-reader-js";
import FileViewer from "react-native-file-viewer";

import {
  Endpoints,
  LocalStorage,
  StorageKeys,
  TaskModel,
} from "../../components";
import { TaskManager } from "../../Managers";

import { RootStackParamList } from "./Reception";

type PdfProps = StackScreenProps<RootStackParamList, "Pdf">;
export default class PdfFile extends Component<PdfProps> {
  state = {
    uri: "",
    html: "",
    filePath: "",
  };

  async componentDidMount() {
    this.donwloadFile();
  }

  getPdf = async () => {
    const task = await LocalStorage.getItem<TaskModel>(StorageKeys.ACTIVE_TASK);
    if (task) {
      await TaskManager.pdf(task.Id, task.PlanNum).then((res) => {
        this.setState({ html: res.data });
      });
    }
  };

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

  render() {
    return this.renderPDFReader();
  }
}
