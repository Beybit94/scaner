import React, { Component } from "react";
import { Text, StyleSheet, TouchableOpacity, View } from "react-native";

import { GoodModel } from "../../components";

const styles = StyleSheet.create({
  rowBack: {
    alignItems: "center",
    backgroundColor: "#DDD",
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    paddingLeft: 15,
  },
  backTextWhite: {
    color: "#FFF",
  },
  backRightBtn: {
    alignItems: "center",
    bottom: 0,
    justifyContent: "center",
    position: "absolute",
    top: 0,
    width: 75,
  },
  backRightBtnLeft: {
    backgroundColor: "blue",
    right: 75,
  },
  backRightBtnRight: {
    backgroundColor: "red",
    right: 0,
  },
});

type GoodHiddenItemProps = {
  edit: (row: number) => void;
  remove: (model: GoodModel) => void;
  data: GoodModel;
  index: number;
};

export default class GoodHiddenItem extends Component<GoodHiddenItemProps> {
  render() {
    const { edit, remove, data, index } = this.props;

    if (!data.IsBox) {
      return (
        <View style={styles.rowBack}>
          <TouchableOpacity
            style={[styles.backRightBtn, styles.backRightBtnLeft]}
            onPress={(_) => edit(index)}
          >
            <Text style={styles.backTextWhite}>Изменить</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.backRightBtn, styles.backRightBtnRight]}
            onPress={() => remove(data)}
          >
            <Text style={styles.backTextWhite}>Удалить</Text>
          </TouchableOpacity>
        </View>
      );
    } else {
      return null;
    }
  }
}
