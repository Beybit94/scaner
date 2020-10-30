/* eslint-disable react/no-did-mount-set-state */
import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { Header } from "react-native-elements";
import { Searchbar } from "react-native-paper";

import { AuthContext } from "../../services";
import { headerOptions, DrawerToggle, CustomSearchbar } from "../Menu/Header";

import GoodPage from "./GoodPage";
import BoxPage from "./BoxPage";
import DifferencePage from "./DifferencePage";
import PhotoPage from "./PhotoPage";
import ScanPage from "./ScanPage";
import PdfPage from "./PdfPage";
import { RootStackParamList } from "./ReceptionStackParam";

const Stack = createStackNavigator<RootStackParamList>();

export default class Reception extends React.Component {
  state = {
    userLoading: true,
  };

  async componentDidMount() {
    this.setState({ userLoading: false });
  }

  render() {
    return (
      <AuthContext.Provider value={this.state}>
        <Stack.Navigator screenOptions={headerOptions}>
          <Stack.Screen
            name="GoodPage"
            component={GoodPage}
            options={{
              title: "Прием товара",
              headerLeft: () => <DrawerToggle />,
            }}
          />
          <Stack.Screen
            name="BoxPage"
            component={BoxPage}
            options={{
              title: "Прием короба",
            }}
          />
          <Stack.Screen
            name="DifferencePage"
            component={DifferencePage}
            options={{
              title: "Расхождение",
            }}
          />
          <Stack.Screen
            name="PhotoPage"
            component={PhotoPage}
            options={{
              title: "Прикрепить фото",
            }}
          />
          <Stack.Screen
            name="ScanPage"
            component={ScanPage}
            options={{
              title: "Сканировать",
            }}
          />
          <Stack.Screen
            name="PdfPage"
            component={PdfPage}
            options={{
              title: "Акт приема",
            }}
          />
        </Stack.Navigator>
      </AuthContext.Provider>
    );
  }
}
