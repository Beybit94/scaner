/* eslint-disable react/no-did-mount-set-state */
import React, { Component } from "react";
import { View, Alert } from "react-native";
import { StackScreenProps } from "@react-navigation/stack";

import { BarCode, CustomButton, Loading } from "../Shared";
import { UserModel, StorageKeys, LocalStorage } from "../../components";
import { TaskManager } from "../../Managers";

import { RootStackParamList } from "./Reception";

type ScanGoodButtonProps = StackScreenProps<
  RootStackParamList,
  "ScanGoodButton"
>;
class ScanGoodButton extends Component<ScanGoodButtonProps> {
  async componentDidMount() {
    const { route } = this.props;
    const { id } = route.params;

    try {
      const user = await LocalStorage.getItem<UserModel>(StorageKeys.USER);
      this.setState({ PlanNum: id, UserId: user?.UserId });

      //   await TaskManager.createTask({ PlanNum: this.state.PlanNum }).then(
      //     async (model) => {
      //       this.setState({ isLoading: true });
      //       if (!model.success) {
      //         throw new Error(model.message);
      //       }
      //     }
      //   );
    } catch (ex) {
      this.setState({ isLoading: false });
      Alert.alert(
        "Error signing in",
        JSON.stringify(ex.message),
        [
          {
            text: "OK",
          },
        ],
        { cancelable: false }
      );
    }
  }

  state = {
    PlanNum: "",
    UserId: 0,
    isLoading: false,
  };

  _onClick = () => {
    const { navigation } = this.props;
    navigation.push("ScanGood");
  };

  render() {
    return (
      <Loading isLoading={this.state.isLoading}>
        <View>
          <CustomButton label="Сканировать товар" onClick={this._onClick} />
        </View>
      </Loading>
    );
  }
}

type ScanGoodProps = StackScreenProps<RootStackParamList, "ScanGood">;
class ScanGood extends Component<ScanGoodProps> {
  state = {
    isScanned: false,
  };

  componentDidMount() {
    const { navigation } = this.props;
    navigation.addListener("focus", () => {
      this.setState({ isScanned: false });
    });
  }

  _barCodeSacanned = (data: string) => {
    console.warn(data);
    const { navigation } = this.props;
    this.setState({ isScanned: !this.state.isScanned });
    navigation.goBack();
  };

  render() {
    return (
      <BarCode
        onBarCodeScanned={
          this.state.isScanned ? undefined : this._barCodeSacanned
        }
      />
    );
  }
}

export { ScanGoodButton, ScanGood };
