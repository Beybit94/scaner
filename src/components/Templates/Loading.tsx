import React, { Component, ReactElement } from "react";
import { ActivityIndicator, View, StyleSheet, Dimensions } from "react-native";

const { width, height } = Dimensions.get("window");

type Props = {
  isLoading: boolean;
  children?: ReactElement | ReactElement[];
};

const styles = StyleSheet.create({
  spinner: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: "rgba(0, 0, 0, .4)",
    borderRadius: 5,
    width: width,
    height: height,
    zIndex: 1000,
  },
});
export default class Loading extends Component<Props> {
  constructor(props: Props) {
    super(props);
  }

  render() {
    const { isLoading } = this.props;

    if (isLoading) {
      return (
        <View style={styles.spinner}>
          <ActivityIndicator size="large" />
        </View>
      );
    } else {
      return this.props.children;
    }
  }
}
