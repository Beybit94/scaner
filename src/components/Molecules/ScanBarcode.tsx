import React, { Component } from "react";
import { View, Text, StyleSheet } from "react-native";

import { Constants } from "../../services";

const styles = StyleSheet.create({
  title: {
    marginHorizontal: 8,
    fontSize: 18,
  },
});

type Props = {
  title: string;
  status?: number;
  showScan: () => void;
};

export default class ScanBarcode extends Component<Props> {
  render() {
    let { title } = this.props;
    const { status } = this.props;
    if (status) {
      if (status === Constants.TaskStatus.Start) {
        title = title + " (предварительная)";
      }
      if (status === Constants.TaskStatus.InProcess) {
        title = title + " (основная)";
      }
    } else {
      title = title;
    }
    return (
      <View>
        <Text style={styles.title}>{title}</Text>
      </View>
    );
  }
}
