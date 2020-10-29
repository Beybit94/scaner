/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { Component } from "react";
import { StackScreenProps } from "@react-navigation/stack";

import { Honeywell } from "../../Native";
import { BoxTemplate } from "../../components/Templates";
import { GoodService, GoodAction, Responses } from "../../services";

import { RootStackParamList } from "./ReceptionStackParam";

type BoxPageProps = StackScreenProps<RootStackParamList, "BoxPage">;
export default class BoxPage extends Component<BoxPageProps> {
  state = {
    title: "",
    data: [],
    isLoading: false,
    isScanning: false,
    visible: false,
    currentRow: 0,
    currentCount: 0,
  };

  componentDidMount() {
    this.scan();
    Honeywell.startReader();
    Honeywell.onBarcodeReadSuccess((event: any) => {
      const { isScanning } = this.state;
      if (!isScanning) {
        this.scan(event);
      }
    });
    Honeywell.onBarcodeReadFail(() => {});
  }

  handleStateChange = (inputName: string, inputValue: unknown) => {
    this.setState((state) => ({
      ...state,
      [inputName]: inputValue,
    }));
  };

  itemEdit = async (visible: boolean, row: number) => {
    try {
      const { box } = this.props.route.params;
      const { data, currentRow, currentCount } = this.state;
      this.setState({ visible: visible, currentRow: row });
      if (visible) {
        const good = data[row] as Responses.GoodModel;
        this.setState({ currentCount: good.Count });
      } else {
        if (row > 0) {
          this.setState({ isLoading: true, isScanning: true });
          const good = data[currentRow] as Responses.GoodModel;
          good.Count = currentCount;

          await GoodService.crud(GoodAction.edit, good, box.ID).then(
            (goods) => {
              this.setState({ data: goods });
            }
          );
        }
      }
    } catch (ex) {
      throw new Error(ex);
    } finally {
      this.setState({ isLoading: false });
    }
  };

  itemRemove = async (model: Responses.GoodModel) => {
    try {
      const { box } = this.props.route.params;
      this.setState({ isLoading: true, isScanning: true });

      await GoodService.crud(GoodAction.remove, model, box.ID).then((goods) => {
        this.setState({ data: goods });
      });
    } catch (ex) {
      throw new Error(ex);
    } finally {
      this.setState({ isLoading: false });
    }
  };

  defect = async (model: Responses.GoodModel) => {
    try {
      this.setState({ isLoading: true, isScanning: true });
    } catch (ex) {
      throw new Error(ex);
    } finally {
      this.setState({ isLoading: false });
    }
  };

  scan = async (id?: string) => {
    try {
      const { box } = this.props.route.params;
      this.setState({ isLoading: true, isScanning: true });
      const good = {} as Responses.GoodModel;

      if (id) {
        good.BarCode = id;
        await GoodService.crud(GoodAction.add, good, box.ID).then((goods) => {
          this.setState({ data: goods });
        });
      } else {
        this.setState({ title: box.GoodName });
        await GoodService.crud(0, good, box.ID).then((goods) => {
          this.setState({ data: goods });
        });
      }
    } catch (ex) {
      throw new Error(ex);
    } finally {
      this.setState({ isLoading: false, isScanning: false });
    }
  };

  render() {
    const { isLoading, visible, title, data } = this.state;
    const { defect, itemEdit, itemRemove, scan, handleStateChange } = this;

    return (
      <BoxTemplate
        isLoading={isLoading}
        title={title}
        data={data}
        visible={visible}
        defect={defect}
        itemEdit={itemEdit}
        itemRemove={itemRemove}
        scan={scan}
        handleStateChange={handleStateChange}
      />
    );
  }
}
