"use client";

import { useState, useCallback } from "react";
import {
  SecurityError,
  handleSecurityError,
  isSecurityError,
  SECURITY_ERRORS,
  STATUS_CODES,
} from "@/utils/securityUtils";
import { API_ENDPOINTS } from "@/config/api";

export interface SecurityState {
  isBlocked: boolean;
  blockedReason: string | null;
  timeRemaining: number | null;
  lastError: SecurityError | null;
}

export interface UseSecurityReturn {
  securityState: SecurityState;
  checkVotingStatus: () => Promise<boolean>;
  submitVote: (voteData: any) => Promise<boolean>;
  clearSecurityError: () => void;
  isSecurityError: (data: any) => data is SecurityError;
}

export const useSecurity = (): UseSecurityReturn => {
  const [securityState, setSecurityState] = useState<SecurityState>({
    isBlocked: false,
    blockedReason: null,
    timeRemaining: null,
    lastError: null,
  });

  const clearSecurityError = useCallback(() => {
    setSecurityState({
      isBlocked: false,
      blockedReason: null,
      timeRemaining: null,
      lastError: null,
    });
  }, []);

  const handleSecurityResponse = useCallback((data: any): boolean => {
    if (isSecurityError(data)) {
      setSecurityState({
        isBlocked: true,
        blockedReason: data.error,
        timeRemaining: data.timeRemaining || null,
        lastError: data,
      });

      // Show the security modal
      handleSecurityError(data);
      return false;
    }
    return true;
  }, []);

  const checkVotingStatus = useCallback(async (): Promise<boolean> => {
    try {
      const response = await fetch(API_ENDPOINTS.votingStatus, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "X-Requested-With": "XMLHttpRequest",
        },
        // credentials: 'include',
      });

      const data = await response.json();

      // Handle security errors
      if (!handleSecurityResponse(data)) {
        return false;
      }

      // Handle other errors
      if (!response.ok) {
        console.error("Voting status check failed:", data);
        return false;
      }

      return true;
    } catch (error) {
      console.error("Error checking voting status:", error);
      return false;
    }
  }, [handleSecurityResponse]);

  const submitVote = useCallback(
    async (voteData: any): Promise<boolean> => {
      try {
        const response = await fetch(API_ENDPOINTS.votes, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "X-Requested-With": "XMLHttpRequest",
          },
          // credentials: 'include',
          body: JSON.stringify(voteData),
        });

        const data = await response.json();

        // Handle security errors first
        if (!handleSecurityResponse(data)) {
          return false;
        }

        // Handle other errors
        if (!response.ok) {
          console.error("Vote submission failed:", data);
          return false;
        }

        return true;
      } catch (error) {
        console.error("Error submitting vote:", error);
        return false;
      }
    },
    [handleSecurityResponse]
  );

  return {
    securityState,
    checkVotingStatus,
    submitVote,
    clearSecurityError,
    isSecurityError,
  };
};

