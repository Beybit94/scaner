/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react/no-did-mount-set-state */
import React from "react";
import { createStackNavigator } from "@react-navigation/stack";

import { AuthContext, GoodModel } from "../../components";
import { headerOptions, DrawerToggle } from "../Menu/Header";

import Scan from "./Scan";
import Good from "./Good";
import Box from "./Box";
import PdfFile from "./Pdf";
import Difference from "./Difference";
import ImagePickerCustom from "./ImagePicker";

export type RootStackParamList = {
  Good: undefined;
  Scan: undefined | { page?: number; onGoBack?: (model: any) => void };
  Box: { box: GoodModel; onGoBack?: (id: string) => void };
  Difference: { onGoBack?: () => void };
  Pdf: { taskId: number; PlanNum: string };
  UploadPhoto: { onGoBack?: () => void };
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
            name="Good"
            component={Good}
            options={{
              title: "Прием товара",
              headerLeft: () => <DrawerToggle />,
            }}
          />
          <Stack.Screen
            name="Scan"
            component={Scan}
            options={{
              title: "Сканировать",
            }}
          />
          <Stack.Screen
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
          />
        </Stack.Navigator>
      </AuthContext.Provider>
    );
  }
}
