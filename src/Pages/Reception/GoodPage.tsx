/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { Component } from "react";
import { StackScreenProps } from "@react-navigation/stack";
import { Icon } from "react-native-elements";
import { Keyboard } from "react-native";

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
      const { isScanning } = this.state;
      if (!isScanning) {
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
          this.setState({ isLoading: true, isScanning: true });
          const good = data[currentRow] as Responses.GoodModel;
          good.Count = currentCount;

          await GoodService.crud(GoodAction.edit, good).then((goods) => {
            this.setState({ data: goods });
          });
        }
      }
    } catch (ex) {
      throw new Error(ex);
    } finally {
      this.setState({ isLoading: false });
    }
  };

  itemRemove = async (model: Responses.GoodModel) => {
    try {
      this.setState({ isLoading: true, isScanning: true });

      await GoodService.crud(GoodAction.remove, model).then((goods) => {
        this.setState({ data: goods });
      });
    } catch (ex) {
      throw new Error(ex);
    } finally {
      this.setState({ isLoading: false });
    }
  };

  defect = async (model: Responses.GoodModel) => {
    try {
      this.setState({ isLoading: true, isScanning: true });
    } catch (ex) {
      throw new Error(ex);
    } finally {
      this.setState({ isLoading: false });
    }
  };

  onRefresh = async () => {
    const good = {} as Responses.GoodModel;
    await GoodService.crud(0, good).then((goods) => {
      this.setState({ data: goods });
    });
  };

  toggleSearch = () => {
    const { isSearching } = this.state;
    if (isSearching) {
      this.setState({ searches: [], searchQuery: "" });
    }
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
    } catch (ex) {
      throw new Error(ex);
    } finally {
      this.setState({ isLoading: false });
    }
  };

  scan = async (data?: string, article?: string) => {
    try {
      const { isGood } = this.state;
      this.setState({ isLoading: true, isScanning: true });
      const good = {} as Responses.GoodModel;

      if (!isGood) {
        await TaskService.scan(data).then((task) => {
          this.setState({
            isGood: true,
            title: `Планирование: ${task?.PlanNum}`,
          });
        });

        this.onRefresh();
      } else {
        good.BarCode = data || "";
        good.GoodArticle = article || "";

        await GoodService.crud(GoodAction.add, good).then((goods) => {
          this.toggleSearch();
          this.setState({ data: goods });
        });
      }
    } catch (ex) {
      throw new Error(ex);
    } finally {
      this.setState({ isLoading: false, isScanning: false });
    }
  };

  render() {
    const {
      isLoading,
      isSearching,
      visible,
      title,
      searchQuery,
      searches,
      data,
    } = this.state;
    const {
      defect,
      onRefresh,
      itemEdit,
      itemRemove,
      scan,
      search,
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
        title={title}
        data={data}
        visible={visible}
        defect={defect}
        onRefresh={onRefresh}
        itemEdit={itemEdit}
        itemRemove={itemRemove}
        scan={scan}
        handleStateChange={handleStateChange}
      />
    );
  }
}
