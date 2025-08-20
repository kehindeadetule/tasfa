"use client";

interface DeviceStats {
  totalIPs: number;
  multiDeviceIPs: number;
}

interface DeviceChartProps {
  data: DeviceStats;
}

export function DeviceChart({ data }: DeviceChartProps) {
  const singleDeviceIPs = data?.totalIPs - data?.multiDeviceIPs;
  const multiDevicePercentage =
    data?.totalIPs > 0 ? (data?.multiDeviceIPs / data?.totalIPs) * 100 : 0;
  const singleDevicePercentage = 100 - multiDevicePercentage;

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        Device Usage Analysis
      </h3>

      <div className="space-y-4">
        {/* Multi-Device IPs */}
        <div>
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-red-700">
              Multi-Device IPs
            </span>
            <span className="text-sm text-gray-600">
              {data?.multiDeviceIPs} IPs ({multiDevicePercentage.toFixed(1)}%)
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div
              className="bg-red-600 h-3 rounded-full"
              style={{ width: `${multiDevicePercentage}%` }}
            ></div>
          </div>
          <div className="text-xs text-gray-500 mt-1">
            IPs using multiple devices (suspicious activity)
          </div>
        </div>

        {/* Single Device IPs */}
        <div>
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-green-700">
              Single Device IPs
            </span>
            <span className="text-sm text-gray-600">
              {singleDeviceIPs} IPs ({singleDevicePercentage.toFixed(1)}%)
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div
              className="bg-green-500 h-3 rounded-full"
              style={{ width: `${singleDevicePercentage}%` }}
            ></div>
          </div>
          <div className="text-xs text-gray-500 mt-1">
            IPs using single device (normal activity)
          </div>
        </div>
      </div>

      <div className="mt-6 pt-4 border-t border-gray-200">
        <div className="grid grid-cols-2 gap-4 text-center">
          <div>
            <div className="text-2xl font-bold text-red-600">
              {data?.multiDeviceIPs}
            </div>
            <div className="text-sm text-gray-600">Multi-Device</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-green-600">
              {singleDeviceIPs}
            </div>
            <div className="text-sm text-gray-600">Single Device</div>
          </div>
        </div>
      </div>

      <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
        <div className="text-sm text-yellow-800">
          <strong>Alert:</strong> {data?.multiDeviceIPs} IP addresses are using
          multiple devices, which may indicate coordinated voting or automated
          activity.
        </div>
      </div>
    </div>
  );
}
