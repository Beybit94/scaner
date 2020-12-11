package com.scanner.honeywel;

import android.os.Handler;
import android.util.Log;

import androidx.annotation.Nullable;

import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.modules.core.DeviceEventManagerModule;

import com.scandecode.ScanDecode;
import com.scandecode.inf.ScanInterface;

import java.util.HashMap;
import java.util.Map;

import static com.scanner.honeywel.HoneywellPackage.TAG;

@SuppressWarnings("unused")
public class SpeedataModule extends ReactContextBaseJavaModule {

    private static final boolean D = true;

    private ReactApplicationContext mReactContext;
    private static final String BARCODE_READ_SUCCESS = "barcodeReadSuccess";
    private static final String BARCODE_READ_FAIL = "barcodeReadFail";

    //Speedata
    private ScanInterface scanDecode;

    public SpeedataModule(ReactApplicationContext reactContext) {
        super(reactContext);

        mReactContext = reactContext;
        scanDecode = new ScanDecode(mReactContext);
    }

    @Override
    public String getName() {
        return "Honeywell";
    }


    private void sendEvent(String eventName, @Nullable String params) {
        if (mReactContext.hasActiveCatalystInstance()) {
            if (D) Log.d(TAG, "Sending event: " + eventName);
            mReactContext
                    .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
                    .emit(eventName, params);
        }
    }

    /*******************************/
    /** Methods Available from JS **/
    /*******************************/

    @ReactMethod
    public void startReader(final Promise promise) {
        scanDecode.initService("true");
        scanDecode.getBarCode(new ScanInterface.OnScanListener() {
            @Override
            public void getBarcode(String s) {
                if (D) Log.d(TAG, "HoneywellBarcodeReader - Barcode scan read");
                sendEvent(BARCODE_READ_SUCCESS, s);
            }

            @Override
            public void getBarcodeByte(byte[] bytes) {

            }
        });

        promise.resolve(true);
    }

    @ReactMethod
    public void stopReader(Promise promise) {
        scanDecode.stopScan();
        scanDecode.onDestroy();

        promise.resolve(null);
    }

    @Override
    public Map<String, Object> getConstants() {
        final Map<String, Object> constants = new HashMap<>();
        constants.put("BARCODE_READ_SUCCESS", BARCODE_READ_SUCCESS);
        constants.put("BARCODE_READ_FAIL", BARCODE_READ_FAIL);
        return constants;
    }
}
