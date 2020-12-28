import React, { Component } from "react";
import { Dimensions, StyleSheet } from "react-native";
import * as ImagePicker from "expo-image-picker";
import { Button, Card } from "react-native-paper";

import CameraPermission from "./CameraPermission";

const { width } = Dimensions.get("window");
const styles = StyleSheet.create({
  card: {
    width: width / 2 - 10,
  },
  button: {
    backgroundColor: "green",
    width: "100%",
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
        <Card style={styles.card}>
          <Card.Cover
            source={{
              uri:
                "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADMAAAAzCAYAAAA6oTAqAAAAEXRFWHRTb2Z0d2FyZQBwbmdjcnVzaEB1SfMAAABQSURBVGje7dSxCQBACARB+2/ab8BEeQNhFi6WSYzYLYudDQYGBgYGBgYGBgYGBgYGBgZmcvDqYGBgmhivGQYGBgYGBgYGBgYGBgYGBgbmQw+P/eMrC5UTVAAAAABJRU5ErkJggg==",
            }}
            resizeMode={"cover"}
          />
          <Card.Actions>
            <Button
              icon="camera"
              onPress={this._pickImage}
              mode="contained"
              style={styles.button}
            >
              Добавить фото
            </Button>
          </Card.Actions>
        </Card>
      </CameraPermission>
    );
  }
}
