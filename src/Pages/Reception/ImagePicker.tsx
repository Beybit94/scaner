/* eslint-disable react/no-did-mount-set-state */
import * as React from "react";
import {
  View,
  Text,
  Alert,
  ScrollView,
  Dimensions,
  StyleSheet,
} from "react-native";
import { StackScreenProps } from "@react-navigation/stack";
import * as ImagePicker from "expo-image-picker";
import * as Permissions from "expo-permissions";
import { Button, Card } from "react-native-paper";

import { TaskManager } from "../../Managers";
import {
  LocalStorage,
  OnRequestError,
  StorageKeys,
  TaskModel,
} from "../../components";
import Loading from "../Shared/Loading";
import { CustomButton } from "../Shared";

import { RootStackParamList } from "./Reception";

const { width } = Dimensions.get("window");
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: "#ecf0f1",
  },
  card: {
    width: width / 2,
  },
  button: {
    margin: 8,
    backgroundColor: "green",
  },
});
let data: FormDataValue[] = [];

type ImagePickerProps = StackScreenProps<RootStackParamList, "UploadPhoto">;
export default class ImagePickerCustom extends React.Component<
  ImagePickerProps
> {
  state = {
    images: data,
    isLoading: false,
    CameraPermissionGranted: null,
  };

  componentDidMount() {
    this.getPermissionAsync();
  }

  getPermissionAsync = async () => {
    const { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL);
    data = [];

    this.setState({
      CameraPermissionGranted: status === "granted" ? true : false,
      images: data,
    });
    if (status === "granted") {
      this._pickImage();
    }
  };

  _pickImage = async () => {
    try {
      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.All,
        allowsEditing: false,
        quality: 1,
      });

      //console.log(result);

      if (!result.cancelled) {
        const task = await LocalStorage.getItem<TaskModel>(
          StorageKeys.ACTIVE_TASK
        );

        if (task) {
          const media = {
            uri: result.uri,
            type: "image/jpeg",
            name: `Акт_${task.PlanNum}_${new Date().toISOString()}.jpg`,
          };
          data.push(media);
        }

        this.setState({ images: data });
      }
    } catch (ex) {
      console.log(ex);
    }
  };

  _endTask = async () => {
    const { navigation, route } = this.props;
    const { onGoBack } = route.params;
    const { images } = this.state;

    this.setState({ isLoading: true });
    try {
      const task = await LocalStorage.getItem<TaskModel>(
        StorageKeys.ACTIVE_TASK
      );
      if (task) {
        await TaskManager.upload(images).then(async (response) => {
          if (!response.success) {
            throw new Error(response.error);
          }
          await TaskManager.endTask(task.Id, task.PlanNum).then((response2) => {
            if (!response2.success) {
              throw new Error(response.error);
            }
            if (onGoBack) {
              onGoBack();
            }
            navigation.goBack();
          });
        });
      }
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

  _renderImage(uri: string, i: number) {
    return (
      <Card key={i} style={styles.card}>
        <Card.Cover source={{ uri: uri }} resizeMode={"cover"} />
        <Card.Actions>
          <Button
            icon="delete"
            onPress={() => {
              data.splice(i, 1);
              this.setState({ images: data });
            }}
            mode="contained"
            style={styles.button}
          >
            Удалить
          </Button>
        </Card.Actions>
      </Card>
    );
  }

  render() {
    const { CameraPermissionGranted, images } = this.state;

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
        <View style={styles.container}>
          <ScrollView>
            <View
              style={{
                flex: 1,
                flexDirection: "row",
                flexWrap: "wrap",
              }}
            >
              {images.map((item, i) => this._renderImage(item.uri, i))}
            </View>
          </ScrollView>
          <Button
            icon="camera"
            mode="contained"
            onPress={this._pickImage}
            style={styles.button}
          >
            Фото
          </Button>
          {images.length > 0 && (
            <CustomButton label={"Завершить задачу"} onClick={this._endTask} />
          )}
        </View>
      </Loading>
    );
  }
}
