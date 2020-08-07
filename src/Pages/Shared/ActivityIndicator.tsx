import React, { Component, ReactElement } from "react";
import { ActivityIndicator, View } from "react-native";

type Props = {
  isLoading: boolean;
  children?: ReactElement | ReactElement[];
};

export default class Loading extends Component<Props> {
  constructor(props: Props) {
    super(props);
  }

  render() {
    const { isLoading } = this.props;

    if (isLoading) {
      return (
        <View style={{ flex: 1, justifyContent: "center" }}>
          <ActivityIndicator size="large" />
        </View>
      );
    } else {
      return this.props.children;
    }
  }
}
