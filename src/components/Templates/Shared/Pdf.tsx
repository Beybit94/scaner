import React, { Component } from "react";
import * as FileSystem from "expo-file-system";
import * as Permissions from "expo-permissions";
import * as MediaLibrary from "expo-media-library";
import * as Sharing from "expo-sharing";
import PDFReader from "rn-pdf-reader-js";

type Props = {
  url: string;
};

export default class Pdf extends Component<Props> {
  state = {
    uri: "",
    fileLocation: "",
  };

  createAlbum = async () => {
    const { uri } = this.state;
    const { status } = await Permissions.getAsync(Permissions.CAMERA_ROLL);
    if (status === "granted") {
      const asset = await MediaLibrary.createAssetAsync(uri);
      await MediaLibrary.createAlbumAsync("MyImages", asset, false);
    }
  };

  donwloadFile = async () => {
    if (this.state.uri) {
      this.createAlbum();
    } else {
      const { url } = this.props;
      const fileLocation =
        FileSystem.documentDirectory + `акт_${new Date().toISOString()}.pdf`;

      FileSystem.downloadAsync(url, fileLocation)
        .then(async (resp) => {
          this.setState({ uri: resp.uri, fileLocation: fileLocation });
          this.createAlbum();
          Sharing.shareAsync(fileLocation);
        })
        .catch((error) => {
          console.warn(error);
        });
    }
  };

  render() {
    const { url } = this.props;
    return <PDFReader source={{ uri: url }} />;
  }
}
