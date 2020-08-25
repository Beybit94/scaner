import React, { Component } from "react";
import { ListItem, Icon } from "react-native-elements";

import { GoodModel } from "../../components";

type GoodItemProps = {
  data: GoodModel;
  onPress?: (model: GoodModel) => void;
};
export default class GoodItem extends Component<GoodItemProps> {
  render() {
    const { data, onPress } = this.props;
    return (
      <ListItem
        key={data.StrID}
        title={data.GoodName}
        subtitle={data.GoodArticle}
        leftIcon={
          data.IsBox && onPress && <Icon name="archive" type="font-awesome" />
        }
        bottomDivider
        chevron={{
          color: data.IsBox && onPress ? "black" : "transparent",
        }}
        onPress={() => data.IsBox && onPress && onPress(this.props.data)}
      />
    );
  }
}
