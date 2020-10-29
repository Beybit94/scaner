/* eslint-disable react/no-did-mount-set-state */
/* eslint-disable react-native/no-unused-styles */
import React from "react";
import { View, Text, TextInput, StyleSheet, Alert } from "react-native";
import CheckBox from "@react-native-community/checkbox";
import { NavigationContext } from "@react-navigation/native";

import { AuthService, Storage } from "../services";
import { Loading } from "../components/Templates";
import { CustomButton } from "../components/Atoms";

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

  async componentDidMount() {
    const login = await AuthService.getRemembered();
    this.setState({
      login: login?.login,
      pass: login?.password,
      save: login?.login ? true : false,
      isLoading: false,
    });
  }

  state = {
    login: "",
    pass: "",
    save: false,
    isLoading: false,
  };

  _handleStateChange = (
    inputName: string,
    inputValue: unknown,
    storageKey: string
  ) => {
    this.setState((state) => ({
      ...state,
      [inputName]: inputValue,
    }));

    if (storageKey !== "") {
      if (inputValue === true) {
        AuthService.rememberUser({
          login: this.state.login,
          password: this.state.pass,
        });
      } else {
        AuthService.forgetUser();
      }
    }
  };

  _signInAsync = async () => {
    const navigation = this.context;
    this.setState({ isLoading: true });

    try {
      await AuthService.signInAsync({
        login: this.state.login,
        password: this.state.pass,
      }).then(async (response) => {
        if (!response.success) {
          throw new Error(response.error);
        }

        if (!response.data) {
          throw new Error();
        }

        await Storage.LocalStorage.setItem(
          Storage.StorageKeys.USER,
          response.data
        ).then(async () => {
          await Storage.LocalStorage.setItem(Storage.StorageKeys.LOGEDIN, true);
        });

        navigation.reset({
          index: 0,
          routes: [{ name: "Home" }],
        });
      });
    } catch (ex) {
      this.setState({ isLoading: false });
      Alert.alert(
        "Error signing in",
        JSON.stringify(ex.message),
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
      <Loading isLoading={this.state.isLoading}>
        <View style={styles.container}>
          <View style={{ flex: 1, justifyContent: "center" }}>
            <TextInput
              placeholder="Логин"
              value={this.state.login}
              onChangeText={(value) =>
                this._handleStateChange("login", value, "")
              }
              style={styles.input}
            />
            <TextInput
              placeholder="Пароль"
              secureTextEntry
              value={this.state.pass}
              onChangeText={(value) =>
                this._handleStateChange("pass", value, "")
              }
              style={styles.input}
            />
            <View style={styles.checkboxContainer}>
              <CheckBox
                value={this.state.save}
                onValueChange={(value: boolean) =>
                  this._handleStateChange("save", value, "saveMe")
                }
                style={styles.checkbox}
              />
              <Text style={styles.label}>Сохранить логин и пароль</Text>
            </View>
            <CustomButton onClick={this._signInAsync} label="Войти" />
          </View>
        </View>
      </Loading>
    );
  }
}
