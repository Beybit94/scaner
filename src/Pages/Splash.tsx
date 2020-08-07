import React from "react";
import { NavigationContext } from "@react-navigation/native";

import { LocalStorgae } from "../components";

import Loading from "./Shared/ActivityIndicator";

export default class Splash extends React.Component {
  static contextType = NavigationContext;

  componentDidMount() {
    this._bootstrapAsync();
  }

  _bootstrapAsync = async () => {
    const userToken = await LocalStorgae.getItem<string>("userToken");
    const navigation = this.context;

    navigation.setOptions({
      headerTitleStyle: { alignSelf: "center" },
      title: "Загрузка",
    });

    navigation.reset({
      index: 0,
      routes: [{ name: userToken ? "Home" : "SignIn" }],
    });
  };

  render() {
    return <Loading isLoading={true} />;
  }
}
