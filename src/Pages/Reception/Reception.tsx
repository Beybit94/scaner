/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react/no-did-mount-set-state */
import React from "react";
import { createStackNavigator } from "@react-navigation/stack";

import { AuthContext, Responses } from "../../services";
import { headerOptions, DrawerToggle } from "../Menu/Header";
import { BarCode } from "../../components/Templates";

import GoodPage from "./GoodPage";

export type RootStackParamList = {
  GoodPage: undefined;
  ScanPage: undefined | { onGoBack?: (model: any) => void };
  Box: { box: Responses.GoodModel; onGoBack?: (id: string) => void };
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
            name="GoodPage"
            component={GoodPage}
            options={{
              title: "Прием товара",
              headerLeft: () => <DrawerToggle />,
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
