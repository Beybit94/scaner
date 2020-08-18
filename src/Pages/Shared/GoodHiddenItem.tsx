import React from "react";
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
  edit: (model: GoodModel) => void;
  remove: (model: GoodModel) => void;
  data: GoodModel;
};

const GoodHiddenItem = ({ edit, remove, data }: GoodHiddenItemProps) => {
  if (!data.IsBox) {
    return (
      <View style={styles.rowBack}>
        <TouchableOpacity
          style={[styles.backRightBtn, styles.backRightBtnLeft]}
          onPress={() => edit(data)}
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
};
export default GoodHiddenItem;
