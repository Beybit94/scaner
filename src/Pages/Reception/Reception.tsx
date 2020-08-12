/* eslint-disable react/no-did-mount-set-state */
import React from "react";
import { createStackNavigator } from "@react-navigation/stack";

import { AuthContext } from "../../components";
import { headerOptions, DrawerToggle } from "../Menu/Header";

import { ScanDocumentButton, ScanDocument } from "./ScanDocument";

export type RootStackParamList = {
  ScanDocumentButton: undefined;
  ScanDocument: { id: string };
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
            options={({ route }) => ({
              title: `Прием товара № ${route.params.id}`,
            })}
          />
        </Stack.Navigator>
      </AuthContext.Provider>
    );
  }
}
