import React, { Component } from "react";
import { View, Alert, StyleSheet, Text } from "react-native";
import { StackScreenProps } from "@react-navigation/stack";
import { DataTable, List } from "react-native-paper";

import { Loading, CustomButton } from "../Shared";
import {
  LocalStorage,
  TaskModel,
  StorageKeys,
  OnRequestError,
  DifferenceModel,
} from "../../components";
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

let difference: DifferenceModel[] = [];

type DifferenceProps = StackScreenProps<RootStackParamList, "Difference">;
export default class Difference extends Component<DifferenceProps> {
  state = {
    isLoading: false,
    data: difference,
    taskId: 0,
    PlanNum: "",
  };

  async componentDidMount() {
    await LocalStorage.getItem<TaskModel>(StorageKeys.ACTIVE_TASK).then(
      (res) => {
        if (res) {
          this.setState({ taskId: res.Id, PlanNum: res.PlanNum });
        }
      }
    );
    //this._endTask();
  }

  async _endTask() {
    const { taskId } = this.state;
    try {
      this.setState({ isLoading: true });
      if (taskId) {
        await TaskManager.endTask(taskId).then((response) => {
          if (!response.success) {
            throw new Error(response.error);
          }
          if (response.data) {
            difference = response.data;
            this.setState({ data: difference });
          }
        });
      }
    } catch (ex) {
      Alert.alert(
        OnRequestError.END_TASK,
        JSON.stringify(ex.message),
        [{ text: "OK" }],
        { cancelable: false }
      );
    } finally {
      this.setState({ isLoading: false });
    }
  }

  _pdf() {
    const { navigation } = this.props;
    navigation.push("Pdf");
  }

  render() {
    const { isLoading, PlanNum } = this.state;
    return (
      <Loading isLoading={isLoading}>
        <View style={styles.container}>
          <Text style={styles.title}>Планирование: {PlanNum}</Text>
          <List.Item
            title={<Text style={styles.title}>Наименование</Text>}
            description={
              <Text style={styles.title}>
                Кол-во в 1С:1 {"\n"}
                Отсканированного:2
              </Text>
            }
            titleNumberOfLines={3}
            descriptionNumberOfLines={5}
          />
          <CustomButton label={"Акт приема"} onClick={this._pdf} />
        </View>
      </Loading>
    );
  }
}
