/* eslint-disable react/no-did-mount-set-state */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { Component } from "react";
import { FlatList, RefreshControl, View, Text } from "react-native";
import { NavigationContext } from "@react-navigation/native";
import { ListItem, Badge } from "react-native-elements";

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
      this.setState({ isLoading: false });
      throw new Error(ex);
    }
  }

  onRefresh = async () => {
    await TaskService.difference().then((difference) => {
      if (difference) {
        this.setState({ data: difference, isLoading: false });
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
              <ListItem
                key={item.Article + "_" + item.Barcode}
                bottomDivider
                disabled={true}
              >
                <ListItem.Content>
                  <ListItem.Title>{item.GoodName}</ListItem.Title>
                  <View
                    style={{
                      flexDirection: "row",
                      justifyContent: "space-between",
                      paddingTop: 5,
                    }}
                  >
                    {item.Barcode !== "0" && (
                      <Badge
                        value={item.Barcode}
                        status="warning"
                        containerStyle={{ padding: 2 }}
                      />
                    )}
                    <Text>
                      Кол-во в 1С: {item.Quantity} | Отсканированного:
                      {item.CountQty}
                    </Text>
                  </View>
                </ListItem.Content>
              </ListItem>
            )}
            keyExtractor={(item) => item.Article + "_" + item.Barcode}
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
