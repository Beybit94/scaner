/* eslint-disable react/no-did-mount-set-state */
import React, { Component } from "react";
import { View, Text, StyleSheet, FlatList } from "react-native";
import { StackScreenProps } from "@react-navigation/stack";

import { GoodModel } from "../../components";
import { CustomButton, GoodItem } from "../Shared";

import { RootStackParamList, ReceptionPage } from "./Reception";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 10,
  },
  title: {
    margin: 8,
    fontSize: 18,
  },
});

const data = [
  {
    GoodId: 1,
    Count: 1,
    GoodName: "test",
    GoodArticle: "test",
    GoodBarCode: "",
    IsBox: true,
  },
  {
    GoodId: 2,
    Count: 2,
    GoodName: "test2",
    GoodArticle: "test2",
    GoodBarCode: "",
    IsBox: false,
  },
];

type GoodProps = StackScreenProps<RootStackParamList, "Good">;
export default class Good extends Component<GoodProps> {
  state = {
    page: ReceptionPage.DOCUMENT,
    id: "",
    data: [],
  };

  componentDidMount() {
    this.setState({ data: data });
  }

  _onButtonClick = () => {
    const { navigation } = this.props;
    navigation.push("Scan", {
      page: this.state.page,
      onGoBack: (id: string) => {
        this.setState({
          page: ReceptionPage.GOOD,
          id: id,
        });
      },
    });
  };

  _onItemClick = (model: GoodModel) => {
    const { navigation } = this.props;
    navigation.push("Box", {
      model: model,
    });
  };

  render() {
    return (
      <View style={styles.container}>
        {this.state.page === ReceptionPage.GOOD && (
          <Text style={styles.title}>Планирование: {this.state.id}</Text>
        )}

        <CustomButton
          label={
            this.state.page === ReceptionPage.DOCUMENT
              ? "Сканировать документ"
              : "Сканировать товар"
          }
          onClick={this._onButtonClick}
        />

        <FlatList
          data={this.state.data}
          renderItem={({ item }) => (
            <GoodItem data={item} onPress={this._onItemClick} />
          )}
          keyExtractor={(item) => (item as GoodModel).GoodId.toString()}
        />
      </View>
    );
  }
}
