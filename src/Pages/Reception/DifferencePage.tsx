/* eslint-disable react/no-did-mount-set-state */
import React, { Component } from "react";
import { FlatList, RefreshControl, View, Text, StyleSheet } from "react-native";
import { NavigationContext } from "@react-navigation/native";
import { ListItem } from "react-native-elements";
import { Caption, Divider, List, Subheading } from "react-native-paper";

import { CustomButton } from "../../components/Molecules";
import { Loading } from "../../components/Templates";
import { Responses, TaskService } from "../../services";

const styles = StyleSheet.create({
  titile: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
  },
  goodName: {
    flex: 3,
    flexDirection: "row",
    justifyContent: "flex-start",
  },
  goodCount: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "flex-end",
    alignSelf: "center",
  },
  subtitle: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  goodArticle: {
    flex: 3,
    flexDirection: "row",
    justifyContent: "flex-start",
  },
  goodQuantity: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "flex-end",
  },
});

export default class DifferencePage extends Component {
  static contextType = NavigationContext;
  state = {
    isLoading: false,
    data: { boxes: [], receipts: [] },
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
    await TaskService.difference().then(async (difference) => {
      if (difference) {
        this.setState({ data: difference, isLoading: false });
      }
    });
  };

  renderItem(item: Responses.ReceiptModel) {
    return (
      <ListItem
        key={new Date().toISOString()}
        bottomDivider
        disabled={true}
        containerStyle={{
          backgroundColor:
            item.Quantity > item.CountQty ? "#F58972" : "#E7F2FF",
        }}
      >
        <View style={{ flex: 1 }}>
          <View style={styles.titile}>
            <View style={styles.goodName}>
              <Text style={{ fontSize: 15, fontWeight: "bold" }}>
                {item.GoodName}
              </Text>
            </View>
            <View style={styles.goodCount}>
              <Text style={{ fontSize: 30, fontWeight: "bold" }}>
                {item.CountQty}
              </Text>
            </View>
          </View>
          <View style={styles.subtitle}>
            <View style={styles.goodArticle}>
              <Text>{item.Article}</Text>
              {item.Barcode && item.Barcode !== "0" && (
                <Text> | {item.Barcode}</Text>
              )}
            </View>
            <View style={styles.goodQuantity}>
              <Text>план: {item.Quantity}</Text>
            </View>
          </View>
        </View>
      </ListItem>
    );
  }

  renderBox(box: Responses.GoodModel, receipts: Responses.ReceiptModel[]) {
    const boxReceipts = receipts.filter(
      (item: Responses.ReceiptModel) => item.Barcode === box.BarCode
    );

    if (boxReceipts.length <= 0) {
      return;
    }

    return (
      <List.Accordion title={box.BarCode}>
        {boxReceipts &&
          boxReceipts.map((item) => (
            <>
              <List.Item
                title={
                  <Subheading>
                    <Text>{item.GoodName}</Text>
                  </Subheading>
                }
                titleNumberOfLines={3}
                description={
                  <Caption>
                    <Text>{item.Article}</Text>
                  </Caption>
                }
                right={(props) => (
                  <View
                    {...props}
                    style={{ marginRight: 10, alignSelf: "center" }}
                  >
                    <Text
                      style={{
                        fontSize: 30,
                        fontWeight: "bold",
                        alignSelf: "flex-end",
                      }}
                    >
                      {item.CountQty}
                    </Text>
                    <Text>план: {item.Quantity}</Text>
                  </View>
                )}
                style={{
                  backgroundColor:
                    item.Quantity > item.CountQty ? "#F58972" : "#E7F2FF",
                }}
              />
              <Divider />
            </>
          ))}
      </List.Accordion>
    );
  }

  render() {
    const navigation = this.context;
    const { isLoading, data } = this.state;
    const { renderBox } = this;

    return (
      <Loading isLoading={isLoading}>
        <View style={{ flex: 1, marginTop: 10 }}>
          {data.boxes &&
            data.boxes.map((box: Responses.GoodModel) =>
              renderBox(box, data.receipts as Responses.ReceiptModel[])
            )}
          <FlatList
            data={data.receipts.filter(
              (item: Responses.ReceiptModel) => item.Barcode === "0"
            )}
            renderItem={({ item }) => this.renderItem(item)}
            keyExtractor={() => new Date().toISOString()}
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
