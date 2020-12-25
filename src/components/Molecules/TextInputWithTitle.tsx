import React, { FC } from "react";
import { View, Text, TextInput, StyleSheet } from "react-native";

const styles = StyleSheet.create({
  container: {
    marginTop: 20,
  },
  input: {
    padding: 10,
    borderRadius: 3,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: "grey",
  },
  title: {
    fontSize: 15,
    color: "black",
  },
});

type Props = {
  title: string;
  inputName: string;
  inputValue: string;
  placeholder: string;
  multiline?: boolean;
  numberOfLines?: number;
  onChange: (inputName: string, inputValue: unknown) => void;
};

const TextInputWithTitle: FC<Props> = (props) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{props.title}</Text>
      <TextInput
        placeholder={props.placeholder}
        value={props.inputValue}
        onChangeText={(value) => props.onChange(props.inputName, value)}
        style={styles.input}
        multiline={props.multiline}
        numberOfLines={props.multiline ? props.numberOfLines : 1}
      />
    </View>
  );
};

export default TextInputWithTitle;
