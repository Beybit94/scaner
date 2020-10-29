import React, { Component } from "react";
import { Text, View } from "react-native";
import { SwipeListView } from "react-native-swipe-list-view";

import { GoodSwipableItem } from "../Molecules";
import { Responses } from "../../services";

type Props = {
  data: Responses.GoodModel[];
  defect: (model: Responses.GoodModel) => void;
  itemEdit: (row: number) => void;
  itemRemove: (model: Responses.GoodModel) => void;
};

export default class GoodList extends Component<Props> {
  itemClick = (model: Responses.GoodModel) => {
    const navigation = this.context;
    navigation.push("Box", {
      box: model,
    });
  };

  render() {
    const { itemClick } = this;
    const { data, defect, itemEdit, itemRemove } = this.props;

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
            itemClick={itemClick}
            itemEdit={itemEdit}
            itemRemove={itemRemove}
          />
        )}
        ListEmptyComponent={
          <View style={{ margin: 8 }}>
            <Text style={{ textAlign: "center" }}>Нет данных</Text>
          </View>
        }
      />
    );
  }
}
