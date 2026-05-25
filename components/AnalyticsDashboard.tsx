import React from "react";
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, PieChart, Pie, Cell } from "recharts";
import { TrendingUp, Users, MessageSquare, CheckCircle } from "lucide-react";

interface AnalyticsData {
  summary: {
    totalLeads: number;
    newLeads: number;
    wonLeads: number;
    lostLeads: number;
    totalConversations: number;
    messagesCount: number;
    followUpsSent: number;
    followupsCompleted: number;
    conversionRate: number;
  };
  daily: Array<{
    date: string;
    totalLeads: number;
    newLeads: number;
    leadsWon: number;
    followUpsSent: number;
  }>;
}

interface AnalyticsDashboardProps {
  data: AnalyticsData;
}

export function AnalyticsDashboard({ data }: AnalyticsDashboardProps) {
  const COLORS = ["#3b82f6", "#ef4444", "#10b981"];

  const conversionData = [
    { name: "Won", value: data.summary.wonLeads },
    { name: "Lost", value: data.summary.lostLeads },
    { name: "Active", value: Math.max(0, data.summary.totalLeads - data.summary.wonLeads - data.summary.lostLeads) },
  ];

  return (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <MetricCard
          title="Total Leads"
          value={data.summary.totalLeads}
          icon={Users}
          change={data.summary.newLeads}
          changeLabel="new this period"
        />
        <MetricCard
          title="Conversion Rate"
          value={`${data.summary.conversionRate.toFixed(1)}%`}
          icon={TrendingUp}
          change={data.summary.wonLeads}
          changeLabel="won"
        />
        <MetricCard
          title="Messages"
          value={data.summary.messagesCount}
          icon={MessageSquare}
          change={data.summary.followUpsSent}
          changeLabel="follow-ups sent"
        />
        <MetricCard
          title="Follow-ups Completed"
          value={data.summary.followupsCompleted}
          icon={CheckCircle}
          change={Math.round((data.summary.followupsCompleted / Math.max(1, data.summary.followUpsSent)) * 100)}
          changeLabel="completion rate %"
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Daily Trend */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Daily Trend</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={data.daily}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="newLeads" stroke="#3b82f6" />
              <Line type="monotone" dataKey="leadsWon" stroke="#10b981" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Conversion Pie Chart */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Lead Status Distribution</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={conversionData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, value }) => `${name}: ${value}`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {COLORS.map((color, index) => (
                  <Cell key={`cell-${index}`} fill={color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Follow-ups Sent Bar Chart */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Follow-ups Activity</h3>
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={data.daily}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="followUpsSent" fill="#3b82f6" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

interface MetricCardProps {
  title: string;
  value: string | number;
  icon: any;
  change?: number;
  changeLabel?: string;
}

function MetricCard({ title, value, icon: Icon, change, changeLabel }: MetricCardProps) {
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-600 mb-1">{title}</p>
          <p className="text-3xl font-bold text-gray-900">{value}</p>
          {change !== undefined && (
            <p className="text-xs text-gray-500 mt-2">
              {change} {changeLabel}
            </p>
          )}
        </div>
        <Icon className="w-8 h-8 text-gray-400" />
      </div>
    </div>
  );
}
