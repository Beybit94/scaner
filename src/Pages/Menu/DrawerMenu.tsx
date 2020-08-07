/* eslint-disable react/no-did-mount-set-state */
import React, { FC } from "react";
import { Alert, StyleSheet, Text, View } from "react-native";
import {
  createDrawerNavigator,
  DrawerContentScrollView,
  DrawerItem,
  DrawerItemList,
  DrawerContentComponentProps,
} from "@react-navigation/drawer";
import { NavigationContext } from "@react-navigation/native";

import Home from "../Home";
import { AuthManager } from "../../Managers/AuthManager";
import { LocalStorgae } from "../../components";
import { UserModel } from "../../components/Models";

const styles = StyleSheet.create({
  profileView: {
    alignItems: "center",
    padding: 10,
    //backgroundColor: "black",
  },
  profileUserName: {
    fontWeight: "700",
  },
});

const Drawer = createDrawerNavigator();

type CustomDrawerContentProps = DrawerContentComponentProps & {
  userName: string;
  signOut: () => void;
};

type DrawerMenuState = {
  userName: string;
};

const CustomDrawerContent: FC<CustomDrawerContentProps> = (props) => (
  <DrawerContentScrollView {...props}>
    <View style={styles.profileView}>
      <Text style={styles.profileUserName}>{props.userName}</Text>
    </View>
    <DrawerItemList {...props} />
    <DrawerItem label="Выйти" onPress={props.signOut} />
  </DrawerContentScrollView>
);

export default class DrawerMenuContent extends React.Component {
  static contextType = NavigationContext;

  async componentDidMount() {
    try {
      const user = await LocalStorgae.getItem<UserModel>("user");
      this.setState({ userName: user?.UserFirstName });
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

  state: DrawerMenuState = {
    userName: "",
  };

  _signOut = async () => {
    const navigation = this.context;

    await AuthManager.signOutAsync();

    navigation.reset({
      index: 0,
      routes: [{ name: "SignIn" }],
    });
  };

  render() {
    const navigation = this.context;
    navigation.setOptions({
      headerShown: false,
    });

    return (
      <Drawer.Navigator
        drawerType="front"
        drawerContent={(props) => (
          <CustomDrawerContent
            {...props}
            userName={this.state.userName}
            signOut={this._signOut}
          />
        )}
      >
        <Drawer.Screen
          name="Home"
          component={Home}
          options={{ drawerLabel: "Прием товара" }}
        />
      </Drawer.Navigator>
    );
  }
}
