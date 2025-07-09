import { useEffect, useRef } from "react";
import { useVotingStatus } from "./useVotingStatus";

interface NotificationOptions {
  enabled?: boolean;
  sound?: boolean;
}

export const useVotingNotifications = (options: NotificationOptions = {}) => {
  const { enabled = false, sound = true } = options;
  const { getPendingCategories } = useVotingStatus();
  const permissionGranted = useRef(false);
  const notifiedCategories = useRef(new Set<string>());

  // Request notification permission
  const requestPermission = async (): Promise<boolean> => {
    if (!("Notification" in window)) {
      console.warn("This browser does not support notifications");
      return false;
    }

    if (Notification.permission === "granted") {
      permissionGranted.current = true;
      return true;
    }

    if (Notification.permission === "denied") {
      return false;
    }

    try {
      const permission = await Notification.requestPermission();
      const granted = permission === "granted";
      permissionGranted.current = granted;
      return granted;
    } catch (error) {
      console.error("Error requesting notification permission:", error);
      return false;
    }
  };

  const showNotification = (categoryName: string) => {
    if (
      !permissionGranted.current ||
      notifiedCategories.current.has(categoryName)
    ) {
      return;
    }

    const notification = new Notification("TASFA 2025 - Voting Available!", {
      body: `You can now vote for "${categoryName}"`,
      icon: "/favicon.ico",
      tag: `voting-${categoryName}`, // Prevent duplicate notifications
      requireInteraction: true, // Keep notification visible until user interacts
    });

    notification.onclick = () => {
      // Focus the window and navigate to the category page
      window.focus();
      const categorySlug = categoryName
        .toLowerCase()
        .replace(/\s+/g, "-")
        .replace(/\(/g, "")
        .replace(/\)/g, "");

      window.location.href = `/awards/category/${categorySlug}`;
      notification.close();
    };

    // Play notification sound if enabled
    if (sound) {
      playNotificationSound();
    }

    // Mark this category as notified
    notifiedCategories.current.add(categoryName);

    // Auto-close notification after 10 seconds
    setTimeout(() => {
      notification.close();
    }, 10000);
  };

  const playNotificationSound = () => {
    try {
      // Create a simple notification sound using Web Audio API
      const audioContext = new (window.AudioContext ||
        (window as any).webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);

      oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
      oscillator.frequency.setValueAtTime(600, audioContext.currentTime + 0.1);

      gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(
        0.01,
        audioContext.currentTime + 0.3
      );

      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.3);
    } catch (error) {
      console.warn("Could not play notification sound:", error);
    }
  };

  const checkForAvailableVoting = () => {
    if (!enabled || !permissionGranted.current) return;

    const pendingCategories = getPendingCategories();

    // Check if any categories have become available since last check
    pendingCategories.forEach((vote) => {
      const nextVoteTime = new Date(vote.nextVoteTime);
      const now = new Date();

      // If voting time has passed and we haven't notified for this category
      if (
        now >= nextVoteTime &&
        !notifiedCategories.current.has(vote.category)
      ) {
        showNotification(vote.category);
      }
    });
  };

  const clearNotifiedCategories = () => {
    notifiedCategories.current.clear();
  };

  // Check for available voting every minute when enabled
  useEffect(() => {
    if (!enabled) return;

    const interval = setInterval(checkForAvailableVoting, 60000); // Check every minute

    // Also check immediately
    checkForAvailableVoting();

    return () => clearInterval(interval);
  }, [enabled, getPendingCategories]);

  // Initial permission request when enabled
  useEffect(() => {
    if (enabled) {
      requestPermission();
    }
  }, [enabled]);

  return {
    requestPermission,
    showNotification,
    clearNotifiedCategories,
    permissionGranted: permissionGranted.current,
    isSupported: "Notification" in window,
  };
};
