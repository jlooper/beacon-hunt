<!---
    Licensed to the Apache Software Foundation (ASF) under one
    or more contributor license agreements.  See the NOTICE file
    distributed with this work for additional information
    regarding copyright ownership.  The ASF licenses this file
    to you under the Apache License, Version 2.0 (the
    "License"); you may not use this file except in compliance
    with the License.  You may obtain a copy of the License at

      http://www.apache.org/licenses/LICENSE-2.0

    Unless required by applicable law or agreed to in writing,
    software distributed under the License is distributed on an
    "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
    KIND, either express or implied.  See the License for the
    specific language governing permissions and limitations
    under the License.
-->

# com.estimote.sdk

Estimote Beacon is a super small device. It has a powerful 32-bit ARM® Cortex M0 CPU with 256kB flash memory, accelerometer, temperature sensor and most importantly – a 2.4 GHz Bluetooth 4.0 Smart (also known as BLE or Bluetooth low energy) bidirectional radio

You can think of the beacon as a small lighthouse tower that's installed in a fixed location and broadcasts its presence to all the ships (smartphones) around. They could be as close as 2 inches and as far as 230 feet (approx. 70 metres) away.

The plugin is implemented on top of the Estimote native SDKs that lets you track beacon devices around you. It defines a global `estimote` object, which defines various operations that are used for tracking a beacon device.

Although the object is in the global scope, it is not available until after the `deviceready` event.

    document.addEventListener("deviceready", onDeviceReady, false);
    function onDeviceReady() {
        console.log(device.cordova);
    }

## Installation

Once you have your estimote beacons in place and configured you can install the SDK in the folloiwng way:

    cordova plugin add plugin_url

## Methods

- estimote.startListening
- estimote.stopListening


# estimote.startListening

The method initalizes the native beacon manager for a region.

    estimote.startListening("Telerik");

Once done I can subscribe to the document event as shown below and as I have devices nearby it will send me list and other information that will let me identify an estimote device and do various cool things with my app:

    document.addEventListener('beaconsReceived', this.onBeaconsReceived, false);

    // Moving forward.
    onBeconsReceived: function(e){
        for(var index = 0; index< e.beacons.length; index++){
          // TODO: You app specific logic.
        }
    }


# estimote.stopListening

The method stops the tracking of any further beacons send by estimote devices.

## Example

    estimote.stopListening();


## Supported Platforms

- iOS
- Android

## Resources

In order to get an understanding of how estimote beacon devices work, please refer to the [Getting Started Documetnation](http://estimote.com/api/getting-started/intro-to-beacons.html).
