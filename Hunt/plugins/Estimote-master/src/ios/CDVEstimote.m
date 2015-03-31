
#import "CDVEstimote.h"
#import <CoreLocation/CoreLocation.h>
#import "ESTBeacon.h"

@implementation CDVEstimote

- (void)startRanging:(CDVInvokedUrlCommand*)command
{
    NSString *regionName = [command.arguments objectAtIndex:0];

    self.beaconManager = [[ESTBeaconManager alloc] init];
    self.beaconManager.delegate = self;
    self.beaconManager.avoidUnknownStateBeacons = YES;

    self.region = [[ESTBeaconRegion alloc] initWithProximityUUID:ESTIMOTE_PROXIMITY_UUID identifier:regionName];

    self.callbackId = command.callbackId;

    [self startRangingBeacons];
}

// Commented most of these lines because they don't compile against Estimote SDK 2.1.0.
// We need that version because it's the last XCode 5 iOS 7 SDK built version.
// TODO Uncomment these lines when we build with XCode 6 / iOS 8 SDK and update the Estimote SDK from https://github.com/Estimote/iOS-SDK/releases
-(void)startRangingBeacons
{
    if ([ESTBeaconManager authorizationStatus] == kCLAuthorizationStatusNotDetermined){
            if (floor(NSFoundationVersionNumber) <= 1047.25) { // NSFoundationVersionNumber_iOS_7_1
                [self.beaconManager startRangingBeaconsInRegion:self.region];
            } else {
                /*
                 * Request permission to use Location Services. (new in iOS 8)
                 * We ask for "always" authorization so that the Notification Demo can benefit as well.
                 * Also requires NSLocationAlwaysUsageDescription in Info.plist file.
                 *
                 * For more details about the new Location Services authorization model refer to:
                 * https://community.estimote.com/hc/en-us/articles/203393036-Estimote-SDK-and-iOS-8-Location-Services
                 */
               [self.beaconManager requestAlwaysAuthorization];
           }
       }
       else if([ESTBeaconManager authorizationStatus] == kCLAuthorizationStatusAuthorized)
       {
           [self.beaconManager startRangingBeaconsInRegion:self.region];
       }
       else if([ESTBeaconManager authorizationStatus] == kCLAuthorizationStatusDenied)
       {
       }
       else if([ESTBeaconManager authorizationStatus] == kCLAuthorizationStatusRestricted){
    
       }
}
- (void)beaconManager:(ESTBeaconManager *)manager didChangeAuthorizationStatus:(CLAuthorizationStatus)status
{
    [self startRangingBeacons];
}

- (void)beaconManager:(ESTBeaconManager *)manager didRangeBeacons:(NSArray *)beacons inRegion:(ESTBeaconRegion *)region
{
    [self processBeacons:beacons];
}

- (void)processBeacons:(NSArray*)beacons
{
    NSMutableArray *mutableArray = [[NSMutableArray alloc] init];

    if ([beacons count] > 0){
        for (ESTBeacon *beacon in beacons){
            if (beacon.major > 0){

                NSMutableDictionary *mutableDictionary = [[NSMutableDictionary alloc] init];

                [mutableDictionary setObject:beacon.major forKey:@"major"];
                [mutableDictionary setObject:beacon.minor forKey:@"minor"];
                if (beacon.macAddress)
                    [mutableDictionary setObject:beacon.macAddress forKey:@"macAddress"];
                if (beacon.power)
                    [mutableDictionary setObject:beacon.power forKey:@"power"];
                [mutableDictionary setObject:@(beacon.color) forKey:@"colorId"];
                [mutableDictionary setObject:[self getBeaconColorName:beacon.color] forKey:@"color"];

                if (beacon.name)
                    [mutableDictionary setObject:beacon.name forKey:@"name"];
                if (beacon.rssi)
                    [mutableDictionary setObject:@(beacon.rssi) forKey:@"rssi"];
                if (beacon.proximityUUID)
                    [mutableDictionary setObject:beacon.proximityUUID.UUIDString forKey:@"proximityUUID"];
                if (beacon.distance)
                  [mutableDictionary setObject:beacon.distance forKey:@"distance"];
                if (beacon.proximity)
                    [mutableDictionary setObject:@(beacon.proximity) forKey:@"proximity"];
                if (beacon.isMoving)
                    [mutableDictionary setObject:@(beacon.isMoving) forKey:@"isMoving"];
                if (beacon.batteryLevel)
                  [mutableDictionary setObject:beacon.batteryLevel forKey:@"batteryLevel"];

                [mutableArray addObject:mutableDictionary];
            }
        }

        if ([mutableArray count] > 0){
            NSDictionary *data = [NSDictionary dictionaryWithObject:mutableArray forKey:@"beacons"];

            CDVPluginResult* pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsDictionary:data];

            [pluginResult setKeepCallback:[NSNumber numberWithBool:YES]];

            dispatch_async(dispatch_get_main_queue(), ^{
                [self.commandDelegate sendPluginResult:pluginResult callbackId:self.callbackId];
            });
        }
    }
}

-(NSString*) getBeaconColorName:(int) color {
  NSDictionary *colors =
  @{
    @(ESTBeaconColorUnknown) : @"Unknown",
    @(ESTBeaconColorMint) : @"Mint",
    @(ESTBeaconColorIce) : @"Ice",
    @(ESTBeaconColorBlueberry) : @"Blueberry",
    @(ESTBeaconColorWhite) : @"White",
    @(ESTBeaconColorTransparent) : @"Transparent",
    };
  return [colors objectForKey:@(color)];
}

- (void)stopRanging:(CDVInvokedUrlCommand*)command
{
    [self.beaconManager stopRangingBeaconsInRegion:self.region];
}


@end
