// Security Utilities for Incognito Detection and Error Handling

export interface SecurityError {
  success: false;
  error: string;
  message: string;
  statusCode: number;
  blocked: boolean;
  incognitoDetected?: boolean;
  multipleTabsDetected?: boolean;
  ipBlocked?: boolean;
  timeRemaining?: number;
  details?: {
    solution?: string;
    browser?: string;
    score?: number;
    threshold?: number;
    activeTabs?: number;
    maxAllowed?: number;
    lastVoteTime?: string;
  };
}

export interface SecurityModalProps {
  title: string;
  message: string;
  type: "error" | "warning" | "info";
  onClose?: () => void;
}

// Security error types
export const SECURITY_ERRORS = {
  INCOGNITO_MODE_DETECTED: "INCOGNITO_MODE_DETECTED",
  MULTIPLE_TABS_DETECTED: "MULTIPLE_TABS_DETECTED",
  IP_BLOCKED: "IP_BLOCKED",
} as const;

// Status codes
export const STATUS_CODES = {
  INCOGNITO_BLOCKED: 451,
  RATE_LIMITED: 429,
} as const;

// Handle security errors from API responses
export function handleSecurityError(data: SecurityError): void {
  switch (data.error) {
    case SECURITY_ERRORS.INCOGNITO_MODE_DETECTED:
      showIncognitoError(data);
      break;
    case SECURITY_ERRORS.MULTIPLE_TABS_DETECTED:
      showMultipleTabsError(data);
      break;
    case SECURITY_ERRORS.IP_BLOCKED:
      showIPBlockedError(data);
      break;
    default:
      showGenericError(data.message);
  }
}

// Show incognito mode error
export function showIncognitoError(data: SecurityError): void {
  const message = `
    🚫 Incognito Mode Detected
    
    ${data.message}
    
    ${data.details?.solution ? `Solution: ${data.details.solution}` : ""}
    
    ${data.details?.browser ? `Detected Browser: ${data.details.browser}` : ""}
    ${
      data.details?.score
        ? `Detection Score: ${data.details.score}/${data.details.threshold}`
        : ""
    }
  `;

  showSecurityModal("Security Alert", message, "error");
}

// Show multiple tabs error
export function showMultipleTabsError(data: SecurityError): void {
  const message = `
    🚫 Multiple Tabs Detected
    
    ${data.message}
    
    ${data.details?.activeTabs ? `Active Tabs: ${data.details.activeTabs}` : ""}
    ${
      data.details?.maxAllowed
        ? `Maximum Allowed: ${data.details.maxAllowed}`
        : ""
    }
    
    ${data.details?.solution ? `Solution: ${data.details.solution}` : ""}
  `;

  showSecurityModal("Security Alert", message, "warning");
}

// Show IP blocked error
export function showIPBlockedError(data: SecurityError): void {
  const message = `
    🚫 IP Address Blocked
    
    ${data.message}
    
    ${data.timeRemaining ? `Time Remaining: ${data.timeRemaining} hours` : ""}
    ${
      data.details?.lastVoteTime
        ? `Last Vote: ${new Date(data.details.lastVoteTime).toLocaleString(
            "en-US",
            {
              hour: "numeric",
              minute: "2-digit",
              hour12: true,
              month: "2-digit",
              day: "2-digit",
              year: "numeric",
            }
          )}`
        : ""
    }
    
    ${data.details?.solution ? `Solution: ${data.details.solution}` : ""}
  `;

  showSecurityModal("Access Blocked", message, "error");
}

// Show generic error
export function showGenericError(message: string): void {
  showSecurityModal("Error", message, "error");
}

// Show security modal
export function showSecurityModal(
  title: string,
  message: string,
  type: "error" | "warning" | "info" = "info"
): void {
  // Remove any existing security modals
  const existingModal = document.querySelector(".security-modal");
  if (existingModal) {
    existingModal.remove();
  }

  const modal = document.createElement("div");
  modal.className = `security-modal ${type}`;
  modal.innerHTML = `
    <div class="modal-content">
      <div class="modal-header">
        <h2 class="modal-title">${title}</h2>
        <button class="modal-close" onclick="this.closest('.security-modal').remove()">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>
      </div>
      <div class="modal-body">
        <div class="message">${message.replace(/\n/g, "<br>")}</div>
      </div>
      <div class="modal-footer">
        <button class="modal-button" onclick="this.closest('.security-modal').remove()">
          OK
        </button>
      </div>
    </div>
  `;

  // Add styles if not already present
  if (!document.querySelector("#security-modal-styles")) {
    const style = document.createElement("style");
    style.id = "security-modal-styles";
    style.textContent = `
      .security-modal {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0,0,0,0.8);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 9999;
        backdrop-filter: blur(4px);
      }

      .modal-content {
        background: white;
        border-radius: 12px;
        max-width: 500px;
        width: 90%;
        max-height: 80vh;
        overflow-y: auto;
        box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
        animation: modalSlideIn 0.3s ease-out;
      }

      @keyframes modalSlideIn {
        from {
          opacity: 0;
          transform: translateY(-20px) scale(0.95);
        }
        to {
          opacity: 1;
          transform: translateY(0) scale(1);
        }
      }

      .modal-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 20px 24px 0 24px;
        border-bottom: 1px solid #e5e7eb;
        padding-bottom: 16px;
      }

      .modal-title {
        font-size: 1.25rem;
        font-weight: 600;
        color: #111827;
        margin: 0;
      }

      .modal-close {
        background: none;
        border: none;
        cursor: pointer;
        padding: 4px;
        border-radius: 4px;
        color: #6b7280;
        transition: all 0.2s;
      }

      .modal-close:hover {
        background: #f3f4f6;
        color: #374151;
      }

      .modal-body {
        padding: 20px 24px;
      }

      .message {
        color: #374151;
        line-height: 1.6;
        white-space: pre-line;
      }

      .modal-footer {
        padding: 0 24px 20px 24px;
        display: flex;
        justify-content: flex-end;
      }

      .modal-button {
        background: #3b82f6;
        color: white;
        border: none;
        padding: 10px 20px;
        border-radius: 6px;
        font-weight: 500;
        cursor: pointer;
        transition: all 0.2s;
      }

      .modal-button:hover {
        background: #2563eb;
      }

      .security-modal.error .modal-content {
        border-left: 5px solid #ef4444;
      }

      .security-modal.warning .modal-content {
        border-left: 5px solid #f59e0b;
      }

      .security-modal.info .modal-content {
        border-left: 5px solid #3b82f6;
      }

      .security-modal.error .modal-title {
        color: #dc2626;
      }

      .security-modal.warning .modal-title {
        color: #d97706;
      }
    `;
    document.head.appendChild(style);
  }

  document.body.appendChild(modal);
}

// Check if response is a security error
export function isSecurityError(data: any): data is SecurityError {
  return (
    data &&
    typeof data === "object" &&
    data.success === false &&
    data.blocked === true &&
    (data.statusCode === STATUS_CODES.INCOGNITO_BLOCKED ||
      data.statusCode === STATUS_CODES.RATE_LIMITED)
  );
}

// Enhanced API client with security handling
export async function secureApiCall<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  try {
    const response = await fetch(endpoint, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        "X-Requested-With": "XMLHttpRequest",
        ...options.headers,
      },
      // credentials: 'include',
    });

    const data = await response.json();

    // Check for security errors first
    if (isSecurityError(data)) {
      handleSecurityError(data);
      throw new Error(data.message);
    }

    // Handle other errors
    if (!response.ok) {
      throw new Error(data.message || data.error || "Request failed");
    }

    return data;
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error("An unexpected error occurred");
  }
}
