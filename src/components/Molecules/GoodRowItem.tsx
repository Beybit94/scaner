import React, { Component } from "react";
import { Icon, ListItem } from "react-native-elements";

import { Responses } from "../../services";

type Props = {
  model: Responses.GoodModel;
  onPress?: (model: Responses.GoodModel) => void;
};

export default class GoodRowItem extends Component<Props> {
  render() {
    const { model, onPress } = this.props;

    return (
      <ListItem
        key={model.StrID}
        bottomDivider
        onPress={() => onPress && onPress(model)}
        disabled={!model.IsBox}
      >
        {model.IsBox && <Icon name="archive" type="font-awesome" />}
        <ListItem.Content>
          <ListItem.Title>{this.props.model.GoodName}</ListItem.Title>
          {!model.IsBox && (
            <ListItem.Subtitle>
              {this.props.model.GoodArticle} | Кол-во: {model.CountQty}
            </ListItem.Subtitle>
          )}
        </ListItem.Content>
        {model.IsBox && <ListItem.Chevron />}
      </ListItem>
    );
  }
}
