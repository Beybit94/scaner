import React, { Component } from "react";
import { StyleSheet } from "react-native";
import * as ImagePicker from "expo-image-picker";
import { Button } from "react-native-paper";

import CameraPermission from "./CameraPermission";

const styles = StyleSheet.create({
  button: {
    margin: 8,
    backgroundColor: "green",
  },
});

type Props = {
  add: (image: FormDataValue) => void;
};

export default class Picker extends Component<Props> {
  _pickImage = async () => {
    const { add } = this.props;
    try {
      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.All,
        allowsEditing: false,
        quality: 1,
      });

      if (!result.cancelled) {
        const media = {
          uri: result.uri,
          type: "image/jpeg",
          name: `Акт_${new Date().toISOString()}.jpg`,
        };
        add(media);
      }
    } catch (ex) {
      console.log(ex);
    }
  };

  render() {
    return (
      <CameraPermission>
        <Button
          icon="camera"
          mode="contained"
          onPress={this._pickImage}
          style={styles.button}
        >
          Фото
        </Button>
      </CameraPermission>
    );
  }
}
