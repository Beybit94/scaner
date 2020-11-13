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
import { Honeywell } from "./src/Native";

const AppStack = createStackNavigator();
const AuthStack = createStackNavigator();

type Props = {
  navigation: StackNavigationProp<ParamListBase>;
};

const errorHandler = (error: Error, isFatal: boolean) => {
  if (isFatal) {
    Alert.alert("Error:" + error.name, error.message, [
      {
        text: "OK",
      },
    ]);
  } else {
    console.log(error);
  }
};

setJSExceptionHandler(errorHandler, true);

setNativeExceptionHandler((exceptionMsg: string) => {
  errorHandler(new Error(exceptionMsg), true);
});

class AuthStackComponent extends React.Component<Props> {
  componentDidMount() {
    this.props.navigation.setOptions({
      headerShown: false,
    });
    Honeywell.startReader();
  }

  render() {
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
  }
}
// const AuthStackComponent = ({ navigation }: Props) => {
//   navigation.setOptions({
//     headerShown: false,
//   });

//   return (
//     <AuthStack.Navigator initialRouteName="Splash">
//       <AuthStack.Screen
//         name="Splash"
//         component={Splash}
//         options={{
//           headerTitleStyle: { alignSelf: "center" },
//           title: "Загрузка",
//         }}
//       />
//       <AuthStack.Screen name="SignIn" component={SignIn} />
//       <AuthStack.Screen name="Home" component={DrawerMenu} />
//     </AuthStack.Navigator>
//   );
// };

export default function App() {
  return (
    <LoadAssets>
      <AppStack.Navigator>
        <AppStack.Screen name="AuthStack" component={AuthStackComponent} />
      </AppStack.Navigator>
    </LoadAssets>
  );
}
