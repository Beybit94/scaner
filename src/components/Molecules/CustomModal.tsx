import React, { Component, ReactElement } from "react";
import { Modal } from "react-native";

type Props = {
  visible: boolean;
  toggleModal: () => void;
  children?: ReactElement | ReactElement[];
};

export default class CustomModal extends Component<Props> {
  render() {
    const { visible, toggleModal, children } = this.props;
    return (
      <Modal
        visible={visible}
        animationType={"fade"}
        onRequestClose={toggleModal}
      >
        {children}
      </Modal>
    );
  }
}
