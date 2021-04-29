/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { Component } from "react";
import { Alert, Keyboard, View } from "react-native";
import { StackScreenProps } from "@react-navigation/stack";
import { Icon } from "react-native-elements";

import { GoodTemplate, SearchTemplate } from "../../components/Templates";
import {
  GoodService,
  GoodAction,
  Responses,
  TaskService,
} from "../../services";
import { Honeywell } from "../../Native";
import { PopupMenu } from "../../components/Organisms";

import { RootStackParamList } from "./ReceptionStackParam";

type GoodPageProps = StackScreenProps<RootStackParamList, "GoodPage">;
export default class GoodPage extends Component<GoodPageProps> {
  state = {
    data: [],
    title: "Планирование:",
    status: 0,
    searches: [],
    currentRow: 0,
    currentCount: 0,
    searchQuery: "",
    visible: false,
    isInitial: true,
    isLoading: false,
    isSearching: false,
  };

  async componentDidMount() {
    const { navigation } = this.props;
    const menuItems = ["Отменить задачу", "Проверить", "Завершить"];
    navigation.setOptions({
      headerRight: () => (
        <View style={{ flexDirection: "row" }}>
          <Icon
            iconStyle={{ marginRight: 10, color: "black" }}
            size={30}
            name="search"
            onPress={this.toggleSearch}
          />
          <PopupMenu actions={menuItems} onPress={this.onPopupEvent} />
        </View>
      ),
    });

    navigation.addListener("focus", () => {
      Honeywell.onBarcodeReadSuccess((event: any) => {
        console.log(event);
        if (event) {
          this.scan(event);
        }
      });
    });
    navigation.addListener("blur", () => {
      Honeywell.offBarcodeReadSuccess();
    });

    this.scan();
  }

  handleStateChange = (inputName: string, inputValue: unknown) => {
    this.setState((state) => ({
      ...state,
      [inputName]: inputValue,
    }));
  };

  itemEdit = async (visible: boolean, row: number) => {
    try {
      const { data, currentRow, currentCount } = this.state;
      this.setState({ visible: visible, currentRow: row });
      if (visible) {
        const good = data[row] as Responses.GoodModel;
        this.setState({ currentCount: good.CountQty });
      } else {
        if (row > 0) {
          this.setState({ isLoading: true });
          const good = data[currentRow] as Responses.GoodModel;
          good.CountQty = currentCount;

          await GoodService.crud(GoodAction.edit, good).then(async () => {
            await this.onRefresh();
          });
        }
      }
    } finally {
      this.setState({ isLoading: false });
    }
  };

  itemRemove = async (model: Responses.GoodModel) => {
    try {
      this.setState({ isLoading: true });

      await GoodService.crud(GoodAction.remove, model).then(async () => {
        await this.onRefresh();
      });
    } finally {
      this.setState({ isLoading: false });
    }
  };

  defect = async (model: Responses.GoodModel) => {
    if (model.DefectId) {
      this.setState({ isLoading: true });
      await GoodService.defect(model.Id, model.DefectId).then(() => {
        this.onRefresh();
      });
    } else {
      const { navigation } = this.props;
      navigation.push("DefectPage", {
        good: model,
        onGoBack: this.onRefresh,
      });
    }
  };

  onRefresh = async () => {
    this.setState({ isLoading: true });
    await GoodService.getGoodByTask().then((goods) => {
      if (goods) {
        this.setState({ data: goods });
      } else {
        this.setState({ data: [] });
      }
      this.setState({ isLoading: false });
    });
  };

  toggleSearch = () => {
    const { isSearching } = this.state;
    this.setState({ isSearching: !isSearching });
  };

  search = async () => {
    try {
      this.setState({ isLoading: true });
      const { searchQuery } = this.state;
      await GoodService.getGoodByFilter(searchQuery).then((searches) => {
        this.setState({ searches: searches });
        Keyboard.dismiss;
      });
    } finally {
      this.setState({ isLoading: false });
    }
  };

  onPopupEvent = async (item: string, index?: number) => {
    if (item !== "itemSelected") {
      return;
    }
    if (index === 0) {
      Alert.alert(
        "Внимание",
        "Точно хотите отменить задачу?",
        [
          { text: "Закрыть", style: "cancel" },
          { text: "OK", onPress: () => this.closeTask() },
        ],
        { cancelable: false }
      );
    }
    if (index === 1) {
      this.difference();
    }
    if (index === 2) {
      Alert.alert(
        "Внимание",
        "Точно хотите завершить задачу?",
        [
          { text: "Закрыть", style: "cancel" },
          { text: "OK", onPress: () => this.endTask() },
        ],
        { cancelable: false }
      );
    }
  };

  closeTask = async () => {
    try {
      this.setState({ isLoading: true });
      await TaskService.closeTask().then((status) => {
        this.setState({ isLoading: false });
        if (status) {
          this.setState({
            isInitial: true,
            title: "Планирование:",
            data: [],
            status: 0,
          });
        }
      });
    } finally {
      //this.setState({ isLoading: false });
    }
  };

  difference = async () => {
    const { navigation } = this.props;
    navigation.push("DifferencePage", {});
  };

  endTask = async () => {
    try {
      this.setState({ isLoading: true });
      await TaskService.endTask().then(async (task) => {
        this.setState({ isLoading: false });
        if (task) {
          this.setState({
            title: `Планирование: ${task?.PlanNum}`,
            status: task.StatusId,
          });
        } else {
          this.setState({
            isInitial: true,
            title: "Планирование:",
            data: [],
            status: 0,
          });
        }

        await this.onRefresh();
      });
    } finally {
      //this.setState({ isLoading: false });
    }
  };

  scan = async (data?: string, article?: string) => {
    try {
      this.setState({ isLoading: true });

      if (!this.state.isInitial) {
        const good = {} as Responses.GoodModel;
        good.BarCode = data || "";
        good.GoodArticle = article || "";

        await GoodService.crud(GoodAction.good, good).then(async () => {
          this.setState({
            searches: [],
            searchQuery: "",
            isScanning: false,
            isSearching: false,
          });

          await this.onRefresh();
        });
      } else {
        await TaskService.scan(data).then(() => {
          this.setState({ isScanning: false });
          TaskService.getActiveTask().then(async (task) => {
            if (task) {
              this.setState({
                isInitial: false,
                title: `Планирование: ${task?.PlanNum}`,
                status: task.StatusId,
              });

              await this.onRefresh();
            }
          });
        });
      }
    } finally {
      this.setState({ isLoading: false });
    }
  };

  render() {
    const {
      data,
      title,
      status,
      searches,
      searchQuery,
      visible,
      isLoading,
      isSearching,
    } = this.state;
    const {
      scan,
      defect,
      search,
      itemEdit,
      closeTask,
      onRefresh,
      itemRemove,
      handleStateChange,
    } = this;

    if (isSearching) {
      return (
        <SearchTemplate
          isLoading={isLoading}
          data={searches}
          searchQuery={searchQuery}
          scan={scan}
          search={search}
          handleStateChange={handleStateChange}
        />
      );
    }

    return (
      <GoodTemplate
        data={data}
        title={title}
        status={status}
        visible={visible}
        isLoading={isLoading}
        scan={scan}
        defect={defect}
        itemEdit={itemEdit}
        onRefresh={onRefresh}
        itemRemove={itemRemove}
        handleStateChange={handleStateChange}
      />
    );
  }
}
