"use client";

interface IPDetails {
  ipAddress: string;
  riskScore: number;
  riskLevel: "high" | "medium" | "low";
  sessionCount: number;
  totalVotes: number;
  categoriesVoted: string[];
  incognitoUsage: {
    percentage: number;
    sessions: number;
    totalSessions: number;
    votes: number;
    totalVotes: number;
    indicators: string[];
  };
  participants: Array<{
    participantName: string;
    category: string;
    votes: Array<{
      votedAt: string;
      deviceType: string;
      isIncognito: boolean;
      incognitoScore: number;
    }>;
  }>;
  sessions: Array<{
    sessionId: string;
    userAgent: string;
    voteCount: number;
    deviceType: string;
    isIncognito: boolean;
  }>;
}

interface IPDetailsModalProps {
  ipData: IPDetails;
  onClose: () => void;
}

export function IPDetailsModal({ ipData, onClose }: IPDetailsModalProps) {
  const getRiskColor = (riskLevel: string) => {
    switch (riskLevel) {
      case "high":
        return "bg-red-100 text-red-800";
      case "medium":
        return "bg-yellow-100 text-yellow-800";
      case "low":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-20 mx-auto p-5 border w-11/12 max-w-4xl shadow-lg rounded-md bg-white">
        <div className="mt-3">
          {/* Header */}
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-medium text-gray-900">
              IP Details: {ipData.ipAddress}
            </h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <svg
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          {/* Risk Summary */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="text-sm text-gray-600">Risk Score</div>
              <div className="text-2xl font-bold text-gray-900">
                {ipData.riskScore}
              </div>
              <span
                className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full mt-2 ${getRiskColor(
                  ipData.riskLevel
                )}`}
              >
                {ipData.riskLevel} risk
              </span>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="text-sm text-gray-600">Total Votes</div>
              <div className="text-2xl font-bold text-gray-900">
                {ipData.totalVotes}
              </div>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="text-sm text-gray-600">Sessions</div>
              <div className="text-2xl font-bold text-gray-900">
                {ipData.sessionCount}
              </div>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="text-sm text-gray-600">Incognito %</div>
              <div className="text-2xl font-bold text-red-600">
                {ipData.incognitoUsage.percentage.toFixed(1)}%
              </div>
            </div>
          </div>

          {/* Incognito Usage Details */}
          <div className="mb-6">
            <h4 className="text-md font-semibold text-gray-900 mb-3">
              Incognito Usage Analysis
            </h4>
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div>
                  <span className="text-gray-600">Incognito Sessions:</span>
                  <span className="font-semibold ml-2">
                    {ipData.incognitoUsage.sessions}/
                    {ipData.incognitoUsage.totalSessions}
                  </span>
                </div>
                <div>
                  <span className="text-gray-600">Incognito Votes:</span>
                  <span className="font-semibold ml-2">
                    {ipData.incognitoUsage.votes}/
                    {ipData.incognitoUsage.totalVotes}
                  </span>
                </div>
                <div>
                  <span className="text-gray-600">Percentage:</span>
                  <span className="font-semibold text-red-600 ml-2">
                    {ipData.incognitoUsage.percentage.toFixed(1)}%
                  </span>
                </div>
              </div>
              {ipData.incognitoUsage.indicators.length > 0 && (
                <div className="mt-3">
                  <div className="text-sm text-gray-600 mb-1">
                    Detection Indicators:
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {ipData.incognitoUsage.indicators.map(
                      (indicator, index) => (
                        <span
                          key={index}
                          className="bg-red-100 text-red-800 text-xs px-2 py-1 rounded"
                        >
                          {indicator}
                        </span>
                      )
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Categories Voted */}
          <div className="mb-6">
            <h4 className="text-md font-semibold text-gray-900 mb-3">
              Categories Voted
            </h4>
            <div className="flex flex-wrap gap-2">
              {ipData.categoriesVoted.map((category, index) => (
                <span
                  key={index}
                  className="bg-blue-100 text-blue-800 text-sm px-3 py-1 rounded-full"
                >
                  {category}
                </span>
              ))}
            </div>
          </div>

          {/* Affected Participants */}
          <div className="mb-6">
            <h4 className="text-md font-semibold text-gray-900 mb-3">
              Affected Participants
            </h4>
            <div className="space-y-3">
              {ipData.participants.map((participant, index) => (
                <div
                  key={index}
                  className="border border-gray-200 rounded-lg p-4"
                >
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <div className="font-medium text-gray-900">
                        {participant.participantName}
                      </div>
                      <div className="text-sm text-gray-600">
                        {participant.category}
                      </div>
                    </div>
                    <div className="text-sm text-gray-500">
                      {participant.votes.length} votes
                    </div>
                  </div>
                  <div className="text-xs text-gray-500">
                    {participant.votes.filter((v) => v.isIncognito).length}{" "}
                    incognito votes
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Sessions */}
          <div className="mb-6">
            <h4 className="text-md font-semibold text-gray-900 mb-3">
              Recent Sessions
            </h4>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                      Session ID
                    </th>
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                      Device
                    </th>
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                      Votes
                    </th>
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                      Incognito
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {ipData.sessions.slice(0, 10).map((session, index) => (
                    <tr key={index}>
                      <td className="px-3 py-2 text-xs font-mono text-gray-900">
                        {session.sessionId.slice(0, 8)}...
                      </td>
                      <td className="px-3 py-2 text-xs text-gray-900 capitalize">
                        {session.deviceType}
                      </td>
                      <td className="px-3 py-2 text-xs text-gray-900">
                        {session.voteCount}
                      </td>
                      <td className="px-3 py-2 text-xs">
                        {session.isIncognito ? (
                          <span className="text-red-600 font-semibold">
                            Yes
                          </span>
                        ) : (
                          <span className="text-gray-500">No</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Close Button */}
          <div className="flex justify-end">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
