import React from "react";
import { ActivityIndicator, View } from "react-native";
import { NavigationContext } from "@react-navigation/native";

import { LocalStorgae } from "../../components";

export default class Splash extends React.Component {
  static contextType = NavigationContext;

  componentDidMount() {
    this._bootstrapAsync();
  }

  _bootstrapAsync = async () => {
    const userToken = await LocalStorgae.getItem<string>("userToken", "");
    const navigation = this.context;

    navigation.reset({
      index: 0,
      routes: [{ name: userToken ? "Home" : "SignIn" }],
    });
  };

  render() {
    return (
      <View style={{ flex: 1, justifyContent: "center" }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }
}
