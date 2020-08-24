/* eslint-disable @typescript-eslint/no-explicit-any */
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

type GoodProps = StackScreenProps<RootStackParamList, "Good">;
export default class Good extends Component<GoodProps> {
  state = {
    id: "",
    data: [],
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

          await LocalStorage.setItem(
            StorageKeys.ACTIVE_TASK,
            response.data?.Id
          );

          this.setState({
            id: response.data?.Id,
            page: ReceptionPage.GOOD,
          });

          await TaskManager.getGoodByTask(response.data?.Id || 0).then(
            (response2) => {
              if (!response2.success) {
                throw new Error(response2.error);
              }

              this.setState({ data: response2.data });
            }
          );
        }
      );
    } catch (ex) {
      this.setState({ page: ReceptionPage.DOCUMENT });
    } finally {
      this.setState({ isLoading: false });
    }
  };

  _onScanned = async (id: string) => {
    try {
      this.setState({ isLoading: true });
      const user = await LocalStorage.getItem<UserModel>(StorageKeys.USER);

      await TaskManager.createTask(id, user?.UserId).then(async (response) => {
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
            response2.data?.Id
          );

          this.setState({
            page: ReceptionPage.GOOD,
            id: response2.data?.Id,
          });
        });
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
      <Loading isLoading={this.state.isLoading}>
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
      </Loading>
    );
  }
}
