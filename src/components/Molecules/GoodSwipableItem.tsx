import React, { Component } from "react";
import SwipableRow from "components/Atoms/SwipableRow";
import { Responses } from "services/api/Responses";

import GoodRowItem from "./GoodRowItem";

type Props = {
  model: Responses.GoodModel;
  onPress?: (model: Responses.GoodModel) => void;
};

export default class GoodSwipableItem extends Component<Props> {
  render() {
    const { model, onPress } = this.props;
    return (
      <SwipableRow
        key={model.StrID}
        disableRight={true}
        rightOpenValue={model.IsBox ? -75 : -150}
      >
        <GoodRowItem model={model} onPress={onPress} />
      </SwipableRow>
    );
  }
}
