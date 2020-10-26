import React, { Component } from "react";
import { View, Text, StyleSheet } from "react-native";
import CustomButton from "components/Atoms/Button";

const styles = StyleSheet.create({
  title: {
    margin: 8,
    fontSize: 18,
  },
});

type Props = {
  showScan: () => void;
  title: string;
};

export default class ScanBarcode extends Component<Props> {
  render() {
    return (
      <View>
        <Text style={styles.title}>{this.props.title}</Text>
        <CustomButton label="Сканировать" onClick={this.props.showScan} />
      </View>
    );
  }
}
