import React, { Component } from "react";
import { StyleSheet } from "react-native";
import { Button } from "react-native-paper";

const styles = StyleSheet.create({
  button: {
    margin: 8,
    backgroundColor: "green",
  },
});

export type ButtonProps = {
  label: string;
  onClick: () => void;
};

export default class CustomButton extends Component<ButtonProps> {
  render() {
    const { label, onClick } = this.props;

    return (
      <Button mode="contained" onPress={onClick} style={styles.button}>
        {label}
      </Button>
    );
  }
}
