/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { Component } from "react";
import { StackScreenProps } from "@react-navigation/stack";
import { Keyboard } from "react-native";
import { Icon } from "react-native-elements";

import { Honeywell } from "../../Native";
import { BoxTemplate, SearchTemplate } from "../../components/Templates";
import { GoodService, GoodAction, Responses } from "../../services";

import { RootStackParamList } from "./ReceptionStackParam";

type BoxPageProps = StackScreenProps<RootStackParamList, "BoxPage">;
export default class BoxPage extends Component<BoxPageProps> {
  state = {
    title: "",
    searchQuery: "",
    data: [],
    searches: [],
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
    this.setState({ isRefreshing: true });
    const { box } = this.props.route.params;
    await GoodService.getGoodByBox(box.ID).then((goods) => {
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

  scan = async (data?: string, article?: string) => {
    try {
      const { isScanning } = this.state;
      if (!isScanning) {
        const { box } = this.props.route.params;
        this.setState({ isLoading: true, isScanning: true });
        const good = {} as Responses.GoodModel;

        if (data) {
          good.BarCode = data;
          good.GoodArticle = article || "";
          good.BoxId = box.ID;

          await GoodService.crud(GoodAction.add, good).then(async () => {
            this.setState({
              searches: [],
              searchQuery: "",
              isSearching: false,
            });
            await this.onRefresh();
          });
        } else {
          this.setState({ title: box.GoodName });
          await this.onRefresh();
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
      searchQuery,
      searches,
      visible,
      title,
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
      <BoxTemplate
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
        handleStateChange={handleStateChange}
      />
    );
  }
}
