import React, { Component } from "react";
import { StackScreenProps } from "@react-navigation/stack";
import { ScrollView, View, Text, Image, StyleSheet } from "react-native";

import { Loading } from "../../components/Templates";
import { DictionaryService, GoodService } from "../../services";
import {
  CustomButton,
  DropDownWithTitile,
  ImageItem,
  TextInputWithTitle,
} from "../../components/Molecules";
import { Picker } from "../../components/Organisms";

import { RootStackParamList } from "./ReceptionStackParam";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
    backgroundColor: "#ecf0f1",
    margin: 10,
  },
  image: {
    flex: 1,
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop: 10,
  },
  title: {
    fontSize: 20,
  },
});

type PhotoPageProps = StackScreenProps<RootStackParamList, "DefectPage">;
export default class DefectPage extends Component<PhotoPageProps> {
  state = {
    isLoading: false,
    images: [],
    percetages: [],
    serialNumber: "",
    description: "",
    damagePercent: 1,
  };

  componentDidMount() {
    this.getPercetages();
  }

  getPercetages = async () => {
    try {
      this.setState({ isLoading: true });
      await DictionaryService.DamagePercent().then((response) => {
        if (response) {
          this.setState({ percetages: response });
        }
      });
    } finally {
      this.setState({ isLoading: false });
    }
  };

  defect = async () => {
    try {
      this.setState({ isLoading: true });
      const { good, onGoBack } = this.props.route.params;
      const { images, damagePercent } = this.state;
      await GoodService.defect(
        good.Id,
        good.BoxId || 0,
        damagePercent,
        images
      ).then(() => {
        this.setState({ isLoading: false });
        if (onGoBack) {
          onGoBack();
        }
        const { navigation } = this.props;
        navigation.goBack();
      });
    } finally {
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

  handleStateChange = (inputName: string, inputValue: unknown) => {
    this.setState((state) => ({
      ...state,
      [inputName]: inputValue,
    }));
  };

  render() {
    const { defect, onDelete, onAdd, handleStateChange } = this;
    const {
      isLoading,
      images,
      percetages,
      serialNumber,
      description,
      damagePercent,
    } = this.state;
    const { good } = this.props.route.params;

    return (
      <Loading isLoading={isLoading}>
        <View style={styles.container}>
          <ScrollView>
            <Text style={styles.title}>{good.GoodName}</Text>
            {/* <TextInputWithTitle
              title="Серийный номер"
              placeholder="отсканируйте или введите вручную"
              inputName="serialNumber"
              inputValue={serialNumber}
              onChange={handleStateChange}
            />
            <TextInputWithTitle
              title="Описание"
              placeholder="опишите повреждение"
              inputName="description"
              inputValue={description}
              multiline={true}
              numberOfLines={5}
              onChange={handleStateChange}
            /> */}
            <DropDownWithTitile
              data={percetages}
              title="Процент повреждения"
              placeholder="опишите повреждение"
              inputName="damagePercent"
              inputValue={damagePercent}
              onChange={handleStateChange}
            />
            <Text style={{ fontSize: 15, color: "black" }}>
              Фото повреждения
            </Text>
            <View style={styles.image}>
              <Picker add={onAdd} />
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
          {images.length > 0 && <CustomButton label={"Ok"} onClick={defect} />}
        </View>
      </Loading>
    );
  }
}
