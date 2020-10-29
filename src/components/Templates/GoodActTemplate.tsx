import React, { Component } from "react";
import { ScrollView, View, StyleSheet } from "react-native";

import { CustomButton, ImageItem } from "../Molecules";
import { Picker } from "../Organisms";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: "#ecf0f1",
  },
  image: {
    flex: 1,
    flexDirection: "row",
    flexWrap: "wrap",
  },
});

type Props = {
  images: FormDataValue[];
  endTask: () => void;
  onDelete?: () => void;
};

export default class GoodActTemplate extends Component<Props> {
  render() {
    const { images, endTask, onDelete } = this.props;

    return (
      <View style={styles.container}>
        <ScrollView>
          <View style={styles.image}>
            {images.map((item, i) => (
              <ImageItem uri={item.uri} index={i} onDelete={onDelete} />
            ))}
          </View>
        </ScrollView>
        <Picker images={images} />
        {images.length > 0 && (
          <CustomButton label={"Завершить задачу"} onClick={endTask} />
        )}
      </View>
    );
  }
}
