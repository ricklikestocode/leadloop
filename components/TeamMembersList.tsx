import React from "react";
import { Users, Plus, Trash2, Shield } from "lucide-react";

interface TeamMember {
  id: string;
  user: {
    id: string;
    name: string;
    email: string;
    image?: string;
  };
  role: string;
  joinedAt: Date | string;
}

interface TeamMembersListProps {
  members: TeamMember[];
  currentUserRole: string;
  onInvite?: () => void;
  onRemove?: (userId: string) => void;
  onRoleChange?: (userId: string, role: string) => void;
}

export function TeamMembersList({
  members,
  currentUserRole,
  onInvite,
  onRemove,
  _onRoleChange,
}: TeamMembersListProps & { _onRoleChange?: any }) {
  const isAdmin = ["OWNER", "ADMIN"].includes(currentUserRole);

  const getRoleColor = (role: string) => {
    switch (role) {
      case "OWNER":
        return "bg-purple-100 text-purple-800";
      case "ADMIN":
        return "bg-blue-100 text-blue-800";
      case "AGENT":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200">
      {/* Header */}
      <div className="flex items-center justify-between p-6 border-b border-gray-200">
        <div className="flex items-center gap-2">
          <Users className="w-5 h-5 text-gray-700" />
          <h2 className="font-semibold text-gray-900">Team Members</h2>
          <span className="text-sm text-gray-500">({members.length})</span>
        </div>
        {isAdmin && onInvite && (
          <button
            onClick={onInvite}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-4 h-4" />
            Invite Member
          </button>
        )}
      </div>

      {/* Members List */}
      <div className="divide-y divide-gray-200">
        {members.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            <Users className="w-12 h-12 mx-auto mb-2 opacity-20" />
            <p>No team members yet</p>
          </div>
        ) : (
          members.map((member) => (
            <div
              key={member.id}
              className="p-6 flex items-center justify-between hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center gap-4">
                {member.user.image ? (
                  <img
                    src={member.user.image}
                    alt={member.user.name}
                    className="w-10 h-10 rounded-full"
                  />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white font-semibold">
                    {member.user.name?.charAt(0).toUpperCase()}
                  </div>
                )}
                <div>
                  <p className="font-medium text-gray-900">{member.user.name}</p>
                  <p className="text-sm text-gray-500">{member.user.email}</p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className={`px-3 py-1 rounded-full text-sm font-medium ${getRoleColor(member.role)}`}>
                  <div className="flex items-center gap-1">
                    <Shield className="w-3 h-3" />
                    {member.role}
                  </div>
                </div>

                {isAdmin && currentUserRole === "OWNER" && (
                  <button
                    onClick={() => onRemove?.(member.user.id)}
                    className="text-red-600 hover:text-red-700 p-2 rounded hover:bg-red-50 transition-colors"
                    title="Remove member"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
