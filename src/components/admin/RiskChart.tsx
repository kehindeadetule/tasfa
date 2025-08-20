"use client";

interface RiskLevels {
  high: number;
  medium: number;
  low: number;
}

interface RiskChartProps {
  data: RiskLevels;
}

export function RiskChart({ data }: RiskChartProps) {
  const total = data?.high + data?.medium + data?.low;

  const getPercentage = (value: number) => {
    return total > 0 ? (value / total) * 100 : 0;
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        Risk Level Distribution
      </h3>

      <div className="space-y-4">
        {/* High Risk */}
        <div>
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-red-700">High Risk</span>
            <span className="text-sm text-gray-600">
              {data?.high} IPs ({getPercentage(data?.high).toFixed(1)}%)
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div
              className="bg-red-600 h-3 rounded-full"
              style={{ width: `${getPercentage(data?.high)}%` }}
            ></div>
          </div>
        </div>

        {/* Medium Risk */}
        <div>
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-yellow-700">
              Medium Risk
            </span>
            <span className="text-sm text-gray-600">
              {data?.medium} IPs ({getPercentage(data?.medium).toFixed(1)}%)
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div
              className="bg-yellow-500 h-3 rounded-full"
              style={{ width: `${getPercentage(data?.medium)}%` }}
            ></div>
          </div>
        </div>

        {/* Low Risk */}
        <div>
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-green-700">Low Risk</span>
            <span className="text-sm text-gray-600">
              {data?.low} IPs ({getPercentage(data?.low).toFixed(1)}%)
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div
              className="bg-green-500 h-3 rounded-full"
              style={{ width: `${getPercentage(data?.low)}%` }}
            ></div>
          </div>
        </div>
      </div>

      <div className="mt-4 pt-4 border-t border-gray-200">
        <div className="text-center">
          <span className="text-2xl font-bold text-gray-900">{total}</span>
          <div className="text-sm text-gray-600">Total Suspicious IPs</div>
        </div>
      </div>
    </div>
  );
}
