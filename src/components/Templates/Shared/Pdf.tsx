import React, { Component } from "react";
import { NavigationContext } from "@react-navigation/native";
import * as FileSystem from "expo-file-system";
import * as Permissions from "expo-permissions";
import * as MediaLibrary from "expo-media-library";
import * as Sharing from "expo-sharing";
import { Icon } from "react-native-elements";
import PDFReader from "rn-pdf-reader-js";

import Loading from "./Loading";

type Props = {
  url: string;
};

export default class Pdf extends Component<Props> {
  static contextType = NavigationContext;
  state = {
    uri: "",
    fileLocation: "",
    isLoading: false,
  };

  componentDidMount() {
    const navigation = this.context;
    navigation.setOptions({
      headerRight: () => (
        <Icon
          iconStyle={{ marginRight: 10, color: "black" }}
          size={30}
          name="share"
          onPress={async () => {
            this.share();
          }}
        />
      ),
    });
  }

  createAlbum = async () => {
    const { uri } = this.state;
    const { status } = await Permissions.getAsync(Permissions.CAMERA_ROLL);
    if (status === "granted") {
      const asset = await MediaLibrary.createAssetAsync(uri);
      await MediaLibrary.createAlbumAsync("MyImages", asset, false);
    }
  };

  share = async () => {
    if (this.state.fileLocation) {
      Sharing.shareAsync(this.state.fileLocation);
    } else {
      this.setState({ isLoading: true });

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
        })
        .finally(() => {
          this.setState({ isLoading: false });
        });
    }
  };

  render() {
    const { url } = this.props;
    const { isLoading } = this.state;
    return (
      <Loading isLoading={isLoading}>
        <PDFReader source={{ uri: url }} />
      </Loading>
    );
  }
}
