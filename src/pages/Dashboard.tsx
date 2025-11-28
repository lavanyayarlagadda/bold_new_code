import React, { useEffect, useState } from "react";
import {
  // TrendingUp,
  Users,
  FolderOpen,
  AlertTriangle,
  CheckCircle,
  Clock,
  FileText,
  Plus,
  UserPlus,
  Calendar,
} from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import {
  mockDashboardStats,
  mockServices,
  mockClients,
} from "../data/mockData";
import { Link } from "react-router-dom";
import { format } from "date-fns";
import {
  ServiceTask,
  useFetchServiceTasksMutation,
} from "../redux/services/serviceTasksApi";
import {
  Metric,
  useDashboardMetricsQuery,
} from "../redux/services/dashboardApi";
import TableWithPagination from "../components/TableWithPagination";
export default function Dashboard() {
  const { user } = useAuth();
  const stats = mockDashboardStats[user?.role || "client"];
  const [fetchServiceTasks, { data }] =
    useFetchServiceTasksMutation();
  const { data: metricsData } = useDashboardMetricsQuery();

  const [metrics, setMetrics] = useState<Metric>();
  console.log("metricsdata:", metricsData);

  useEffect(() => {
    if (metricsData?.data) {
      setMetrics(metricsData.data);
      console.log("Metrics", metrics);
    }
  }, [metricsData]);

  const getRecentServices = () => {
    if (user?.role === "client") {
      return mockServices.filter((s) => s.clientId === "client-1").slice(0, 3);
    }
    return mockServices.slice(0, 5);
  };

  const servicesData = Array.isArray(data?.data) ? data.data.slice(0, 5) : [];

  console.log("servicesData", servicesData);
  const getUpcomingTasks = () => {
    const allTasks = mockServices.flatMap((service) =>
      service.tasks.map((task) => ({
        ...task,
        serviceName: service.name,
        clientName:
          mockClients.find((c) => c.id === service.clientId)?.name ||
          "Unknown Client",
      }))
    );

    return allTasks
      .filter((task) => task.status !== "completed")
      .sort(
        (a, b) =>
          new Date(a.dueDate || 0).getTime() -
          new Date(b.dueDate || 0).getTime()
      )
      .slice(0, 5);
  };

  const StatCard = ({
    title,
    value,
    icon: Icon,
    color,
  }: // trend,
  {
    title: string;
    value: number;
    icon: React.ElementType;
    color: string;
    trend?: string;
  }) => (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
          {/* {trend && (
            <p className="text-xs text-green-600 mt-1 flex items-center">
              <TrendingUp className="h-3 w-3 mr-1" />
              {trend}
            </p>
          )} */}
        </div>
        <div className={`p-3 rounded-full ${color}`}>
          <Icon className="h-6 w-6 text-white" />
        </div>
      </div>
    </div>
  );

  const renderAdminView = () => (
    <>
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          title="Total Services"
          value={metrics?.totalServices ?? 0}
          icon={FolderOpen}
          color="bg-blue-500"
          trend="+12% from last month"
        />
        <StatCard
          title="Active Clients"
          value={metrics?.activeClients ?? 0}
          icon={Users}
          color="bg-green-500"
          trend="+8% from last month"
        />
        <StatCard
          title="Overdue Tasks"
          value={metrics?.overdueTasks ?? 0}
          icon={AlertTriangle}
          color="bg-red-500"
        />
        <StatCard
          title="Documents"
          value={metrics?.documentCount ?? 0}
          icon={FileText}
          color="bg-purple-500"
          trend="+24% from last month"
        />
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-8">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          Quick Actions
        </h2>
        <div className="flex flex-wrap gap-3">
          <Link
            to="/services/new"
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="h-4 w-4 mr-2" />
            New Service
          </Link>
          <Link
            to="/clients/invite"
            className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            <UserPlus className="h-4 w-4 mr-2" />
            Invite Client
          </Link>
          <Link
            to="/documents"
            className="flex items-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
          >
            <FileText className="h-4 w-4 mr-2" />
            View Documents
          </Link>
        </div>
      </div>
    </>
  );

  const renderStaffPartnerView = () => (
    <>
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          title="My Services"
          value={stats.totalServices}
          icon={FolderOpen}
          color="bg-blue-500"
        />
        <StatCard
          title="Pending Tasks"
          value={stats.pendingTasks}
          icon={Clock}
          color="bg-orange-500"
        />
        <StatCard
          title="Completed"
          value={stats.completedServices}
          icon={CheckCircle}
          color="bg-green-500"
        />
        <StatCard
          title="Overdue"
          value={stats.overdue}
          icon={AlertTriangle}
          color="bg-red-500"
        />
      </div>

      {/* My Tasks Section */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">My Tasks</h2>
          <Link
            to="/services"
            className="text-blue-600 hover:text-blue-700 text-sm font-medium"
          >
            View all →
          </Link>
        </div>
        <div className="space-y-3">
          {getUpcomingTasks().map((task) => (
            <div
              key={task.id}
              className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <div className="flex-1">
                <h4 className="font-medium text-gray-900">{task.title}</h4>
                <p className="text-sm text-gray-600">
                  {task.serviceName} • {task.clientName}
                </p>
              </div>
              <div className="flex items-center space-x-3">
                <span
                  className={`px-2 py-1 text-xs rounded-full font-medium ${
                    task.status === "in_progress"
                      ? "bg-blue-100 text-blue-700"
                      : task.status === "pending"
                      ? "bg-yellow-100 text-yellow-700"
                      : "bg-gray-100 text-gray-700"
                  }`}
                >
                  {task.status.replace("_", " ")}
                </span>
                {task.dueDate && (
                  <span className="text-xs text-gray-500">
                    Due {format(task.dueDate, "MMM d")}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );

  const renderClientView = () => (
    <>
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          title="My Services"
          value={stats.totalServices}
          icon={FolderOpen}
          color="bg-blue-500"
        />
        <StatCard
          title="In Progress"
          value={stats.activeServices}
          icon={Clock}
          color="bg-orange-500"
        />
        <StatCard
          title="Completed"
          value={stats.completedServices}
          icon={CheckCircle}
          color="bg-green-500"
        />
        <StatCard
          title="Action Required"
          value={stats.overdue}
          icon={AlertTriangle}
          color="bg-red-500"
        />
      </div>

      {/* Service Types Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Services by Type
          </h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Accounting</span>
              <div className="flex items-center space-x-2">
                <span className="text-sm font-medium">2 active</span>
                <div className="w-16 bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-blue-500 h-2 rounded-full"
                    style={{ width: "75%" }}
                  ></div>
                </div>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Tax</span>
              <div className="flex items-center space-x-2">
                <span className="text-sm font-medium">1 overdue</span>
                <div className="w-16 bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-red-500 h-2 rounded-full"
                    style={{ width: "40%" }}
                  ></div>
                </div>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600">GST</span>
              <div className="flex items-center space-x-2">
                <span className="text-sm font-medium">1 in review</span>
                <div className="w-16 bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-yellow-500 h-2 rounded-full"
                    style={{ width: "90%" }}
                  ></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Recent Notifications
          </h3>
          <div className="space-y-3">
            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-orange-500 rounded-full mt-2"></div>
              <div className="flex-1">
                <p className="text-sm text-gray-900">
                  Additional receipts needed for January expense categorization
                </p>
                <p className="text-xs text-gray-500">2 hours ago</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
              <div className="flex-1">
                <p className="text-sm text-gray-900">
                  Bank reconciliation completed for January 2024
                </p>
                <p className="text-xs text-gray-500">1 day ago</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
              <div className="flex-1">
                <p className="text-sm text-gray-900">
                  GST return Q4 2023 ready for review
                </p>
                <p className="text-xs text-gray-500">3 days ago</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-700";
      case "in_progress":
        return "bg-blue-100 text-blue-700";
      case "review":
        return "bg-yellow-100 text-yellow-700";
      case "overdue":
        return "bg-red-100 text-red-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };
  const ServiceRow = ({ service }: { service: ServiceTask }) => {
    return (
      <tr className="border-b border-gray-100 hover:bg-gray-50">
        <td className="py-4 px-4">
          <div>
            <p className="font-medium text-gray-900">
              {service.serviceName || "Untitled"}
            </p>
            <p className="text-sm text-gray-500">
              {service.serviceCategory || "N/A"}
            </p>
          </div>
        </td>
        <td className="py-4 px-4 text-sm text-gray-900">
          {/* {client?.name || "Unknown"} */}
          {service.clientName || "N/A"}
        </td>
        <td className="py-4 px-4 text-sm text-gray-900">
          {/* {Array.isArray(service?.assignedTo)
            ? service.assignedTo.join(", ")
            : service?.assignedTo || "Unassigned"} */}
          {service.assignedTo || "N/A"}
        </td>
        <td className="py-4 px-4">
          <span
            className={`px-2 py-1 text-xs rounded-full font-medium ${getStatusColor(
              service.statusName
            )}`}
          >
            {service.statusName || "N/A"}
          </span>
        </td>
        <td className="py-4 px-4">
          <div className="flex items-center space-x-2">
            <div className="flex-1 bg-gray-200 rounded-full h-2 min-w-[60px]">
              <div
                className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${service.progressPercent || 0}%` }}
              ></div>
            </div>
            <span className="text-sm text-gray-600 min-w-[35px]">
              {service.progressPercent || 0}%
            </span>
          </div>
        </td>
        <td className="py-4 px-4 text-sm text-gray-600">
          {service.dueDate
            ? format(new Date(service.dueDate), "MMM d, yyyy")
            : "-"}
        </td>
      </tr>
    );
  };
  useEffect(() => {
    fetchServiceTasks({
      // serviceName: "",
      // serviceType: "",
      // clientName: selectedClient || "",
      // statusName: selectedStatus || "",
      serviceTemplateId: 0,
      clientId: user?.clientId ? user.clientId : 0,
      statusId: 0,
    });
  }, [fetchServiceTasks]);
  return (
    <div>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Welcome back, {user?.name}!
          </h1>
          <p className="text-gray-600 mt-1">
            Here's what's happening with your{" "}
            {user?.role === "client" ? "services" : "work"} today.
          </p>
        </div>
        <div className="flex items-center space-x-2 mt-4 sm:mt-0">
          <Calendar className="h-5 w-5 text-gray-400" />
          <span className="text-sm text-gray-600">
            {format(new Date(), "EEEE, MMMM d, yyyy")}
          </span>
        </div>
      </div>

      {/* Role-specific content */}
      {/* {user?.role === 'admin' && */}
      {renderAdminView()}
      {/* } */}
      {(user?.role === "staff" || user?.role === "partner") &&
        renderStaffPartnerView()}
      {user?.role === "client" && renderClientView()}

      {/* Recent Services */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">
            {user?.role === "client" ? "My Services" : "Recent Services"}
          </h2>
          <Link
            to="/services"
            className="text-blue-600 hover:text-blue-700 text-sm font-medium"
          >
            View all →
          </Link>
        </div>

        <TableWithPagination
          columns={[
            { label: "Service", width: "w-[200px]" },
            { label: "Client" },
            { label: "Assigned To" },
            { label: "Status", width: "w-[120px]" },
            { label: "Progress" },
            { label: "Due Date" },
          ]}
          data={servicesData}
          showPagination={false}
          renderRow={(service) => (
            <ServiceRow key={service.serviceId} service={service} />
          )}
        />
      </div>
    </div>
  );
}
