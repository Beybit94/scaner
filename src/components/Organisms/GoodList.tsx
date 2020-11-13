import React, { Component } from "react";
import { RefreshControl, Text, View } from "react-native";
import { NavigationContext } from "@react-navigation/native";
import { SwipeListView } from "react-native-swipe-list-view";

import { GoodSwipableItem } from "../Molecules";
import { Responses } from "../../services";

type Props = {
  data: Responses.GoodModel[];
  defect: (model: Responses.GoodModel) => void;
  itemEdit: (row: number) => void;
  itemRemove: (model: Responses.GoodModel) => void;
  onRefresh: () => void;
};

export default class GoodList extends Component<Props> {
  static contextType = NavigationContext;

  itemClick = (model: Responses.GoodModel) => {
    const navigation = this.context;
    navigation.push("BoxPage", {
      box: model,
    });
  };

  render() {
    const { data, defect, itemEdit, itemRemove, onRefresh } = this.props;

    return (
      <SwipeListView
        data={data}
        keyExtractor={(item) => item.StrID}
        useFlatList={true}
        renderItem={(model) => (
          <GoodSwipableItem
            index={model.index}
            model={model.item}
            defect={defect}
            itemClick={this.itemClick}
            itemEdit={itemEdit}
            itemRemove={itemRemove}
          />
        )}
        ListEmptyComponent={
          <View style={{ margin: 8 }}>
            <Text style={{ textAlign: "center" }}>Нет данных</Text>
          </View>
        }
        refreshControl={
          <RefreshControl
            colors={["#9Bd35A", "#689F38"]}
            refreshing={false}
            onRefresh={onRefresh}
          />
        }
      />
    );
  }
}
