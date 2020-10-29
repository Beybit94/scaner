import React, { Component } from "react";
import { Dimensions, StyleSheet } from "react-native";
import { Button, Card } from "react-native-paper";

const { width } = Dimensions.get("window");
const styles = StyleSheet.create({
  card: {
    width: width / 2,
  },
  button: {
    margin: 8,
    backgroundColor: "green",
  },
});

type Props = {
  uri: string;
  index: number;
  onDelete?: () => void;
};

export default class ImageItem extends Component<Props> {
  render() {
    const { uri, index, onDelete } = this.props;
    return (
      <Card key={index} style={styles.card}>
        <Card.Cover source={{ uri: uri }} resizeMode={"cover"} />
        <Card.Actions>
          <Button
            icon="delete"
            onPress={onDelete}
            mode="contained"
            style={styles.button}
          >
            Удалить
          </Button>
        </Card.Actions>
      </Card>
    );
  }
}
