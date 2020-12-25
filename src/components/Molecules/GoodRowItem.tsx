import React, { Component } from "react";
import { View, Text, StyleSheet } from "react-native";
import { Badge, Icon, ListItem } from "react-native-elements";

import { Responses } from "../../services";

const styles = StyleSheet.create({
  subtitleView: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingTop: 5,
  },
});

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
        {model.IsBox && model.DamagePercentId && (
          <Icon name="archive" type="font-awesome" />
        )}
        <ListItem.Content>
          <ListItem.Title>{this.props.model.GoodName}</ListItem.Title>
          <View style={styles.subtitleView}>
            {model.DamagePercentId && (
              <Badge
                value="дефект"
                status="warning"
                containerStyle={{ padding: 2 }}
              />
            )}
            {!model.IsBox && (
              <Text>
                {this.props.model.GoodArticle} | Кол-во: {model.CountQty}
              </Text>
            )}
          </View>
        </ListItem.Content>
        {model.IsBox && model.DamagePercentId && <ListItem.Chevron />}
      </ListItem>
    );
  }
}
