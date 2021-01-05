/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { Component } from "react";
import { StackScreenProps } from "@react-navigation/stack";
import { Keyboard } from "react-native";
import { Icon } from "react-native-elements";

import { BoxTemplate, SearchTemplate } from "../../components/Templates";
import { GoodService, GoodAction, Responses } from "../../services";
import { Honeywell } from "../../Native";

import { RootStackParamList } from "./ReceptionStackParam";

type BoxPageProps = StackScreenProps<RootStackParamList, "BoxPage">;
export default class BoxPage extends Component<BoxPageProps> {
  state = {
    data: [],
    title: "",
    searches: [],
    currentRow: 0,
    currentCount: 0,
    searchQuery: "",
    visible: false,
    isInitial: true,
    isLoading: false,
    isSearching: false,
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
    navigation.addListener("focus", () => {
      Honeywell.onBarcodeReadSuccess((event: any) => {
        this.scan(event);
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
      await GoodService.defect(model.Id, model.DefectId, model.BoxId).then(
        () => {
          this.onRefresh();
        }
      );
    } else {
      const { navigation } = this.props;
      navigation.push("DefectPage", {
        good: model,
        onGoBack: this.onRefresh,
      });
    }
  };

  onRefresh = async () => {
    const { box } = this.props.route.params;
    this.setState({ isLoading: true });
    await GoodService.getGoodByBox(box.Id).then((goods) => {
      this.setState({ data: goods, isLoading: false });
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
      const { box } = this.props.route.params;
      this.setState({ isLoading: true });

      if (!this.state.isInitial) {
        const good = {} as Responses.GoodModel;
        good.BarCode = data || "";
        good.GoodArticle = article || "";
        good.BoxId = box.Id;

        await GoodService.crud(GoodAction.box, good).then(async () => {
          this.setState({
            searches: [],
            searchQuery: "",
            isSearching: false,
          });
          await this.onRefresh();
        });
      } else {
        this.setState({
          title: box.GoodName,
          isInitial: false,
        });
        await this.onRefresh();
      }
    } finally {
      this.setState({ isLoading: false });
    }
  };

  render() {
    const { box } = this.props.route.params;
    const {
      data,
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
      <BoxTemplate
        box={box}
        data={data}
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
