import React, { Component } from "react";
import { ListItem, Icon } from "react-native-elements";

import { GoodModel } from "../../components";

type GoodItemProps = {
  data: GoodModel;
  onPress?: (model: GoodModel) => void;
};
export default class GoodItem extends Component<GoodItemProps> {
  render() {
    return (
      <ListItem
        key={this.props.data.GoodId}
        title={this.props.data.GoodName}
        subtitle={this.props.data.GoodArticle}
        leftIcon={
          this.props.data.IsBox &&
          this.props.onPress && <Icon name="archive" type="font-awesome" />
        }
        bottomDivider
        chevron={{
          color:
            this.props.data.IsBox && this.props.onPress
              ? "black"
              : "transparent",
        }}
        onPress={() =>
          this.props.data.IsBox &&
          this.props.onPress &&
          this.props.onPress(this.props.data)
        }
      />
    );
  }
}
