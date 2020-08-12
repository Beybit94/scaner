import React from "react";
import { NavigationContext } from "@react-navigation/native";

import { LocalStorage, StorageKeys } from "../components";

import { Loading } from "./Shared";

export default class Splash extends React.Component {
  static contextType = NavigationContext;

  componentDidMount() {
    this._bootstrapAsync();
  }

  _bootstrapAsync = async () => {
    const userToken = await LocalStorage.getItem<boolean>(StorageKeys.LOGEDIN);
    const navigation = this.context;

    navigation.reset({
      index: 0,
      routes: [{ name: userToken ? "Home" : "SignIn" }],
    });
  };

  render() {
    return <Loading isLoading={true} />;
  }
}
