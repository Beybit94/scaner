/* eslint-disable react/no-did-mount-set-state */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { Component } from "react";
import { FlatList, RefreshControl, View } from "react-native";
import { NavigationContext } from "@react-navigation/native";
import { ListItem } from "react-native-elements";

import { CustomButton } from "../../components/Molecules";
import { Loading } from "../../components/Templates";
import { Responses, TaskService } from "../../services";

type State = {
  isLoading: boolean;
  data: Responses.DifferenceModel[];
};

export default class DifferencePage extends Component<any, State> {
  static contextType = NavigationContext;
  state = {
    data: [],
    isLoading: false,
  };

  async componentDidMount() {
    try {
      this.setState({ isLoading: true });
      this.onRefresh();
    } catch (ex) {
      throw new Error(ex);
    } finally {
      this.setState({ isLoading: false });
    }
  }

  onRefresh = async () => {
    await TaskService.difference().then((difference) => {
      if (difference) {
        this.setState({ data: difference });
      }
    });
  };

  render() {
    const navigation = this.context;
    const { isLoading, data } = this.state;

    return (
      <Loading isLoading={isLoading}>
        <View style={{ flex: 1, marginTop: 10 }}>
          <FlatList
            data={data}
            renderItem={({ item }) => (
              <ListItem key={item.GoodArticle} bottomDivider disabled={true}>
                <ListItem.Content>
                  <ListItem.Title>{item.GoodName}</ListItem.Title>
                  <ListItem.Subtitle>
                    Кол-во в 1С: {item.Quantity} | Отсканированного:
                    {item.CountQty}
                  </ListItem.Subtitle>
                </ListItem.Content>
              </ListItem>
            )}
            keyExtractor={(item) => item.GoodArticle}
            refreshControl={
              <RefreshControl
                colors={["#9Bd35A", "#689F38"]}
                refreshing={isLoading}
                onRefresh={this.onRefresh}
              />
            }
          />
          <CustomButton
            label={"Акт приема"}
            onClick={() => navigation.push("PdfPage")}
          />
          <CustomButton
            label={"Прикрепить фото"}
            onClick={() => navigation.push("PhotoPage")}
          />
        </View>
      </Loading>
    );
  }
}
