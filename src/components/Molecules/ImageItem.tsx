import React, { Component } from "react";
import { Dimensions, StyleSheet } from "react-native";
import { Icon } from "react-native-elements";
import { Card } from "react-native-paper";

const { width } = Dimensions.get("window");
const styles = StyleSheet.create({
  mTop: {
    marginTop: 10,
  },
  card: {
    width: width / 2 - 15,
    height: width / 2 - 15,
  },
  button: {
    position: "absolute",
    top: -12,
    right: -12,
  },
});

type Props = {
  uri: string;
  index: number;
  onDelete: () => void;
};

export default class ImageItem extends Component<Props> {
  render() {
    const { uri, onDelete } = this.props;
    return (
      <Card style={[styles.card, styles.mTop]}>
        <Card.Cover
          source={{ uri: uri }}
          resizeMode="cover"
          style={styles.card}
        />
        <Card.Actions style={styles.button}>
          <Icon raised size={20} name="delete" color="red" onPress={onDelete} />
        </Card.Actions>
      </Card>
    );
  }
}
