import React from "react";
import { Bell, X } from "lucide-react";
import { getRelativeTime } from "@/lib/utils";

interface Notification {
  id: string;
  title: string;
  message: string;
  type: string;
  read: boolean;
  createdAt: Date | string;
  actionUrl?: string;
}

interface NotificationCenterProps {
  notifications: Notification[];
  unreadCount: number;
  onMarkAsRead?: (notificationId: string) => void;
  onDelete?: (notificationId: string) => void;
  onClose?: () => void;
}

export function NotificationCenter({
  notifications,
  unreadCount,
  _onMarkAsRead,
  onDelete,
  onClose,
}: NotificationCenterProps & { _onMarkAsRead?: any }) {
  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "NEW_MESSAGE":
        return "💬";
      case "OVERDUE_FOLLOWUP":
        return "⏰";
      case "LEAD_ASSIGNED":
        return "👤";
      case "TEAM_MEMBER_JOINED":
        return "👥";
      default:
        return "📢";
    }
  };

  return (
    <div className="w-96 bg-white rounded-lg shadow-lg border border-gray-200">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        <div className="flex items-center gap-2">
          <Bell className="w-5 h-5 text-gray-700" />
          <h2 className="font-semibold text-gray-900">Notifications</h2>
          {unreadCount > 0 && (
            <span className="bg-red-500 text-white text-xs font-bold rounded-full px-2 py-1">
              {unreadCount}
            </span>
          )}
        </div>
        {onClose && (
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Notifications List */}
      <div className="max-h-96 overflow-y-auto">
        {notifications.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            <Bell className="w-12 h-12 mx-auto mb-2 opacity-20" />
            <p>No notifications yet</p>
          </div>
        ) : (
          notifications.map((notification) => (
            <div
              key={notification.id}
              className={`p-4 border-b border-gray-100 hover:bg-gray-50 transition-colors ${
                !notification.read ? "bg-blue-50" : ""
              }`}
            >
              <div className="flex gap-3">
                <div className="text-2xl flex-shrink-0">
                  {getNotificationIcon(notification.type)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="font-semibold text-gray-900 text-sm">
                      {notification.title}
                    </h3>
                    {onDelete && (
                      <button
                        onClick={() => onDelete(notification.id)}
                        className="text-gray-400 hover:text-red-500 flex-shrink-0"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                  <p className="text-sm text-gray-600 mt-1">{notification.message}</p>
                  <p className="text-xs text-gray-500 mt-2">
                    {getRelativeTime(notification.createdAt)}
                  </p>
                  {notification.actionUrl && (
                    <a
                      href={notification.actionUrl}
                      className="text-xs text-blue-600 hover:underline mt-2 inline-block"
                    >
                      View Details →
                    </a>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Footer */}
      {notifications.length > 0 && (
        <div className="p-3 border-t border-gray-200 text-center">
          <a href="/dashboard/notifications" className="text-sm text-blue-600 hover:underline">
            View all notifications
          </a>
        </div>
      )}
    </div>
  );
}
