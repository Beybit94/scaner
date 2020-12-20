package com.scanner.honeywel;

import android.os.Build;
import android.util.Log;

import androidx.annotation.NonNull;

import com.facebook.react.ReactPackage;
import com.facebook.react.bridge.NativeModule;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.uimanager.ViewManager;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collections;
import java.util.List;

public class HoneywellPackage implements ReactPackage {
    static final String TAG = "Honeywell";

    public String[] manufacturers = {"datalogic","honeywell","htc","huawei","lenovo","oneplus","oppo","samsung","sony","xiaomi","zebra"};

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
        String deviceName = this.getDeviceName().toLowerCase();
        Log.d(TAG, deviceName);
        return deviceName.contains("SD");
    }

    @Override
    public List<NativeModule> createNativeModules(@NonNull ReactApplicationContext reactContext) {
        List<NativeModule> modules = new ArrayList<>();
        if(isCompatible()){
            modules.add(new SpeedataModule(reactContext));
        }else {
            modules.add(new HoneywellModule(reactContext));
        }
        return modules;
    }

    @Override
    public List<ViewManager> createViewManagers(@NonNull ReactApplicationContext reactContext) {
        return Collections.emptyList();
    }
}
