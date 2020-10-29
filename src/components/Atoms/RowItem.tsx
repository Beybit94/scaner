import React, { Component, ReactElement } from "react";
import { ListItem } from "react-native-elements";

type Props = {
  key: string;
  isChevron: boolean;
  isClickable: boolean;
  children?: ReactElement | ReactElement[];
  onPress?: (model: never) => void;
  avatar?: ReactElement | null;
};

export default class RowItem extends Component<Props> {
  render() {
    return (
      <ListItem
        key={this.props.key}
        bottomDivider
        onPress={() => this.props.onPress}
        disabled={this.props.isClickable}
      >
        {this.props.avatar}
        {this.props.children}
        {this.props.isChevron && <ListItem.Chevron />}
      </ListItem>
    );
  }
}
