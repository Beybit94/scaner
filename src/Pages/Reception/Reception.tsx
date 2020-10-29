/* eslint-disable react/no-did-mount-set-state */
import React from "react";
import { createStackNavigator } from "@react-navigation/stack";

import { AuthContext } from "../../services";
import { headerOptions, DrawerToggle } from "../Menu/Header";
import { BarCode } from "../../components/Templates";

import GoodPage from "./GoodPage";
import BoxPage from "./BoxPage";
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
            name="ScanPage"
            component={BarCode}
            options={{
              title: "Сканировать",
            }}
          />
          {/* <Stack.Screen
            name="Box"
            component={Box}
            options={{
              title: "Прием короба",
            }}
          />
          <Stack.Screen
            name="Difference"
            component={Difference}
            options={{
              title: "Расхождение",
            }}
          />
          <Stack.Screen
            name="Pdf"
            component={PdfFile}
            options={{
              title: "Акт приема",
            }}
          />
          <Stack.Screen
            name="UploadPhoto"
            component={ImagePickerCustom}
            options={{
              title: "Прикрепить фото",
            }}
          /> */}
        </Stack.Navigator>
      </AuthContext.Provider>
    );
  }
}
