import React, { Component } from "react";
import { SwipeRow } from "react-native-swipe-list-view";

import { Responses } from "../../services";

import GoodHiddenItem from "./GoodHiddenItem";
import GoodRowItem from "./GoodRowItem";

type Props = {
  index: number;
  model: Responses.GoodModel;
  itemClick: (model: Responses.GoodModel) => void;
  itemEdit: (row: number) => void;
  itemRemove: (model: Responses.GoodModel) => void;
  defect: (model: Responses.GoodModel) => void;
};

export default class GoodSwipableItem extends Component<Props> {
  render() {
    const {
      index,
      model,
      itemClick,
      itemEdit,
      itemRemove,
      defect,
    } = this.props;

    return (
      <SwipeRow
        disableLeftSwipe={false}
        disableRightSwipe={false}
        leftOpenValue={75}
        rightOpenValue={model.IsBox ? -75 : -150}
      >
        <GoodHiddenItem
          index={index}
          model={model}
          edit={itemEdit}
          remove={itemRemove}
          defect={defect}
        />
        <GoodRowItem index={index} model={model} onPress={itemClick} />
      </SwipeRow>
    );
  }
}
