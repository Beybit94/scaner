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
import { Loading } from "../Shared";

import { RootStackParamList } from "./Reception";

type PdfProps = StackScreenProps<RootStackParamList, "Pdf">;
export default class PdfFile extends Component<PdfProps> {
  state = {
    isLoading: false,
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
    try {
      const { taskId, PlanNum } = this.props.route.params;
      this.setState({ isLoading: true });
      const uri = `${Endpoints.BASE}${Endpoints.PDF}?PlanNum=${PlanNum}&TaskId=${taskId}`;
      const fileUri = FileSystem.documentDirectory + "акт.pdf";

      const downloadObject = FileSystem.createDownloadResumable(uri, fileUri);
      const res = await downloadObject.downloadAsync();
      if (res) {
        this.setState({ filePath: res?.uri, uri: uri });
      }
    } finally {
      this.setState({ isLoading: false });
      //this.selectOneFile();
    }
  };

  selectOneFile = async () => {
    try {
      let { filePath } = this.state;
      if (filePath) {
        if (Platform.OS === "ios") {
          filePath = filePath.replace("file://", "");
        }
        FileViewer.open(filePath)
          .then(() => {})
          .catch((_err) => {
            alert(_err);
          });
      }
    } catch (err) {
      alert("Unknown Error: " + JSON.stringify(err));
    }
  };

  renderPDFReader = () => {
    const { uri } = this.state;
    if (uri) {
      return <PDFReader source={{ uri: uri }} />;
    }
    return <View />;
  };

  render() {
    const { isLoading } = this.state;
    return <Loading isLoading={isLoading}>{this.renderPDFReader()}</Loading>;
  }
}
