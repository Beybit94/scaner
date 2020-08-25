/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react/no-did-mount-set-state */
import React, { Component } from "react";
import { View, Text, StyleSheet, Alert } from "react-native";
import { StackScreenProps } from "@react-navigation/stack";
import { SwipeListView } from "react-native-swipe-list-view";

import {
  GoodModel,
  LocalStorage,
  StorageKeys,
  OnRequestError,
  BaseModel,
  TaskModel,
} from "../../components";
import { CustomButton, GoodItem, GoodHiddenItem } from "../Shared";
import { TaskManager } from "../../Managers";

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

const goods: BaseModel[] = [];

type BoxButtonProps = StackScreenProps<RootStackParamList, "Box">;
export default class Box extends Component<BoxButtonProps> {
  state = {
    data: goods,
  };

  _onScanned = async (id: string) => {
    try {
      this.setState({ isLoading: true });
      const task = await LocalStorage.getItem<TaskModel>(
        StorageKeys.ACTIVE_TASK
      );
      await TaskManager.addGood(id, task?.PlanNum, task?.Id).then(
        async (response) => {
          if (!response.success) {
            throw new Error(response.error);
          }
          if (response.data) {
            goods.push(response.data);
            this.setState({ data: goods });
          }
        }
      );
    } catch (ex) {
      Alert.alert(
        OnRequestError.CREATE_TASK,
        JSON.stringify(ex.message),
        [{ text: "OK" }],
        { cancelable: false }
      );
    } finally {
      this.setState({ isLoading: false });
    }
  };

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
          {this.props.route.params?.model.GoodName}
        </Text>

        <CustomButton label="Сканировать товар" onClick={this._onButtonClick} />

        <SwipeListView
          data={this.state.data}
          keyExtractor={(item) => (item as GoodModel).StrID}
          useFlatList={true}
          disableRightSwipe={true}
          rightOpenValue={-150}
          onRowOpen={(rowId, rowMap) => this._onRowOpen(rowId, rowMap)}
          renderItem={(model) => this._renderItem(model.item as GoodModel)}
          renderHiddenItem={(model) =>
            this._renderHiddenItem(model.item as GoodModel)
          }
        />
      </View>
    );
  }
}
