/* eslint-disable react/no-did-mount-set-state */
import React from "react";
import { View, Text, StyleSheet, ActivityIndicator, Alert } from "react-native";
import { createStackNavigator } from "@react-navigation/stack";
import { Title, Button } from "react-native-paper";

import { AuthContext } from "../components";

import { headerOptions, DrawerToggle } from "./Menu/Header";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    justifyContent: "center",
  },
});

const Stack = createStackNavigator();
type HomeScreenState = {
  userLoading: boolean;
  userName: string;
};

const HomeComponent = () => {
  const userState = React.useContext(AuthContext);

  return (
    <View style={styles.container}>
      <ActivityIndicator animating={userState.userLoading} size="large" />
      {userState.userLoading ? null : <Text>Hello {userState.userName}!</Text>}
    </View>
  );
};

export default class Home extends React.Component {
  async componentDidMount() {
    try {
      const user = { name: "Test" };
      this.setState({ userName: user.name, userLoading: false });
    } catch (error) {
      Alert.alert(
        "Error getting user",
        JSON.stringify(error),
        [
          {
            text: "OK",
          },
        ],
        { cancelable: false }
      );
    }
  }

  state: HomeScreenState = {
    userLoading: true,
    userName: "",
  };

  render() {
    return (
      <AuthContext.Provider value={this.state}>
        <Stack.Navigator screenOptions={headerOptions}>
          <Stack.Screen
            name="Home"
            component={HomeComponent}
            options={{
              title: "Прием товара",
              headerLeft: () => <DrawerToggle />,
            }}
          />
        </Stack.Navigator>
      </AuthContext.Provider>
    );
  }
}
