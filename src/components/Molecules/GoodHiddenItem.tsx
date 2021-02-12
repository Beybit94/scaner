import React, { Component } from "react";
import { Text, StyleSheet, TouchableOpacity, View } from "react-native";

import { Responses } from "../../services";

const styles = StyleSheet.create({
  rowBack: {
    alignItems: "center",
    backgroundColor: "#DDD",
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    paddingLeft: 15,
    textAlign: "center",
  },
  backTextWhite: {
    color: "white",
    textAlign: "center",
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
  backLeftBtnLeft: {
    backgroundColor: "grey",
    left: 0,
  },
});

type Props = {
  edit: (row: number) => void;
  remove: (model: Responses.GoodModel) => void;
  defect: (model: Responses.GoodModel) => void;
  model: Responses.GoodModel;
  index: number;
};

export default class GoodHiddenItem extends Component<Props> {
  render() {
    const { edit, remove, defect, model, index } = this.props;

    return (
      <View style={styles.rowBack}>
        <TouchableOpacity
          style={[styles.backRightBtn, styles.backLeftBtnLeft]}
          onPress={() => defect(model)}
        >
          <Text style={styles.backTextWhite}>
            {model.DefectId ? "Снять дефект" : "Дефект"}
          </Text>
        </TouchableOpacity>

        {!model.IsBox && (
          <TouchableOpacity
            style={[styles.backRightBtn, styles.backRightBtnLeft]}
            onPress={(_) => edit(index)}
          >
            <Text style={styles.backTextWhite}>Изменить</Text>
          </TouchableOpacity>
        )}

        <TouchableOpacity
          style={[styles.backRightBtn, styles.backRightBtnRight]}
          onPress={() => remove(model)}
        >
          <Text style={styles.backTextWhite}>Удалить</Text>
        </TouchableOpacity>
      </View>
    );
  }
}
