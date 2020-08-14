/* eslint-disable react/no-did-mount-set-state */
import React from "react";
import { createStackNavigator } from "@react-navigation/stack";

import { AuthContext } from "../../components";
import { headerOptions, DrawerToggle } from "../Menu/Header";

import { ScanDocumentButton, ScanDocument } from "./ScanDocument";
import { ScanGood, ScanGoodButton } from "./ScanGood";

export type RootStackParamList = {
  ScanDocumentButton: undefined;
  ScanDocument: undefined;
  ScanGoodButton: { id: string };
  ScanGood: undefined;
};

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
            name="ScanDocumentButton"
            component={ScanDocumentButton}
            options={{
              title: "Прием товара",
              headerLeft: () => <DrawerToggle />,
            }}
          />
          <Stack.Screen
            name="ScanDocument"
            component={ScanDocument}
            options={{
              title: "Сканировать документ",
            }}
          />
          <Stack.Screen
            name="ScanGoodButton"
            component={ScanGoodButton}
            options={({ route }) => ({
              title: `Прием товара № ${route.params.id}`,
            })}
          />
          <Stack.Screen
            name="ScanGood"
            component={ScanGood}
            options={{
              title: "Сканировать товар",
            }}
          />
        </Stack.Navigator>
      </AuthContext.Provider>
    );
  }
}
