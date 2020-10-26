import React, { Component } from "react";
import { Text, View } from "react-native";
import { SwipeListView } from "react-native-swipe-list-view";
import GoodHiddenItem from "components/Molecules/GoodHiddenItem";
import GoodSwipableItem from "components/Molecules/GoodSwipableItem";
import { Responses } from "services/api/Responses";

type Props = {
  data: Responses.GoodModel[];
  onPress?: (model: Responses.GoodModel) => void;
  onEdit: (row: number) => void;
  onRemove: (model: Responses.GoodModel) => void;
};

export default class GoodList extends Component<Props> {
  render() {
    const { data, onPress, onEdit, onRemove } = this.props;

    if (data.length <= 0) {
      return (
        <View>
          <Text>Нет данных</Text>
        </View>
      );
    }

    return (
      <SwipeListView
        data={data}
        keyExtractor={(item) => item.StrID}
        useFlatList={true}
        renderItem={(model) => (
          <GoodSwipableItem model={model.item} onPress={onPress} />
        )}
        renderHiddenItem={(model) => (
          <GoodHiddenItem
            index={model.index}
            model={model.item}
            edit={onEdit}
            remove={onRemove}
          />
        )}
      />
    );
  }
}
