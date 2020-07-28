import * as React from "react";
import { Icon } from "react-native-elements";
import { useNavigation, ParamListBase } from "@react-navigation/native";
import { DrawerNavigationProp } from "@react-navigation/drawer";

export function DrawerToggle() {
  const navigation: DrawerNavigationProp<ParamListBase> = useNavigation();

  return (
    <Icon
      iconStyle={{ marginLeft: 10, color: "black" }}
      size={30}
      name="menu"
      onPress={navigation.toggleDrawer}
    />
  );
}

export const headerOptions = {
  headerStyle: {
    backgroundColor: "white",
  },
  headerTintColor: "black",
};
