/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react/no-did-mount-set-state */
import React, { Component } from "react";
import {
  View,
  Text,
  StyleSheet,
  Modal,
  Alert,
  Dimensions,
  ListRenderItemInfo,
} from "react-native";
import { TextInput } from "react-native-paper";
import { StackScreenProps } from "@react-navigation/stack";
import { SwipeListView } from "react-native-swipe-list-view";
import { ButtonGroup } from "react-native-elements";
import HoneywellBarcodeReader from "react-native-honeywell-barcode-reader";

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

const { height, width } = Dimensions.get("window");
const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 10,
  },
  title: {
    margin: 8,
    fontSize: 18,
  },
  modalContainer: {
    height: (height * 2) / 3,
    width: width,
    padding: 50,
    alignSelf: "center",
    backgroundColor: "#EFEFF4",
    justifyContent: "center",
  },
  innerContainer: {
    alignItems: "center",
  },
  input: {
    margin: 10,
    width: 250,
    fontSize: 32,
    fontWeight: "bold",
    backgroundColor: "white",
    textAlign: "center",
  },
});

let goods: BaseModel[] = [];

type GoodProps = StackScreenProps<RootStackParamList, "Good">;
export default class Good extends Component<GoodProps> {
  state = {
    id: "",
    data: goods,
    currentRow: 0,
    currentCount: "",
    isShowModal: false,
    isLoading: false,
    page: ReceptionPage.DOCUMENT,
  };

  async componentDidMount() {
    this._onGetActiveTask();

    HoneywellBarcodeReader.startReader().then((claimed: any) => {
      console.warn(
        claimed ? "Barcode reader is claimed" : "Barcode reader is busy"
      );
    });
    HoneywellBarcodeReader.onBarcodeReadSuccess((event: any) => {
      console.warn("Received data", event);
      this._onScanned(event);
    });
    HoneywellBarcodeReader.onBarcodeReadFail(() => {
      console.warn("Barcode read failed");
    });
  }

  _handleStateChange = (inputName: string, inputValue: unknown) => {
    this.setState((state) => ({
      ...state,
      [inputName]: inputValue,
    }));
  };

  _onGetActiveTask = async () => {
    try {
      this.setState({ isLoading: true });
      const user = await LocalStorage.getItem<UserModel>(StorageKeys.USER);

      await TaskManager.getActiveTask(user?.UserId, user?.UserDivisionId).then(
        async (response) => {
          if (!response.success) {
            throw new Error(response.error);
          }

          if (!response.data?.PlanNum) {
            throw new Error();
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
      this.setState({ page: ReceptionPage.DOCUMENT });
      // Alert.alert(
      //   OnRequestError.CREATE_TASK,
      //   JSON.stringify(ex.message),
      //   [
      //     {
      //       text: "OK",
      //       onPress: () => this.setState({ page: ReceptionPage.DOCUMENT }),
      //     },
      //   ],
      //   { cancelable: false }
      // );
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

                if (!response2.data?.PlanNum) {
                  throw new Error();
                }

                if (response2.data) {
                  await LocalStorage.setItem(
                    StorageKeys.ACTIVE_TASK,
                    response2.data
                  );

                  this.setState({
                    page: ReceptionPage.GOOD,
                    id: response2.data?.PlanNum,
                  });
                }
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
              await TaskManager.getGoodByTask(task?.Id).then((response2) => {
                if (!response2.success) {
                  throw new Error(response2.error);
                }
                if (response2.data) {
                  goods = response2.data;
                  this.setState({ data: goods });
                }
              });
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

  _onShowModal = (index: number) => {
    const good = goods[index] as GoodModel;
    this.setState({
      isShowModal: true,
      currentRow: index,
      currentCount: good.Count.toString(),
    });
  };

  _onModalButtanClick = async (index: number) => {
    this.setState({ isShowModal: false });
    const { currentCount, currentRow } = this.state;

    if (index === 0) {
      const good = goods[currentRow] as GoodModel;
      try {
        this.setState({ isLoading: true });
        await TaskManager.editGood(good.ID, currentCount).then(
          async (response) => {
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
    }
  };

  _onItemClick = (model: GoodModel) => {
    const { navigation } = this.props;
    navigation.push("Box", {
      box: model,
    });
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

  _onEndTask = async () => {
    const { navigation } = this.props;
    navigation.navigate("Difference", {
      onGoBack: () => {
        this._onGetActiveTask();
      },
    });
  };

  _renderItem = (model: GoodModel) => {
    return goods.length > 0 ? (
      <GoodItem data={model} onPress={this._onItemClick} />
    ) : null;
  };

  _renderHiddenItem = (model: ListRenderItemInfo<GoodModel>) => {
    return (
      <GoodHiddenItem
        index={model.index}
        data={model.item}
        edit={this._onShowModal}
        remove={this._onItemRemove}
      />
    );
  };

  _onRowOpen = (rowId: string, rowMap: any) => {
    const item = goods.find((value) => {
      return (value as GoodModel).StrID === rowId;
    }) as GoodModel;

    // if (item.IsBox) {
    //   rowMap[`${rowId}`].closeRow();
    // }
    //.map((value: GoodModel) => value.IsBox);
  };

  render() {
    const { page, id, data, isLoading, isShowModal } = this.state;
    const buttons = ["Изменить", "Закрыть"];

    return (
      <Loading isLoading={isLoading}>
        <Modal
          visible={isShowModal}
          animationType={"fade"}
          onRequestClose={() => this.setState({ isShowModal: false })}
        >
          <View style={styles.modalContainer}>
            <View style={styles.innerContainer}>
              <TextInput
                label="Количество"
                mode="flat"
                style={styles.input}
                keyboardType="phone-pad"
                autoFocus={true}
                onChangeText={(value) =>
                  this._handleStateChange("currentCount", value)
                }
              />
              <ButtonGroup
                onPress={this._onModalButtanClick}
                buttons={buttons}
                containerStyle={{ height: 50 }}
              />
            </View>
          </View>
        </Modal>

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
              renderHiddenItem={(model) => this._renderHiddenItem(model)}
            />
          )}

          {page === ReceptionPage.GOOD && data && (
            <CustomButton label={"Расхождение"} onClick={this._onEndTask} />
          )}
        </View>
      </Loading>
    );
  }
}
