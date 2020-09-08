import React, { Component } from "react";
import { View } from "react-native";
import { StackScreenProps } from "@react-navigation/stack";
import { Icon } from "react-native-elements";
import * as FileSystem from "expo-file-system";
import * as Permissions from "expo-permissions";
import * as MediaLibrary from "expo-media-library";
import * as Sharing from "expo-sharing";
import PDFReader from "rn-pdf-reader-js";

import { Endpoints } from "../../components";
import { Loading } from "../Shared";

import { RootStackParamList } from "./Reception";

type PdfProps = StackScreenProps<RootStackParamList, "Pdf">;
export default class PdfFile extends Component<PdfProps> {
  state = {
    isLoading: false,
    uri: "",
    fileLocation: "",
  };

  async componentDidMount() {
    const { navigation } = this.props;
    navigation.setOptions({
      headerRight: () => (
        <Icon
          iconStyle={{ marginRight: 10, color: "black" }}
          size={30}
          name="share"
          onPress={async () => {
            if (this.state.uri) {
              const { status } = await Permissions.getAsync(
                Permissions.CAMERA_ROLL
              );
              if (status === "granted") {
                const asset = await MediaLibrary.createAssetAsync(
                  this.state.uri
                );
                await MediaLibrary.createAlbumAsync("MyImages", asset, false);
              }
              Sharing.shareAsync(this.state.fileLocation);
            } else {
              const { taskId, PlanNum } = this.props.route.params;
              this.setState({ isLoading: true });
              const uri = `${Endpoints.BASE}${Endpoints.PDF}?PlanNum=${PlanNum}&TaskId=${taskId}`;
              const fileLocation =
                FileSystem.documentDirectory + `акт_${PlanNum}.pdf`;

              FileSystem.downloadAsync(uri, fileLocation)
                .then(async (resp) => {
                  this.setState({ uri: resp.uri, fileLocation: fileLocation });
                  const { status } = await Permissions.getAsync(
                    Permissions.CAMERA_ROLL
                  );
                  if (status === "granted") {
                    const asset = await MediaLibrary.createAssetAsync(resp.uri);
                    await MediaLibrary.createAlbumAsync(
                      "MyImages",
                      asset,
                      false
                    );
                  }
                  Sharing.shareAsync(fileLocation);
                })
                .catch((error) => {
                  console.warn(error);
                })
                .finally(() => {
                  this.setState({ isLoading: false });
                });
            }
          }}
        />
      ),
    });
  }

  donwloadFile = async () => {
    const { taskId, PlanNum } = this.props.route.params;
    this.setState({ isLoading: true });
    const uri = `${Endpoints.BASE}${Endpoints.PDF}?PlanNum=${PlanNum}&TaskId=${taskId}`;
    const fileLocation = FileSystem.documentDirectory + `акт_${PlanNum}.pdf`;

    FileSystem.downloadAsync(uri, fileLocation)
      .then(async (resp) => {
        this.setState({ uri: resp?.uri, fileLocation: fileLocation });
      })
      .catch((error) => {
        console.warn(error);
      })
      .finally(() => {
        this.setState({ isLoading: false });
      });
  };

  renderPDFReader = () => {
    const { taskId, PlanNum } = this.props.route.params;
    const uri = `${Endpoints.BASE}${Endpoints.PDF}?PlanNum=${PlanNum}&TaskId=${taskId}`;
    return <PDFReader source={{ uri: uri }} />;
  };

  render() {
    const { isLoading } = this.state;
    return <Loading isLoading={isLoading}>{this.renderPDFReader()}</Loading>;
  }
}
