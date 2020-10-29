/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { Component } from "react";
import { View, StyleSheet, Dimensions } from "react-native";
import { NavigationContext } from "@react-navigation/native";
import { TextInput } from "react-native-paper";
import { ButtonGroup } from "react-native-elements";

import { CustomButton } from "../Atoms";
import { ScanBarcode, CustomModal } from "../Molecules";
import { GoodList } from "../Organisms";
import { Responses } from "../../services";

const { height, width } = Dimensions.get("window");
const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 10,
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

type Props = {
  title: string;
  data: Responses.GoodModel[];
  visible: boolean;
  defect: (model: Responses.GoodModel) => void;
  itemEdit: (visible: boolean, row: number) => void;
  itemRemove: (model: Responses.GoodModel) => void;
  scan: (id: string) => void;
  handleStateChange: (code: string, value: any) => void;
};

export default class GoodTemplate extends Component<Props> {
  static contextType = NavigationContext;

  showScan = () => {
    const { scan } = this.props;
    const navigation = this.context;
    navigation.push("Scan", {
      onGoBack: scan,
    });
  };

  difference = async () => {
    const navigation = this.context;
    navigation.navigate("Difference");
  };

  render() {
    const { showScan, difference } = this;
    const {
      title,
      data,
      visible,
      defect,
      itemEdit,
      itemRemove,
      handleStateChange,
    } = this.props;

    const buttons = ["Закрыть", "Изменить"];

    return (
      <View style={styles.container}>
        <ScanBarcode title={title} showScan={showScan} />
        <GoodList
          data={data}
          defect={defect}
          itemEdit={(row: number) => itemEdit(true, row)}
          itemRemove={itemRemove}
        />
        <CustomButton label={"Расхождение"} onClick={difference} />
        <CustomModal visible={visible} toggleModal={() => itemEdit(false, 0)}>
          <View style={styles.modalContainer}>
            <View style={styles.innerContainer}>
              <TextInput
                label="Количество"
                mode="flat"
                style={styles.input}
                keyboardType="phone-pad"
                autoFocus={true}
                onChangeText={(value) =>
                  handleStateChange("currentCount", value)
                }
              />
              <ButtonGroup
                onPress={(selectedIndex: number) =>
                  itemEdit(false, selectedIndex)
                }
                buttons={buttons}
                containerStyle={{ height: 50 }}
              />
            </View>
          </View>
        </CustomModal>
      </View>
    );
  }
}
