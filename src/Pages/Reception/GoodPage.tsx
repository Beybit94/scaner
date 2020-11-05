/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { Component } from "react";
import { Keyboard } from "react-native";
import { StackScreenProps } from "@react-navigation/stack";
import { Icon } from "react-native-elements";

import { Honeywell } from "../../Native";
import { GoodTemplate, SearchTemplate } from "../../components/Templates";
import {
  GoodService,
  GoodAction,
  Responses,
  TaskService,
} from "../../services";

import { RootStackParamList } from "./ReceptionStackParam";

type GoodPageProps = StackScreenProps<RootStackParamList, "GoodPage">;
export default class GoodPage extends Component<GoodPageProps> {
  state = {
    title: "Планирование:",
    searchQuery: "",
    data: [],
    searches: [],
    isGood: false,
    isLoading: false,
    isScanning: false,
    isSearching: false,
    isRefreshing: false,
    visible: false,
    currentRow: 0,
    currentCount: 0,
  };

  componentDidMount() {
    const { navigation } = this.props;
    navigation.setOptions({
      headerRight: () => (
        <Icon
          iconStyle={{ marginRight: 10, color: "black" }}
          size={30}
          name="search"
          onPress={this.toggleSearch}
        />
      ),
    });

    this.scan();
    Honeywell.startReader();
    Honeywell.onBarcodeReadSuccess((event: any) => {
      if (!this.state.isScanning) {
        this.scan(event);
      }
    });
    Honeywell.onBarcodeReadFail(() => {});
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
        this.setState({ currentCount: good.Count });
      } else {
        if (row > 0) {
          this.setState({ isLoading: true });
          const good = data[currentRow] as Responses.GoodModel;
          good.Count = currentCount;

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
    try {
      this.setState({ isLoading: true });
    } finally {
      this.setState({ isLoading: false });
    }
  };

  onRefresh = async () => {
    await GoodService.getGoodByTask().then((goods) => {
      this.setState({ data: goods, isRefreshing: false });
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

  closeTask = async () => {
    try {
      this.setState({ isLoading: true });
      await TaskService.closeTask().then((response) => {
        if (response) {
          this.setState({
            isGood: false,
            title: "Планирование:",
            data: [],
          });
        }
      });
    } finally {
      this.setState({ isLoading: false });
    }
  };

  scan = async (data?: string, article?: string) => {
    try {
      this.setState({ isRefreshing: true });
      const { isScanning } = this.state;

      if (!isScanning) {
        this.setState({ isLoading: true, isScanning: true });
        const good = {} as Responses.GoodModel;

        if (!this.state.isGood) {
          await TaskService.scan(data).then(() => {
            TaskService.getActiveTask().then(async (task) => {
              if (task) {
                this.setState({
                  isGood: true,
                  title: `Планирование: ${task?.PlanNum}`,
                });
              }

              await this.onRefresh();
            });
          });
        } else {
          good.BarCode = data || "";
          good.GoodArticle = article || "";

          await GoodService.crud(GoodAction.add, good).then(async () => {
            this.setState({
              searches: [],
              searchQuery: "",
              isSearching: false,
            });

            await this.onRefresh();
          });
        }
      }
    } finally {
      this.setState({ isLoading: false, isScanning: false });
    }
  };

  render() {
    const {
      isLoading,
      isSearching,
      isRefreshing,
      visible,
      title,
      searchQuery,
      searches,
      data,
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
        isLoading={isLoading}
        isRefreshing={isRefreshing}
        title={title}
        data={data}
        visible={visible}
        defect={defect}
        onRefresh={onRefresh}
        itemEdit={itemEdit}
        itemRemove={itemRemove}
        scan={scan}
        closeTask={closeTask}
        handleStateChange={handleStateChange}
      />
    );
  }
}
