import React, { FC } from "react";
import { StyleSheet } from "react-native";
import { Button } from "react-native-paper";

const styles = StyleSheet.create({
  button: {
    margin: 8,
    backgroundColor: "green",
  },
});

type Props = {
  label: string;
  onClick: () => void;
};

const CustomButton: FC<Props> = (props) => {
  return (
    <Button mode="contained" onPress={props.onClick} style={styles.button}>
      {props.label}
    </Button>
  );
};

export default CustomButton;
