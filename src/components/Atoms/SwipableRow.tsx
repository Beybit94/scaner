import React, { Component, ReactElement } from "react";
import { SwipeRow } from "react-native-swipe-list-view";

type Props = {
  key: string;
  disableLeft?: boolean;
  disableRight?: boolean;
  leftOpenValue?: number;
  rightOpenValue?: number;
  children?: ReactElement | ReactElement[];
};

export default class SwipableRow extends Component<Props> {
  render() {
    return (
      <SwipeRow
        disableLeftSwipe={
          this.props.disableLeft ? this.props.disableLeft : false
        }
        disableRightSwipe={
          this.props.disableRight ? this.props.disableRight : false
        }
        leftOpenValue={this.props.leftOpenValue ? this.props.leftOpenValue : 0}
        rightOpenValue={
          this.props.rightOpenValue ? this.props.rightOpenValue : 0
        }
      >
        {this.props.children}
      </SwipeRow>
    );
  }
}
