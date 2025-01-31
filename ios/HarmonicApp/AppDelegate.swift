import UIKit
import React
import React_RCTAppDelegate
import ReactAppDependencyProvider
import Firebase
import FirebaseCore

@main
class AppDelegate: RCTAppDelegate {
  override func application(_ application: UIApplication, didFinishLaunchingWithOptions launchOptions: [UIApplication.LaunchOptionsKey : Any]? = nil) -> Bool {
    
    // Firebase initialization
    FirebaseApp.configure()
    
    // React Native initialization
    self.moduleName = "HarmonicApp"
    self.dependencyProvider = RCTAppDependencyProvider()

    // Custom initial props
    self.initialProps = [:]

    return super.application(application, didFinishLaunchingWithOptions: launchOptions)
  }

  // Handle incoming URLs for OAuth redirects (e.g., Microsoft sign-in)
  override func application(
    _ application: UIApplication,
    open url: URL,
    options: [UIApplication.OpenURLOptionsKey : Any] = [:]
  ) -> Bool {
    // Handle URL redirection from Microsoft OAuth login
    if RCTLinkingManager.application(application, open: url, options: options) {
      return true
    }
    
    return super.application(application, open: url, options: options)
  }

  // Return the source URL for React Native bundle
  override func sourceURL(for bridge: RCTBridge) -> URL? {
    return self.bundleURL()
  }

  // Bundle URL for development or production
  override func bundleURL() -> URL? {
  #if DEBUG
    return RCTBundleURLProvider.sharedSettings().jsBundleURL(forBundleRoot: "index")
  #else
    return Bundle.main.url(forResource: "main", withExtension: "jsbundle")
  #endif
  }
}
