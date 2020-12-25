/* eslint-disable @typescript-eslint/no-explicit-any */
import { Picker } from "@react-native-picker/picker";
import React, { FC } from "react";
import { View, Text, TextInput, StyleSheet } from "react-native";

import { Responses } from "../../services";

const styles = StyleSheet.create({
  container: {
    marginTop: 20,
  },
  title: {
    fontSize: 15,
    color: "black",
  },
});

type Props = {
  data: Responses.BaseDictionary[];
  title: string;
  inputName: string;
  inputValue: any;
  placeholder: string;
  onChange: (inputName: string, inputValue: unknown) => void;
};

const DropDownWithTitile: FC<Props> = (props) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{props.title}</Text>
      <Picker
        mode="dropdown"
        selectedValue={props.inputValue}
        //style={{ height: 50, width: 100 }}
        onValueChange={(itemValue) =>
          props.onChange(props.inputName, itemValue)
        }
      >
        {props.data.map((item) => (
          <Picker.Item label={item.Name} value={item.Id} />
        ))}
      </Picker>
    </View>
  );
};

export default DropDownWithTitile;