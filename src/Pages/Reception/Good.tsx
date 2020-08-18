/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react/no-did-mount-set-state */
import React, { Component } from "react";
import { View, Text, StyleSheet } from "react-native";
import { StackScreenProps } from "@react-navigation/stack";
import { SwipeListView } from "react-native-swipe-list-view";

import { GoodModel } from "../../components";
import { CustomButton, GoodItem, GoodHiddenItem } from "../Shared";

import { RootStackParamList } from "./Reception";

export enum ReceptionPage {
  DOCUMENT = 1,
  GOOD = 2,
  BOX = 3,
}

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

  _onItemEdit = (model: GoodModel) => {
    console.warn(model);
  };

  _onItemRemove = (model: GoodModel) => {
    console.warn(model);
  };

  _renderItem = (model: GoodModel) => {
    return <GoodItem data={model} onPress={this._onItemClick} />;
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

        {this.state.page === ReceptionPage.GOOD && (
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
        )}
      </View>
    );
  }
}
