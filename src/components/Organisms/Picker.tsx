import React, { Component } from "react";
import {
  Dimensions,
  StyleSheet,
  TouchableHighlight,
  View,
  Text,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { Card } from "react-native-paper";
import { Icon } from "react-native-elements";

import CameraPermission from "./CameraPermission";

const { width } = Dimensions.get("window");
const styles = StyleSheet.create({
  mTop: {
    marginTop: 10,
  },
  card: {
    width: width / 2 - 15,
    height: width / 2 - 15,
    alignItems: "center",
    justifyContent: "center",
  },
  button: {
    width: width / 2 - 20,
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
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
        <Card style={[styles.card, styles.mTop]}>
          <TouchableHighlight onPress={this._pickImage}>
            <View style={styles.button}>
              <Text>Добавить фото</Text>
              <Icon size={15} name="add" reverse />
            </View>
          </TouchableHighlight>
        </Card>
      </CameraPermission>
    );
  }
}
