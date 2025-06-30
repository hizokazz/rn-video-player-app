//
//  Downloader.swift
//  VideoPlayerApp
//
//  Created by Nuttapong Dankul on 27/6/2568 BE.
//

import Foundation
import React
import UIKit

@objcMembers class Downloader: NSObject {
  func downloadFile(url: NSString, fileName: NSString, fileExtension: NSString) {
    let _url = URL(string: url as String)
    let documentUrl: URL =
      (FileManager.default.urls(for: .documentDirectory, in: .userDomainMask).first as URL?)!
    let destinationUrl = documentUrl.appendingPathComponent("\(fileName)\(UUID()).\(fileExtension)")
    let fileUrl = URL(string: url as String)
    let sessionCfg = URLSessionConfiguration.default
    let session = URLSession(configuration: sessionCfg)
    let request = URLRequest(url: fileUrl!)

    let task = session.downloadTask(with: request) { (temp, response, error) in
      if let temp = temp, error == nil {
        do {
          try FileManager.default.copyItem(at: temp, to: destinationUrl)
          do {
            let contents = try FileManager.default.contentsOfDirectory(
              at: documentUrl, includingPropertiesForKeys: nil, options: .skipsHiddenFiles)

            for index in 0..<contents.count {
              if contents[index].lastPathComponent == destinationUrl.lastPathComponent {
                let activityViewController = UIActivityViewController(
                  activityItems: [contents[index]], applicationActivities: nil)
                let presentedViewController = RCTPresentedViewController()
                DispatchQueue.main.async {
                  presentedViewController?.present(
                    activityViewController, animated: true, completion: nil)
                }
              }
            }
          } catch (let err) {
            print("error: \(err)")
          }
        } catch (let err) {
          print(err)
        }
      } else {
        print(error)
      }
    }
    task.resume()
  }
}
