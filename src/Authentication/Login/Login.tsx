import React, { useState } from "react";
import {
  View,
  Text,
  Platform,
  TextInput,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import CheckBox from "@react-native-community/checkbox";

const isIOS = Platform.OS === "ios";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#003f5c",
    alignItems: "center",
    justifyContent: "center",
  },
  logo: {
    fontWeight: "bold",
    fontSize: 50,
    color: "#fb5b5a",
    marginBottom: 40,
  },
  inputView: {
    width: "80%",
    backgroundColor: "#465881",
    borderRadius: 25,
    height: 50,
    marginBottom: 20,
    justifyContent: "center",
    padding: 20,
  },
  inputText: {
    height: 50,
    color: "white",
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
    color: "white",
  },
  loginBtn: {
    width: "80%",
    backgroundColor: "#fb5b5a",
    borderRadius: 25,
    height: 50,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 40,
    marginBottom: 10,
  },
  loginText: {
    color: "white",
  },
});

const Login = () => {
  const [toggleCheckBox, setToggleCheckBox] = useState(false);

  return (
    <View style={styles.container}>
      <Text style={styles.logo}>Sulpak</Text>
      <View style={styles.inputView}>
        <TextInput style={styles.inputText} placeholder="Логин" />
      </View>
      <View style={styles.inputView}>
        <TextInput
          secureTextEntry
          style={styles.inputText}
          placeholder="Пароль"
        />
      </View>
      <View style={styles.checkboxContainer}>
        <CheckBox
          value={toggleCheckBox}
          onValueChange={() =>
            toggleCheckBox ? setToggleCheckBox(false) : setToggleCheckBox(true)
          }
          style={styles.checkbox}
        />
        <Text style={styles.label}>Сохранить логин и пароль</Text>
      </View>
      <TouchableOpacity style={styles.loginBtn}>
        <Text style={styles.loginText}>Войти</Text>
      </TouchableOpacity>
    </View>
  );
};

export default Login;
