/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { Component } from "react";
import { FlatList, View, Text } from "react-native";
import { ListItem } from "react-native-elements";
import { Searchbar } from "react-native-paper";

import Loading from "../Shared/Loading";
import { Responses } from "../../../services";

type Props = {
  isLoading: boolean;
  searchQuery: string;
  data: Responses.GoodModel[];
  scan: (barcode: string, article: string) => void;
  search: () => void;
  handleStateChange: (code: string, value: any) => void;
};

export default class SearchTemplate extends Component<Props> {
  render() {
    const {
      isLoading,
      searchQuery,
      data,
      scan,
      search,
      handleStateChange,
    } = this.props;
    return (
      <View style={{ flex: 1 }}>
        <Searchbar
          placeholder="Поиск по атрибуту товара"
          onChangeText={(value) => handleStateChange("searchQuery", value)}
          value={searchQuery}
          onIconPress={search}
        />
        <Loading isLoading={isLoading}>
          <FlatList
            data={data}
            renderItem={({ item }) => (
              <ListItem
                key={item.GoodArticle}
                bottomDivider
                onPress={() => scan(item.BarCode, item.GoodArticle)}
              >
                <ListItem.Content>
                  <ListItem.Title>{item.GoodName}</ListItem.Title>
                  <ListItem.Subtitle>{item.GoodArticle}</ListItem.Subtitle>
                </ListItem.Content>
              </ListItem>
            )}
            keyExtractor={(item) => item.GoodArticle}
            ListEmptyComponent={
              <View style={{ margin: 8 }}>
                <Text style={{ textAlign: "center" }}>Нет данных</Text>
              </View>
            }
          />
        </Loading>
      </View>
    );
  }
}
