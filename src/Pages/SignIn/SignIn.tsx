/* eslint-disable react-native/no-unused-styles */
import React from "react";
import { View, Text, TextInput, StyleSheet, Alert } from "react-native";
import { Button } from "react-native-paper";
import CheckBox from "@react-native-community/checkbox";
import { NavigationContext } from "@react-navigation/native";

import { AuthManager } from "../../Managers/AuthManager";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    //backgroundColor: "#C0C0C0",
  },
  logo: {
    fontWeight: "bold",
    fontSize: 50,
    color: "#fb5b5a",
    marginBottom: 40,
    textAlign: "center",
  },
  input: {
    margin: 8,
    padding: 10,
    borderRadius: 3,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: "grey",
  },
  button: {
    margin: 8,
    backgroundColor: "green",
  },
  checkboxContainer: {
    flexDirection: "row",
    marginBottom: 20,
  },
  checkbox: {
    alignSelf: "center",
  },
  label: {
    margin: 8,
    color: "black",
  },
});

export default class SignIn extends React.Component {
  static contextType = NavigationContext;
  static navigationOptions = {
    headerTitleStyle: { alignSelf: "center" },
    title: "Авторизация",
  };

  state = {
    login: "",
    pass: "",
    save: false,
  };
  toggleCheckBox = false;

  _handleStateChange = (inputName: string, inputValue: unknown) => {
    this.setState((state) => ({
      ...state,
      [inputName]: inputValue,
    }));
  };

  _handleCheckboxChange = () => {
    this.toggleCheckBox = !this.toggleCheckBox;
  };

  _signInAsync = async () => {
    const navigation = this.context;

    try {
      await AuthManager.signInAsync();

      navigation.reset({
        index: 0,
        routes: [{ name: "Home" }],
      });
    } catch (error) {
      Alert.alert(
        "Error signing in",
        JSON.stringify(error),
        [
          {
            text: "OK",
          },
        ],
        { cancelable: false }
      );
    }
  };

  render() {
    const navigation = this.context;
    navigation.setOptions({
      title: "Авторизация",
      headerShown: true,
      headerTitleStyle: {
        alignSelf: "center",
      },
    });

    return (
      <View style={styles.container}>
        {/* <Text style={styles.logo}>Sulpak</Text> */}
        <View style={{ flex: 1, justifyContent: "center" }}>
          <TextInput
            placeholder="Логин"
            value={this.state.login}
            onChangeText={(value) => this._handleStateChange("login", value)}
            style={styles.input}
          />
          <TextInput
            placeholder="Пароль"
            secureTextEntry
            value={this.state.pass}
            onChangeText={(value) => this._handleStateChange("pass", value)}
            style={styles.input}
          />
          <View style={styles.checkboxContainer}>
            <CheckBox
              value={this.state.save}
              onValueChange={(value: boolean) =>
                this._handleStateChange("save", value)
              }
              style={styles.checkbox}
            />
            <Text style={styles.label}>Сохранить логин и пароль</Text>
          </View>
          <Button
            mode="contained"
            onPress={this._signInAsync}
            style={styles.button}
          >
            Войти
          </Button>
        </View>
      </View>
    );
  }
}