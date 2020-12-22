import React, { Component } from "react";
import {
  UIManager,
  findNodeHandle,
  View,
  TouchableOpacity,
} from "react-native";
import { Icon } from "react-native-elements";

type Props = {
  actions: string[];
  onPress: (item: string, index: number | undefined) => void;
};

export default class PopupMenu extends Component<Props> {
  icon = React.createRef<Icon>();

  onError() {
    console.log("Popup Error");
  }

  onPress = () => {
    const node = findNodeHandle(this.icon.current);
    if (node) {
      UIManager.showPopupMenu(
        node,
        this.props.actions,
        this.onError,
        this.props.onPress
      );
    }
  };

  render() {
    return (
      <View>
        <TouchableOpacity onPress={this.onPress}>
          <Icon
            iconStyle={{ marginRight: 10, color: "black" }}
            size={25}
            type="entypo"
            name="dots-three-vertical"
            ref={this.icon}
          />
        </TouchableOpacity>
      </View>
    );
  }
}
