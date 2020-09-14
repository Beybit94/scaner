/* eslint-disable react/no-did-mount-set-state */
import * as React from "react";
import { Image, View, Text, Dimensions, Alert } from "react-native";
import { StackScreenProps } from "@react-navigation/stack";
import * as ImagePicker from "expo-image-picker";
import * as Permissions from "expo-permissions";

import { TaskManager } from "../../Managers";
import {
  LocalStorage,
  OnRequestError,
  StorageKeys,
  TaskModel,
} from "../../components";
import { RootStackParamList } from "../Reception/Reception";

import Loading from "./Loading";

const { height, width } = Dimensions.get("window");

type ImagePickerProps = StackScreenProps<RootStackParamList, "UploadPhoto">;
export default class ImagePickerCustom extends React.Component<
  ImagePickerProps
> {
  state = {
    image: null,
    isLoading: false,
    CameraPermissionGranted: null,
  };

  componentDidMount() {
    this.getPermissionAsync();
  }

  getPermissionAsync = async () => {
    const { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL);
    this.setState({
      CameraPermissionGranted: status === "granted" ? true : false,
    });
    if (status === "granted") {
      this._pickImage();
    }
  };

  _pickImage = async () => {
    const { navigation, route } = this.props;
    const { onGoBack } = route.params;

    try {
      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.All,
        allowsEditing: true,
        quality: 1,
      });

      if (!result.cancelled) {
        this.setState({ image: result.uri, isLoading: true });
        const task = await LocalStorage.getItem<TaskModel>(
          StorageKeys.ACTIVE_TASK
        );

        if (task) {
          const media = {
            uri: result.uri,
            type: "image/jpeg",
            name: `Акт_${task.PlanNum}_${new Date().toISOString()}.jpg`,
          };

          await TaskManager.upload(media).then(async (response) => {
            console.warn(response);
            if (!response.success) {
              throw new Error(response.error);
            }

            if (onGoBack) {
              onGoBack();
            }
            navigation.goBack();

            // await TaskManager.endTask(task.Id, task.PlanNum).then(
            //   async (response2) => {
            //     if (!response2.success) {
            //       throw new Error(response2.error);
            //     }
            //     if (onGoBack) {
            //       onGoBack();
            //     }
            //     navigation.goBack();
            //   }
            // );
          });
        }
      }
      console.log(result);
    } catch (ex) {
      Alert.alert(
        OnRequestError.CREATE_TASK,
        JSON.stringify(ex.message),
        [{ text: "OK" }],
        { cancelable: false }
      );
    } finally {
      this.setState({ isLoading: false });
    }
  };

  render() {
    const { CameraPermissionGranted, image } = this.state;

    if (CameraPermissionGranted === null) {
      return (
        <View style={{ flex: 1, justifyContent: "center" }}>
          <Text>Разрешите камеру</Text>
        </View>
      );
    }

    if (CameraPermissionGranted === false) {
      return (
        <View style={{ flex: 1, justifyContent: "center" }}>
          <Text>Нет доступа к камере</Text>
        </View>
      );
    }

    return (
      <Loading isLoading={this.state.isLoading}>
        <View
          style={{ flex: 1, alignItems: "center", justifyContent: "center" }}
        >
          {image && (
            <Image
              source={{ uri: image }}
              style={{ width: width, height: height }}
            />
          )}
        </View>
      </Loading>
    );
  }
}
