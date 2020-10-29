import React from "react";
import { NavigationContext } from "@react-navigation/native";

import { Storage } from "../services";
import { Loading } from "../components/Templates";

export default class Splash extends React.Component {
  static contextType = NavigationContext;

  componentDidMount() {
    this._bootstrapAsync();
  }

  _bootstrapAsync = async () => {
    const userToken = await Storage.LocalStorage.getItem<boolean>(
      Storage.StorageKeys.LOGEDIN
    );
    const navigation = this.context;

    navigation.reset({
      index: 0,
      routes: [{ name: userToken === true ? "Home" : "SignIn" }],
    });
  };

  render() {
    return <Loading isLoading={true} />;
  }
}
