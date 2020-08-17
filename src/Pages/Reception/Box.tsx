/* eslint-disable react/no-did-mount-set-state */
import React, { Component } from "react";
import { View, Text, StyleSheet, FlatList } from "react-native";
import { StackScreenProps } from "@react-navigation/stack";

import { GoodModel } from "../../components";
import { CustomButton, GoodItem } from "../Shared";

import { RootStackParamList } from "./Reception";

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

type BoxButtonProps = StackScreenProps<RootStackParamList, "Box">;
export default class Box extends Component<BoxButtonProps> {
  state = {
    data: [],
  };

  componentDidMount() {
    this.setState({ data: data });
  }

  _onButtonClick = () => {
    const { navigation } = this.props;
    navigation.push("Scan");
  };

  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>
          Короб: {(this.props.route.params?.model as GoodModel).GoodId}
        </Text>

        <CustomButton label="Сканировать товар" onClick={this._onButtonClick} />

        <FlatList
          data={this.state.data}
          renderItem={({ item }) => <GoodItem data={item} />}
          keyExtractor={(item) => (item as GoodModel).GoodId.toString()}
        />
      </View>
    );
  }
}
