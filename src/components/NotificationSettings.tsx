"use client";

import { useState, useEffect } from "react";
import { useVotingNotifications } from "@/hooks/useVotingNotifications";

export default function NotificationSettings() {
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const {
    requestPermission,
    permissionGranted,
    isSupported,
    clearNotifiedCategories,
  } = useVotingNotifications({
    enabled: notificationsEnabled,
    sound: soundEnabled,
  });

  // Load settings from localStorage on mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("voting_notification_settings");
      if (stored) {
        try {
          const settings = JSON.parse(stored);
          setNotificationsEnabled(settings.enabled || false);
          setSoundEnabled(settings.sound !== false); // Default to true
        } catch (error) {
          console.error("Error loading notification settings:", error);
        }
      }
    }
  }, []);

  // Save settings to localStorage when they change
  useEffect(() => {
    if (typeof window !== "undefined") {
      const settings = {
        enabled: notificationsEnabled,
        sound: soundEnabled,
      };
      localStorage.setItem(
        "voting_notification_settings",
        JSON.stringify(settings)
      );
    }
  }, [notificationsEnabled, soundEnabled]);

  const handleToggleNotifications = async () => {
    if (!notificationsEnabled) {
      // Trying to enable - request permission first
      const granted = await requestPermission();
      if (granted) {
        setNotificationsEnabled(true);
        clearNotifiedCategories(); // Reset notification history
      }
    } else {
      // Disabling notifications
      setNotificationsEnabled(false);
    }
  };

  if (!isSupported) {
    return (
      <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
        <div className="text-center py-4">
          <div className="text-gray-400 text-2xl mb-2">🔕</div>
          <p className="text-sm text-gray-600">
            Browser notifications are not supported
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 border border-gray-200">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-2">
            <div
              className={`w-3 h-3 rounded-full ${
                notificationsEnabled && permissionGranted
                  ? "bg-blue-500"
                  : "bg-gray-400"
              }`}
            ></div>
            <span className="text-sm font-medium text-gray-700">
              Notifications
            </span>
          </div>
        </div>
        <div className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
          {notificationsEnabled ? "Enabled" : "Disabled"}
        </div>
      </div>

      <div className="space-y-4">
        {/* Enable/Disable Toggle */}
        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
          <div>
            <h4 className="text-sm font-medium text-gray-800">
              🔔 Voting Alerts
            </h4>
            <p className="text-xs text-gray-600">
              Get notified when you can vote again
            </p>
          </div>
          <button
            onClick={handleToggleNotifications}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
              notificationsEnabled && permissionGranted
                ? "bg-blue-600"
                : "bg-gray-200"
            }`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                notificationsEnabled && permissionGranted
                  ? "translate-x-6"
                  : "translate-x-1"
              }`}
            />
          </button>
        </div>

        {/* Sound Toggle */}
        {notificationsEnabled && (
          <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
            <div>
              <h4 className="text-sm font-medium text-blue-800">
                🔊 Sound Effects
              </h4>
              <p className="text-xs text-blue-600">
                Play sound with notifications
              </p>
            </div>
            <button
              onClick={() => setSoundEnabled(!soundEnabled)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                soundEnabled ? "bg-blue-600" : "bg-gray-200"
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  soundEnabled ? "translate-x-6" : "translate-x-1"
                }`}
              />
            </button>
          </div>
        )}

        {/* Status Information */}
        <div className="pt-3 border-t border-gray-200">
          <div className="text-center">
            {!permissionGranted && notificationsEnabled ? (
              <div className="text-orange-600">
                <p className="text-xs">⚠️ Permission required</p>
                <button
                  onClick={requestPermission}
                  className="text-xs text-blue-600 hover:underline mt-1"
                >
                  Enable notifications
                </button>
              </div>
            ) : notificationsEnabled && permissionGranted ? (
              <div className="text-green-600">
                <p className="text-xs">✅ Ready for alerts</p>
              </div>
            ) : (
              <div className="text-gray-500">
                <p className="text-xs">🔕 Notifications disabled</p>
              </div>
            )}
          </div>
        </div>

        {/* Help Text */}
        {notificationsEnabled && permissionGranted && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-3">
            <p className="text-xs text-green-700 text-center">
              💡 You'll be notified when voting opens for categories you've
              voted in before
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
