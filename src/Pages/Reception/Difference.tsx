/* eslint-disable react/no-did-mount-set-state */
import React, { Component } from "react";
import { View, Alert, StyleSheet, Text, FlatList } from "react-native";
import { StackScreenProps } from "@react-navigation/stack";
import { ListItem } from "react-native-elements";

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
  itemTitle: {
    fontSize: 18,
    fontWeight: "bold",
  },
  subtitle: {
    display: "flex",
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
    const task = await LocalStorage.getItem<TaskModel>(StorageKeys.ACTIVE_TASK);
    if (task) {
      this.setState({ taskId: task.Id, PlanNum: task.PlanNum });
      this._endTask();
    }
  }

  async _endTask() {
    const { taskId, PlanNum } = this.state;

    try {
      this.setState({ isLoading: true });
      if (taskId) {
        await TaskManager.difference(taskId, PlanNum).then(async (response) => {
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

  render() {
    const { navigation } = this.props;
    const { isLoading, taskId, PlanNum, data } = this.state;
    return (
      <Loading isLoading={isLoading}>
        <View style={styles.container}>
          <Text style={styles.title}>Планирование: {PlanNum}</Text>
          <FlatList
            data={data}
            renderItem={({ item }) => (
              <ListItem
                key={item.StrID}
                title={<Text style={styles.itemTitle}>{item.GoodName}</Text>}
                subtitle={
                  <View style={styles.subtitle}>
                    <Text>Кол-во в 1С: {item.Quantity}</Text>
                    <Text>Отсканированного: {item.CountQty}</Text>
                  </View>
                }
                bottomDivider
                children
              />
            )}
            keyExtractor={(item) => item.StrID}
          />
          <CustomButton
            label={"Акт приема"}
            onClick={() =>
              navigation.push("Pdf", { taskId: taskId, PlanNum: PlanNum })
            }
          />
          <CustomButton
            label={"Прикрепить фото"}
            onClick={() =>
              navigation.push("Pdf", { taskId: taskId, PlanNum: PlanNum })
            }
          />
        </View>
      </Loading>
    );
  }
}
