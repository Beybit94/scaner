/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { Component } from "react";

import { Honeywell } from "../../Native";
import { GoodTemplate, Loading } from "../../components/Templates";
import {
  GoodService,
  GoodAction,
  Responses,
  TaskService,
} from "../../services";

export default class GoodPage extends Component {
  state = {
    title: "Планирование:",
    data: [],
    isGood: false,
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
      const { data, currentRow, currentCount } = this.state;
      this.setState({ visible: visible, currentRow: row });
      if (visible) {
        const good = data[row] as Responses.GoodModel;
        this.setState({ currentCount: good.CountQty });
      } else {
        if (row > 0) {
          this.setState({ isLoading: true, isScanning: true });
          const good = data[currentRow] as Responses.GoodModel;
          good.CountQty = currentCount;

          await GoodService.crud(GoodAction.edit, good).then((goods) => {
            this.setState({ data: goods });
          });
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
      this.setState({ isLoading: true, isScanning: true });

      await GoodService.crud(GoodAction.remove, model).then((goods) => {
        this.setState({ data: goods });
      });
    } catch (ex) {
      throw new Error(ex);
    } finally {
      this.setState({ isLoading: false });
    }
  };

  scan = async (id?: string) => {
    try {
      const { isGood } = this.state;
      this.setState({ isLoading: true, isScanning: true });
      const good = {} as Responses.GoodModel;

      if (!isGood) {
        await TaskService.scan(id).then((task) => {
          this.setState({
            isGood: true,
            title: `Планирование: ${task?.PlanNum}`,
          });
        });

        await GoodService.crud(0, good).then((goods) => {
          this.setState({ data: goods });
        });
      } else {
        good.BarCode = id || "";

        await GoodService.crud(GoodAction.add, good).then((goods) => {
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
    const { itemEdit, itemRemove, scan, handleStateChange } = this;

    return (
      <Loading isLoading={isLoading}>
        <GoodTemplate
          title={title}
          data={data}
          visible={visible}
          itemEdit={itemEdit}
          itemRemove={itemRemove}
          scan={scan}
          handleStateChange={handleStateChange}
        />
      </Loading>
    );
  }
}
