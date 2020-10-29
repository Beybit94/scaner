import React, { Component } from "react";
import { Icon, ListItem } from "react-native-elements";

import { Responses } from "../../services";
import { RowItem } from "../Atoms";

type Props = {
  model: Responses.GoodModel;
  onPress?: (model: Responses.GoodModel) => void;
};

export default class GoodRowItem extends Component<Props> {
  render() {
    const { model } = this.props;

    return (
      <RowItem
        key={model.StrID}
        isChevron={!model.IsBox}
        isClickable={model.IsBox}
        onPress={this.props.onPress}
        avatar={
          model.IsBox ? <Icon name="archive" type="font-awesome" /> : null
        }
      >
        <ListItem.Content>
          <ListItem.Title>{this.props.model.GoodName}</ListItem.Title>
          <ListItem.Subtitle>
            {this.props.model.GoodArticle}{" "}
            {model.IsBox ? "" : "| Кол-во:" + model.Count}
          </ListItem.Subtitle>
        </ListItem.Content>
      </RowItem>
    );
  }
}
