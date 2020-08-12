import * as React from "react";
import { ParamListBase } from "@react-navigation/native";
import {
  createStackNavigator,
  StackNavigationProp,
} from "@react-navigation/stack";

import { SignIn, Splash, DrawerMenu } from "./src/Pages";
import { LoadAssets } from "./src/components";

const fonts = {
  "SFProText-Bold": require("./assets/fonts/SF-Pro-Text-Bold.otf"),
  "SFProText-Semibold": require("./assets/fonts/SF-Pro-Text-Semibold.otf"),
  "SFProText-Regular": require("./assets/fonts/SF-Pro-Text-Regular.otf"),
};

const AppStack = createStackNavigator();
const AuthStack = createStackNavigator();

type Props = {
  navigation: StackNavigationProp<ParamListBase>;
};

const AuthStackComponent = ({ navigation }: Props) => {
  navigation.setOptions({
    headerShown: false,
  });

  return (
    <AuthStack.Navigator initialRouteName="Splash">
      <AuthStack.Screen
        name="Splash"
        component={Splash}
        options={{
          headerTitleStyle: { alignSelf: "center" },
          title: "Загрузка",
        }}
      />
      <AuthStack.Screen name="SignIn" component={SignIn} />
      <AuthStack.Screen name="Home" component={DrawerMenu} />
    </AuthStack.Navigator>
  );
};

export default function App() {
  return (
    <LoadAssets {...{ fonts }}>
      <AppStack.Navigator>
        <AppStack.Screen name="AuthStack" component={AuthStackComponent} />
      </AppStack.Navigator>
    </LoadAssets>
  );
}
