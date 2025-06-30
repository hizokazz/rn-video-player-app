//
//  RCTNativeDownloader.m
//  VideoPlayerApp
//
//  Created by Nuttapong Dankul on 27/6/2568 BE.
//

#import "RCTNativeDownloader.h"
#import "RCTDefaultReactNativeFactoryDelegate.h"
#import "VideoPlayerApp-Swift.h"

@implementation RCTNativeDownloader

- (std::shared_ptr<facebook::react::TurboModule>)getTurboModule:
    (const facebook::react::ObjCTurboModule::InitParams &)params {
  return std::make_shared<facebook::react::NativeDownloaderSpecJSI>(params);
}

- (void)downloadFile:(NSString *)url
            filename:(NSString *)filename
           extension:(NSString *)extension
             resolve:(RCTPromiseResolveBlock)resolve
              reject:(RCTPromiseRejectBlock)reject {
  Downloader *downloader = [Downloader new];
  [downloader downloadFileWithUrl:url
                         fileName:filename
                    fileExtension:extension];
  resolve(@"Download started");
}

+ (NSString *)moduleName {
  return @"NativeDownloader";
}

@end
