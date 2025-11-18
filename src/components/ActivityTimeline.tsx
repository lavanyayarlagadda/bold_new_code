import React from "react";
import { formatDistanceToNow } from "date-fns";

interface ActivityLog {
  logId: number;
  action: string;
  fullName: string;
  timeStamp: string;
}

interface ActivityTimelineProps {
  logs: ActivityLog[];
}

const ActivityTimeline: React.FC<ActivityTimelineProps> = ({ logs }) => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">
        Activity Timeline
      </h2>

      {logs.length > 0 ? (
        <div className="space-y-4">
          {logs.map((log, index) => (
            <div key={log.logId || index} className="flex space-x-3">
              {/* 🔹 Timeline dot (different colors if you want variety) */}
              <div
                className={`w-2 h-2 rounded-full mt-2 ${
                  index % 4 === 0
                    ? "bg-green-500"
                    : index % 4 === 1
                    ? "bg-blue-500"
                    : index % 4 === 2
                    ? "bg-orange-500"
                    : "bg-purple-500"
                }`}
              ></div>

              {/* 🔹 Activity text */}
              <div className="flex-1">
                <p className="text-sm text-gray-900">
                  {log.action} by{" "}
                  <span className="font-medium text-gray-800">{log.fullName}</span>
                </p>
                <p className="text-xs text-gray-500">
                  {formatDistanceToNow(new Date(log.timeStamp), {
                    addSuffix: true,
                  })}
                </p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-sm text-gray-500">No activity found</p>
      )}
    </div>
  );
};

export default ActivityTimeline;
