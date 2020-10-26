import React, { Component } from "react";
import { Text } from "react-native";
import { Icon, ListItem } from "react-native-elements";
import { Responses } from "services/api/Responses";
import RowItem from "components/Atoms/RowItem";

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
        isChevron={model.IsBox}
        isClickable={model.IsBox}
        onPress={this.props.onPress}
        avatar={
          model.IsBox ? <Icon name="archive" type="font-awesome" /> : null
        }
        rightElement={<Text>{model.IsBox ? "" : "Кол-во:" + model.Count}</Text>}
      >
        <ListItem.Content>
          <ListItem.Title>{this.props.model.GoodName}</ListItem.Title>
          <ListItem.Subtitle>{this.props.model.GoodArticle}</ListItem.Subtitle>
        </ListItem.Content>
      </RowItem>
    );
  }
}
