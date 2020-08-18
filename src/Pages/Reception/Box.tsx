/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react/no-did-mount-set-state */
import React, { Component } from "react";
import { View, Text, StyleSheet } from "react-native";
import { StackScreenProps } from "@react-navigation/stack";
import { SwipeListView } from "react-native-swipe-list-view";

import { GoodModel } from "../../components";
import { CustomButton, GoodItem, GoodHiddenItem } from "../Shared";

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
  },
  {
    GoodId: 2,
    Count: 2,
    GoodName: "test2",
    GoodArticle: "test2",
    GoodBarCode: "",
  },
];

type BoxButtonProps = StackScreenProps<RootStackParamList, "Box">;
export default class Box extends Component<BoxButtonProps> {
  state = {
    data: [],
  };

  componentDidMount() {
    this.setState({
      data: data,
    });
  }

  _onButtonClick = () => {
    const { navigation } = this.props;
    navigation.push("Scan");
  };

  _onItemEdit = (model: GoodModel) => {
    console.warn(model);
  };

  _onItemRemove = (model: GoodModel) => {
    console.warn(model);
  };

  _renderItem = (model: GoodModel) => {
    return <GoodItem data={model} />;
  };

  _renderHiddenItem = (model: GoodModel) => {
    return (
      <GoodHiddenItem
        data={model}
        edit={this._onItemEdit}
        remove={this._onItemRemove}
      />
    );
  };

  _onRowOpen = (rowId: string, rowMap: any) => {
    const item = (this.state.data.find(
      (value: GoodModel) => value.GoodId.toString() === rowId
    ) as unknown) as GoodModel;

    if (item.IsBox) {
      rowMap[`${rowId}`].closeRow();
    }
    //.map((value: GoodModel) => value.IsBox);
  };

  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>
          Короб: {(this.props.route.params?.model as GoodModel).GoodId}
        </Text>

        <CustomButton label="Сканировать товар" onClick={this._onButtonClick} />

        <SwipeListView
          data={this.state.data}
          keyExtractor={(item) => (item as GoodModel).GoodId.toString()}
          useFlatList={true}
          disableRightSwipe={true}
          rightOpenValue={-150}
          onRowOpen={(rowId, rowMap) => this._onRowOpen(rowId, rowMap)}
          renderItem={(model) => this._renderItem(model.item)}
          renderHiddenItem={(model) => this._renderHiddenItem(model.item)}
        />
      </View>
    );
  }
}
