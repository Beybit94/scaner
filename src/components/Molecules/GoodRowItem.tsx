/* eslint-disable react/no-did-mount-set-state */
import React, { Component } from "react";
import { View, Text, StyleSheet } from "react-native";
import { Badge, Icon, ListItem } from "react-native-elements";

import { Constants, Responses, TaskService } from "../../services";

const styles = StyleSheet.create({
  subtitleView: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingTop: 5,
  },
  titile: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
  },
  goodName: {
    flex: 3,
    flexDirection: "column",
    justifyContent: "flex-start",
    alignSelf: "center",
  },
  goodCount: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "flex-end",
  },
  subtitle: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  goodArticle: {
    flex: 3,
    flexDirection: "row",
    justifyContent: "flex-start",
  },
});

type Props = {
  index: number;
  model: Responses.GoodModel;
  onPress?: (model: Responses.GoodModel) => void;
};

export default class GoodRowItem extends Component<Props> {
  state = {
    isClickable: false,
  };

  async componentDidMount() {
    const { model } = this.props;
    const task = await TaskService.getActiveTask();
    if (model.IsBox) {
      if (task && task.StatusId === Constants.TaskStatus.InProcess) {
        this.setState({ isClickable: true });
      } else {
        this.setState({ isClickable: model.DefectId ? true : false });
      }
    }
  }

  renderGood(index: string, model: Responses.GoodModel) {
    return (
      <View style={{ flex: 1 }}>
        <View style={styles.titile}>
          <View style={styles.goodName}>
            <Text>{index}</Text>
            <Text style={{ fontSize: 15, fontWeight: "bold" }}>
              {model.GoodName}
            </Text>
          </View>
          <View style={styles.goodCount}>
            <Text style={{ fontSize: 30, fontWeight: "bold" }}>
              {model.CountQty}
            </Text>
          </View>
        </View>
        <View style={styles.subtitle}>
          <View style={styles.goodArticle}>
            {model.DefectId && (
              <Badge
                value="дефект"
                status="warning"
                containerStyle={{ padding: 2 }}
              />
            )}
            <Text>{model.GoodArticle}</Text>
            {model.BarCode !== "" && model.BarCode !== "0" && (
              <Text> | {model.BarCode}</Text>
            )}
          </View>
        </View>
      </View>
    );
  }

  renderBox(index: string, model: Responses.GoodModel) {
    return (
      <ListItem.Content>
        <View>
          <Text>{index}</Text>
          <Text>{model.GoodName}</Text>
        </View>
        <View style={styles.subtitleView}>
          {model.DefectId && (
            <Badge
              value="дефект"
              status="warning"
              containerStyle={{ padding: 2 }}
            />
          )}
        </View>
      </ListItem.Content>
    );
  }

  render() {
    const { index, model, onPress } = this.props;
    const { renderBox, renderGood } = this;
    const { isClickable } = this.state;

    const indexStr = `${index + 1}`;
    if (!model) {
      return <View />;
    }

    return (
      <ListItem
        key={model.StrID}
        bottomDivider
        onPress={() => onPress && onPress(model)}
        disabled={!isClickable}
      >
        {model.IsBox && <Icon name="archive" type="font-awesome" />}
        {model.IsBox ? renderBox(indexStr, model) : renderGood(indexStr, model)}
        {isClickable && <ListItem.Chevron />}
      </ListItem>
    );
  }
}
