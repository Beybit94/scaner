package com.scanner.honeywel;

import android.os.Build;
import android.os.Handler;
import android.util.Log;

import androidx.annotation.Nullable;

import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.modules.core.DeviceEventManagerModule;

import static com.scanner.honeywel.HoneywellPackage.TAG;

import com.honeywell.aidc.AidcManager;
import com.honeywell.aidc.BarcodeFailureEvent;
import com.honeywell.aidc.BarcodeReadEvent;
import com.honeywell.aidc.BarcodeReader;
import com.honeywell.aidc.ScannerUnavailableException;
import com.honeywell.aidc.UnsupportedPropertyException;

import com.scandecode.ScanDecode;
import com.scandecode.inf.ScanInterface;

import java.util.HashMap;
import java.util.Map;

@SuppressWarnings("unused")
public class HoneywellModule extends ReactContextBaseJavaModule implements BarcodeReader.BarcodeListener {

    private static final boolean D = true;

    private ReactApplicationContext mReactContext;
    private static final String BARCODE_READ_SUCCESS = "barcodeReadSuccess";
    private static final String BARCODE_READ_FAIL = "barcodeReadFail";

    private boolean isCompatible;

    //Honeywell
    private static BarcodeReader barcodeReader;
    private AidcManager manager;
    private BarcodeReader reader;

    //Speedata
    Handler handler;
    private ScanInterface scanDecode;

    public HoneywellModule(ReactApplicationContext reactContext) {
        super(reactContext);

        mReactContext = reactContext;
        isCompatible = this.isCompatible();
    }

    @Override
    public String getName() {
        return "Honeywell";
    }

    public String getDeviceName() {
        String manufacturer = Build.MANUFACTURER;
        String model = Build.MODEL;
        if (model.toLowerCase().startsWith(manufacturer.toLowerCase())) {
            return capitalize(model);
        } else {
            return capitalize(manufacturer) + " " + model;
        }
    }

    private String capitalize(String s) {
        if (s == null || s.length() == 0) {
            return "";
        }
        char first = s.charAt(0);
        if (Character.isUpperCase(first)) {
            return s;
        } else {
            return Character.toUpperCase(first) + s.substring(1);
        }
    }

    private boolean isCompatible() {
        return this.getDeviceName().toLowerCase().contains("honeywell");
    }

    private void sendEvent(String eventName, @Nullable String params) {
        if (mReactContext.hasActiveCatalystInstance()) {
            if (D) Log.d(TAG, "Sending event: " + eventName);
            mReactContext
                    .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
                    .emit(eventName, params);
        }
    }

    @Override
    public void onBarcodeEvent(BarcodeReadEvent barcodeReadEvent) {
        if (D) Log.d(TAG, "HoneywellBarcodeReader - Barcode scan read");
        sendEvent(BARCODE_READ_SUCCESS, barcodeReadEvent.getBarcodeData());
    }

    @Override
    public void onFailureEvent(BarcodeFailureEvent barcodeFailureEvent) {
        if (D) Log.d(TAG, "HoneywellBarcodeReader - Barcode scan failed");
        sendEvent(BARCODE_READ_FAIL, null);
    }

    /*******************************/
    /** Methods Available from JS **/
    /*******************************/

    private Runnable startTask = new Runnable() {
        @Override
        public void run() {
            scanDecode.starScan();
            handler.postDelayed(startTask, 1000);
        }
    };

    @ReactMethod
    public void startReader(final Promise promise) {
        if(isCompatible){
            AidcManager.create(mReactContext, new AidcManager.CreatedCallback() {
                @Override
                public void onCreated(AidcManager aidcManager) {
                    manager = aidcManager;
                    reader = manager.createBarcodeReader();
                    if(reader != null){
                        reader.addBarcodeListener(HoneywellModule.this);
                        try {
                            reader.claim();
                            reader.setProperty(BarcodeReader.PROPERTY_EAN_13_ENABLED, true);
                            reader.setProperty(BarcodeReader.PROPERTY_EAN_13_CHECK_DIGIT_TRANSMIT_ENABLED, true);
                            reader.setProperty(BarcodeReader.PROPERTY_UPC_A_ENABLE,true);
                            reader.setProperty(BarcodeReader.PROPERTY_UPC_A_CHECK_DIGIT_TRANSMIT_ENABLED,true);
                            reader.setProperty(BarcodeReader.PROPERTY_UPC_A_NUMBER_SYSTEM_TRANSMIT_ENABLED,true);
                            promise.resolve(true);
                        } catch (ScannerUnavailableException | UnsupportedPropertyException e) {
                            e.printStackTrace();
                            promise.resolve(false);
                        }
                    }
                }
            });
        }else{
            handler = new Handler();
            scanDecode = new ScanDecode(mReactContext);
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
            scanDecode.starScan();
            promise.resolve(true);
        }
    }

    @ReactMethod
    public void stopReader(Promise promise) {
        if(isCompatible){
            if (reader != null) {
                reader.close();
            }
            if (manager != null) {
                manager.close();
            }
        }else{
            scanDecode.stopScan();
            handler.removeCallbacks(startTask);
            scanDecode.onDestroy();
        }

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
