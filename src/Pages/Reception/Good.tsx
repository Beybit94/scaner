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
  UserModel,
  OnRequestError,
  BaseModel,
  TaskModel,
} from "../../components";
import { CustomButton, GoodItem, GoodHiddenItem, Loading } from "../Shared";
import { TaskManager } from "../../Managers";

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

let goods: BaseModel[] = [];

type GoodProps = StackScreenProps<RootStackParamList, "Good">;
export default class Good extends Component<GoodProps> {
  state = {
    id: "",
    data: goods,
    isLoading: false,
    page: ReceptionPage.DOCUMENT,
  };

  async componentDidMount() {
    this._onGetActiveTask();
  }

  _onGetActiveTask = async () => {
    try {
      this.setState({ isLoading: true });
      const user = await LocalStorage.getItem<UserModel>(StorageKeys.USER);

      await TaskManager.getActiveTask(user?.UserId, user?.UserDivisionId).then(
        async (response) => {
          if (!response.success) {
            throw new Error(response.error);
          }
          if (response.data) {
            await LocalStorage.setItem(StorageKeys.ACTIVE_TASK, response.data);
            this.setState({
              id: response.data.PlanNum,
              page: ReceptionPage.GOOD,
            });
            await TaskManager.getGoodByTask(response.data.Id).then(
              (response2) => {
                if (!response2.success) {
                  throw new Error(response2.error);
                }
                if (response2.data) {
                  goods = response2.data;
                  this.setState({ data: goods });
                }
              }
            );
          }
        }
      );
    } catch (ex) {
      Alert.alert(
        OnRequestError.CREATE_TASK,
        JSON.stringify(ex.message),
        [
          {
            text: "OK",
            onPress: () => this.setState({ page: ReceptionPage.DOCUMENT }),
          },
        ],
        { cancelable: false }
      );
    } finally {
      this.setState({ isLoading: false });
    }
  };

  _onScanned = async (id: string) => {
    try {
      this.setState({ isLoading: true });
      const user = await LocalStorage.getItem<UserModel>(StorageKeys.USER);

      switch (this.state.page) {
        case ReceptionPage.DOCUMENT:
          await TaskManager.createTask(id, user?.UserId).then(
            async (response) => {
              if (!response.success) {
                throw new Error(response.error);
              }
              await TaskManager.getActiveTask(
                user?.UserId,
                user?.UserDivisionId
              ).then(async (response2) => {
                if (!response2.success) {
                  throw new Error(response2.error);
                }

                await LocalStorage.setItem(
                  StorageKeys.ACTIVE_TASK,
                  response2.data
                );

                this.setState({
                  page: ReceptionPage.GOOD,
                  id: response2.data?.PlanNum,
                });
              });
            }
          );

          break;
        case ReceptionPage.GOOD:
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
          break;
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
      page: this.state.page,
      onGoBack: this._onScanned,
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
    return goods.length > 0 ? (
      <GoodItem data={model} onPress={this._onItemClick} />
    ) : null;
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
    const { page, id, data, isLoading } = this.state;
    return (
      <Loading isLoading={isLoading}>
        <View style={styles.container}>
          {page === ReceptionPage.GOOD && (
            <Text style={styles.title}>Планирование: {id}</Text>
          )}

          <CustomButton
            label={
              page === ReceptionPage.DOCUMENT
                ? "Сканировать документ"
                : "Сканировать товар"
            }
            onClick={this._onButtonClick}
          />

          {page === ReceptionPage.GOOD && data && (
            <SwipeListView
              data={data}
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
          )}
        </View>
      </Loading>
    );
  }
}
