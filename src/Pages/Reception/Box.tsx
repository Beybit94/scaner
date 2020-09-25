/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react/no-did-mount-set-state */
import React, { Component } from "react";
import {
  View,
  Text,
  StyleSheet,
  Alert,
  ListRenderItemInfo,
  Modal,
  Dimensions,
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
  OnRequestError,
  BaseModel,
  TaskModel,
} from "../../components";
import { CustomButton, GoodItem, GoodHiddenItem, Loading } from "../Shared";
import { TaskManager } from "../../Managers";

import { RootStackParamList } from "./Reception";

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

type BoxButtonProps = StackScreenProps<RootStackParamList, "Box">;
export default class Box extends Component<BoxButtonProps> {
  state = {
    isLoading: false,
    data: goods,
    currentRow: 0,
    currentCount: "",
    isShowModal: false,
    isScanning: false,
  };

  async componentDidMount() {
    this._onGetActiveTask();

    HoneywellBarcodeReader.startReader().then((claimed: any) => {
      // console.warn(
      //   claimed ? "Barcode reader is claimed" : "Barcode reader is busy"
      // );
    });
    HoneywellBarcodeReader.onBarcodeReadSuccess((event: any) => {
      const { isScanning } = this.state;
      if (!isScanning) {
        this._onScanned(event);
      }
      //console.warn("Received data", event);
    });
    HoneywellBarcodeReader.onBarcodeReadFail(() => {
      //console.warn("Barcode read failed");
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
      const { box } = this.props.route.params;
      const task = await LocalStorage.getItem<TaskModel>(
        StorageKeys.ACTIVE_TASK
      );

      if (task) {
        await TaskManager.getGoodByBox(box.ID, task?.Id).then((response) => {
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
      this.setState({ isLoading: true, isScanning: true });
      const { box } = this.props.route.params;
      const task = await LocalStorage.getItem<TaskModel>(
        StorageKeys.ACTIVE_TASK
      );

      if (task) {
        await TaskManager.addGood(id, task?.PlanNum, task?.Id, box.ID).then(
          async (response) => {
            if (!response.success) {
              throw new Error(response.error);
            }
            await TaskManager.getGoodByBox(box.ID, task?.Id).then(
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
      this.setState({ isLoading: false, isScanning: false });
    }
  };

  _onButtonClick = () => {
    const { navigation } = this.props;
    navigation.push("Scan", {
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
    const { box } = this.props.route.params;
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
              await TaskManager.getGoodByBox(box.ID, task?.Id).then(
                (response2) => {
                  if (!response2.success) {
                    throw new Error(response.error);
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
          [{ text: "OK" }],
          { cancelable: false }
        );
      } finally {
        this.setState({ isLoading: false });
      }
    }
  };

  _onItemRemove = async (model: GoodModel) => {
    const { box } = this.props.route.params;
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
          await TaskManager.getGoodByBox(box.ID, task?.Id).then((response2) => {
            if (!response2.success) {
              throw new Error(response.error);
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
    return goods.length > 0 ? <GoodItem data={model} /> : null;
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

    if (item.IsBox) {
      rowMap[`${rowId}`].closeRow();
    }
  };

  render() {
    const { box } = this.props.route.params;
    const { data, isLoading, isShowModal } = this.state;
    const buttons = ["Изменить", "Закрыть"];

    return (
      <Loading isLoading={isLoading}>
        <Modal
          visible={isShowModal}
          transparent={true}
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
          <Text style={styles.title}>{box.GoodName}</Text>

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
              renderHiddenItem={(row) => this._renderHiddenItem(row)}
            />
          )}
        </View>
      </Loading>
    );
  }
}
