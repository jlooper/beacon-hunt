#import <Cordova/CDV.h>

#import "ESTBeaconManager.h"
#import "ESTBeaconRegion.h"
#import "ESTBeacon.h"

@interface CDVEstimote : CDVPlugin<ESTBeaconManagerDelegate>

@property (nonatomic, strong) ESTBeaconManager *beaconManager;
@property (nonatomic, strong) ESTBeaconRegion *region;

@property (strong) NSString* callbackId;

- (void)startRanging:(CDVInvokedUrlCommand*)command;
- (void)stopRanging:(CDVInvokedUrlCommand*)command;


@end
