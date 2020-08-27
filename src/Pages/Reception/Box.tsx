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
import { CustomButton, GoodItem, GoodHiddenItem, Loading } from "../Shared";
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

let goods: BaseModel[] = [];

type BoxButtonProps = StackScreenProps<RootStackParamList, "Box">;
export default class Box extends Component<BoxButtonProps> {
  state = {
    isLoading: false,
    data: goods,
  };

  async componentDidMount() {
    this._onGetActiveTask();
  }

  _onGetActiveTask = async () => {
    try {
      this.setState({ isLoading: true });
      const { model } = this.props.route.params;
      const task = await LocalStorage.getItem<TaskModel>(
        StorageKeys.ACTIVE_TASK
      );

      if (task) {
        await TaskManager.getGoodByBox(model.ID, task?.Id).then((response) => {
          if (!response.success) {
            throw new Error(response.error);
          }
          if (response.data) {
            goods = response.data;
            this.setState({ data: goods });
          }
        });
      }
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

  _onScanned = async (id: string) => {
    try {
      this.setState({ isLoading: true });
      const { model } = this.props.route.params;
      const task = await LocalStorage.getItem<TaskModel>(
        StorageKeys.ACTIVE_TASK
      );

      if (task) {
        await TaskManager.addGood(id, task?.PlanNum, task?.Id, model.ID).then(
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
      }
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
    navigation.push("Scan", {
      onGoBack: this._onScanned,
    });
  };

  _onItemEdit = (model: GoodModel) => {
    console.warn(model);
  };

  _onItemRemove = async (model: GoodModel) => {
    try {
      this.setState({ isLoading: true });
      await TaskManager.removeGood(model.ID).then(async (response) => {
        if (!response.success) {
          throw new Error(response.error);
        }
        const task = await LocalStorage.getItem<TaskModel>(
          StorageKeys.ACTIVE_TASK
        );
        if (task) {
          await TaskManager.getGoodByTask(task.Id).then((response2) => {
            if (!response2.success) {
              throw new Error(response2.error);
            }
            if (response2.data) {
              goods = response2.data;
              this.setState({ data: goods });
            }
          });
        }
      });
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
    const item = goods.find((value) => {
      return (value as GoodModel).StrID === rowId;
    }) as GoodModel;

    if (item.IsBox) {
      rowMap[`${rowId}`].closeRow();
    }
  };

  render() {
    const { model } = this.props.route.params;
    const { data, isLoading } = this.state;

    return (
      <Loading isLoading={isLoading}>
        <View style={styles.container}>
          <Text style={styles.title}>{model.GoodName}</Text>

          <CustomButton
            label="Сканировать товар"
            onClick={this._onButtonClick}
          />

          {data && (
            <SwipeListView
              data={data}
              keyExtractor={(item) => (item as GoodModel).StrID}
              useFlatList={true}
              disableRightSwipe={true}
              rightOpenValue={-150}
              onRowOpen={(rowId, rowMap) => this._onRowOpen(rowId, rowMap)}
              renderItem={(row) => this._renderItem(row.item as GoodModel)}
              renderHiddenItem={(row) =>
                this._renderHiddenItem(row.item as GoodModel)
              }
            />
          )}
        </View>
      </Loading>
    );
  }
}
