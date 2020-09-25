/* eslint-disable import/no-anonymous-default-export */
import {
  NativeModules,
  DeviceEventEmitter,
  EmitterSubscription,
} from "react-native";
const { Honeywell } = NativeModules;

let subscriptionBarcodeReadSuccess: EmitterSubscription;
let subscriptionBarcodeReadFail: EmitterSubscription;

Honeywell.onBarcodeReadSuccess = (handler: (data: string) => void) => {
  subscriptionBarcodeReadSuccess = DeviceEventEmitter.addListener(
    Honeywell.BARCODE_READ_SUCCESS,
    handler
  );
};

Honeywell.onBarcodeReadFail = (handler: (data: string) => void) => {
  subscriptionBarcodeReadFail = DeviceEventEmitter.addListener(
    Honeywell.BARCODE_READ_FAIL,
    handler
  );
};

Honeywell.offBarcodeReadSuccess = () => {
  subscriptionBarcodeReadSuccess.remove();
};
Honeywell.offBarcodeReadFail = () => {
  subscriptionBarcodeReadFail.remove();
};

export default Honeywell;
// const module = Honeywell;
// export default { module };
