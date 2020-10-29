import * as React from "react";
import { ParamListBase } from "@react-navigation/native";
import {
  createStackNavigator,
  StackNavigationProp,
} from "@react-navigation/stack";
import {
  setJSExceptionHandler,
  setNativeExceptionHandler,
} from "react-native-exception-handler";
import { Alert } from "react-native";

import { SignIn, Splash, DrawerMenu } from "./src/Pages";
import { LoadAssets } from "./src/services";

const fonts = {
  "SFProText-Bold": require("./assets/fonts/SF-Pro-Text-Bold.otf"),
  "SFProText-Semibold": require("./assets/fonts/SF-Pro-Text-Semibold.otf"),
  "SFProText-Regular": require("./assets/fonts/SF-Pro-Text-Regular.otf"),
};

const AppStack = createStackNavigator();
const AuthStack = createStackNavigator();

const jsErrorHandler = (error: Error, isFatal: boolean) => {
  Alert.alert(
    "Произошла ошибка",
    JSON.stringify(error.message),
    [{ text: "OK" }],
    {
      cancelable: false,
    }
  );
};
const nativeErrorHandler = (exceptionMsg: string) => {
  Alert.alert(
    "Произошла ошибка",
    JSON.stringify(exceptionMsg),
    [{ text: "OK" }],
    {
      cancelable: false,
    }
  );
};
setJSExceptionHandler(jsErrorHandler);
setNativeExceptionHandler(nativeErrorHandler);

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
