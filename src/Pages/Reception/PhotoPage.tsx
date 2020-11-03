import React, { Component } from "react";
import { StackScreenProps } from "@react-navigation/stack";
import { ScrollView, View, StyleSheet } from "react-native";

import { CustomButton, ImageItem } from "../../components/Molecules";
import { Picker } from "../../components/Organisms";
import { Loading } from "../../components/Templates";
import { TaskService } from "../../services";

import { RootStackParamList } from "./ReceptionStackParam";

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

type State = {
  isLoading: boolean;
  images: FormDataValue[];
};
type PhotoPageProps = StackScreenProps<RootStackParamList, "PhotoPage">;
export default class PhotoPage extends Component<PhotoPageProps, State> {
  state = {
    isLoading: false,
    images: [],
  };

  endTask = async () => {
    try {
      this.setState({ isLoading: true });
      const { images } = this.state;
      await TaskService.endTask(images).then(() => {
        const { navigation } = this.props;
        navigation.reset({
          index: 0,
          routes: [{ name: "GoodPage" }],
        });
      });
    } finally {
      this.setState({ isLoading: false });
    }
  };

  onDelete = (index: number) => {
    const { images } = this.state;
    images.splice(index, 1);
    this.setState({ images: images });
  };

  onAdd = (image: FormDataValue) => {
    const { images } = this.state;
    (images as FormDataValue[]).push(image);
    this.setState({ images: images });
  };

  render() {
    const { endTask, onDelete, onAdd } = this;
    const { isLoading, images } = this.state;
    return (
      <Loading isLoading={isLoading}>
        <View style={styles.container}>
          <ScrollView>
            <View style={styles.image}>
              {(images as FormDataValue[]).map((item, i) => (
                <ImageItem
                  key={i}
                  uri={item.uri}
                  index={i}
                  onDelete={() => onDelete(i)}
                />
              ))}
            </View>
          </ScrollView>
          <Picker add={onAdd} />
          {images.length > 0 && (
            <CustomButton label={"Завершить задачу"} onClick={endTask} />
          )}
        </View>
      </Loading>
    );
  }
}
