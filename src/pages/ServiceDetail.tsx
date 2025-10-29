import React, { useState } from "react";
import { useParams, Link } from "react-router-dom";
import {
  ArrowLeft,
  Calendar,
  User,
  Clock,
  // MessageSquare,
  FileText,
  CheckCircle,
  Circle,
  AlertCircle,
  Plus,
  Edit,
  Download,
  Upload,
  Send,
  // Eye,
  // EyeOff,
  ChevronDown,
  ChevronUp,
  // Settings,
  Save,
  X,
  // DeleteIcon,
  Trash2,
  Edit2,
} from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import {
  mockServices,
  mockClients,
  mockComments,
  mockDocuments,
} from "../data/mockData";
import { format, formatDistanceToNow } from "date-fns";

// Mock staff data for assignments
const mockStaff = [
  { id: "2", name: "Michael Chen", role: "Senior Accountant" },
  { id: "3", name: "Emma Williams", role: "Tax Specialist" },
  { id: "5", name: "David Rodriguez", role: "Junior Accountant" },
  { id: "6", name: "Sarah Thompson", role: "Partner" },
];

const taskStatus = [
  { id: "1", status: "Todo" },
  { id: "2", status: "InProgress" },
  { id: "3", status: "Completed" },
];

export default function ServiceDetail() {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const [newComment, setNewComment] = useState("");
  const [isInternal, setIsInternal] = useState(false);
  const [expandedTasks, setExpandedTasks] = useState<string[]>([]);
  // const [showAISummary, setShowAISummary] = useState(true);
  const [editingTask, setEditingTask] = useState<string | null>(null);
  const [taskAssignments, setTaskAssignments] = useState<
    Record<string, string>
  >({});
  const [taskDueDates, setTaskDueDates] = useState<Record<string, string>>({});
  const [isEditService, setIsEditService] = useState(false);
  const [taskStatuses, setTaskStatuses] = useState<Record<string, string>>({});

  const service = mockServices.find((s) => s.id === id);
  const client = mockClients.find((c) => c.id === service?.clientId);

  if (!service) {
    return (
      <div className="text-center py-12">
        <h2 className="text-xl font-bold text-gray-900">Service not found</h2>
        <Link
          to="/services"
          className="text-blue-600 hover:text-blue-700 mt-2 inline-block"
        >
          ← Back to Services
        </Link>
      </div>
    );
  }
  const handleTaskStatusChange = (taskId: string, newStatus: string) => {
    setTaskStatuses((prev) => ({
      ...prev,
      [taskId]: newStatus,
    }));
  };
  const handleTaskToggle = (taskId: string) => {
    if (expandedTasks.includes(taskId)) {
      setExpandedTasks(expandedTasks.filter((id) => id !== taskId));
    } else {
      setExpandedTasks([...expandedTasks, taskId]);
    }
  };

  const handleTaskAssignment = (taskId: string, assigneeId: string) => {
    setTaskAssignments((prev) => ({
      ...prev,
      [taskId]: assigneeId,
    }));
  };

  const handleTaskDueDate = (taskId: string, dueDate: string) => {
    setTaskDueDates((prev) => ({
      ...prev,
      [taskId]: dueDate,
    }));
  };

  const saveTaskChanges = (taskId: string) => {
    // In a real app, this would make an API call
    console.log("Saving task changes:", {
      taskId,
      assignee: taskAssignments[taskId],
      dueDate: taskDueDates[taskId],
    });
    setEditingTask(null);
  };

  const cancelTaskEdit = (taskId: string) => {
    // Reset changes
    const task = service?.tasks.find((t) => t.id === taskId);
    if (task) {
      setTaskAssignments((prev) => ({
        ...prev,
        [taskId]: task.assignedTo || "",
      }));
      setTaskDueDates((prev) => ({
        ...prev,
        [taskId]: task.dueDate ? format(task.dueDate, "yyyy-MM-dd") : "",
      }));
    }
    setEditingTask(null);
  };

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
      case "pending":
        return "bg-gray-100 text-gray-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "urgent":
        return "bg-red-500";
      case "high":
        return "bg-orange-500";
      case "medium":
        return "bg-yellow-500";
      case "low":
        return "bg-green-500";
      default:
        return "bg-gray-500";
    }
  };

  const TaskIcon = ({ status }: { status: string }) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case "in_progress":
        return <Clock className="h-5 w-5 text-blue-500" />;
      case "blocked":
        return <AlertCircle className="h-5 w-5 text-red-500" />;
      default:
        return <Circle className="h-5 w-5 text-gray-400" />;
    }
  };

  const handleCommentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    // In a real app, this would make an API call
    console.log("Adding comment:", { content: newComment, isInternal });
    setNewComment("");
  };

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-4">
          <Link
            to="/services"
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft className="h-5 w-5 text-gray-600" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{service.name}</h1>
            <p className="text-gray-600">{service.description}</p>
          </div>
        </div>
        {(user?.role === "admin" || user?.role === "staff") && (
          <button
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            onClick={() => setIsEditService(true)}
          >
            <Edit className="h-4 w-4 mr-2" />
            Edit Service
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Service Info Card */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">
                Service Information
              </h2>
              <span
                className={`px-3 py-1 text-sm rounded-full font-medium ${getStatusColor(
                  service.status
                )}`}
              >
                {service.status.replace("_", " ")}
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center space-x-3">
                <User className="h-5 w-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-600">Client</p>
                  <p className="font-medium text-gray-900">{client?.name}</p>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <Calendar className="h-5 w-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-600">Due Date</p>
                  <p className="font-medium text-gray-900">
                    {format(service.dueDate, "PPP")}
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <div
                  className={`w-3 h-3 rounded-full ${getPriorityColor(
                    service.priority
                  )}`}
                ></div>
                <div>
                  <p className="text-sm text-gray-600">Priority</p>
                  <p className="font-medium text-gray-900 capitalize">
                    {service.priority}
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <Clock className="h-5 w-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-600">Service Type</p>
                  <p className="font-medium text-gray-900">
                    {service.serviceType}
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700">
                  Progress
                </span>
                <span className="text-sm font-medium text-gray-900">
                  {service.progress}%
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div
                  className="bg-blue-500 h-3 rounded-full transition-all duration-500"
                  style={{ width: `${service.progress}%` }}
                ></div>
              </div>
            </div>
          </div>

          {/* AI Summary */}
          {/* {showAISummary && (
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-blue-900">AI Summary</h3>
                <button 
                  onClick={() => setShowAISummary(false)}
                  className="text-blue-600 hover:text-blue-700"
                >
                  <EyeOff className="h-4 w-4" />
                </button>
              </div>
              <div className="text-blue-800 space-y-2">
                <p><strong>Current Status:</strong> Service is {service.progress}% complete with {service.tasks.filter(t => t.status === 'pending').length} pending tasks remaining.</p>
                <p><strong>Team Activity:</strong> Michael Chen completed bank reconciliation ahead of schedule. Emma Williams is actively working on expense categorization and has requested additional client documentation.</p>
                <p><strong>Client Interaction:</strong> Client uploaded all requested bank statements. Additional receipts needed for complete expense categorization.</p>
                <p><strong>Next Steps:</strong> Complete expense review, generate financial statements, and schedule client review meeting.</p>
              </div>
            </div>
          )} */}

          {/* Tasks Section */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">Tasks</h2>
              {(user?.role === "admin" || user?.role === "staff") &&
                isEditService && (
                  <button className="flex items-center px-3 py-1 text-sm text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors">
                    <Plus className="h-4 w-4 mr-1" />
                    Add Task
                  </button>
                )}
            </div>

            <div className="space-y-3">
              {service.tasks.map((task) => (
                <div
                  key={task.id}
                  className="border border-gray-200 rounded-lg p-4"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3 flex-1">
                      <TaskIcon status={task.status} />
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900">
                          {task.title}
                        </h4>
                        <p className="text-sm text-gray-600">
                          {task.description}
                        </p>

                        <div className="flex items-center space-x-4 mt-2 text-xs text-gray-500">
                          {task.assignedTo &&
                            !expandedTasks.includes(task.id) && (
                              <span className="flex items-center">
                                <User className="h-3 w-3 mr-1" />
                                {mockStaff.find((s) => s.id === task.assignedTo)
                                  ?.name || "Staff Member"}
                              </span>
                            )}
                          {task.dueDate && !expandedTasks.includes(task.id) && (
                            <span className="flex items-center">
                              <Calendar className="h-3 w-3 mr-1" />
                              Due {format(task.dueDate, "MMM d")}
                            </span>
                          )}

                          <span className="flex items-center">
                            <Clock className="h-3 w-3 mr-1" />
                            {task.estimatedHours}h estimated
                            {task.actualHours &&
                              ` / ${task.actualHours}h actual`}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <select
                        value={
                          taskStatuses[task.id] ||
                          (task.status === "pending"
                            ? "Todo"
                            : task.status === "in_progress"
                            ? "InProgress"
                            : task.status === "completed"
                            ? "Completed"
                            : "Todo")
                        }
                        onChange={(e) =>
                          handleTaskStatusChange(task.id, e.target.value)
                        }
                        className={`text-xs px-2 py-1 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all`}
                      >
                        {" "}
                        {taskStatus.map((option) => (
                          <option key={option.id} value={option.status}>
                            {option.status === "InProgress"
                              ? "In Progress"
                              : option.status}
                          </option>
                        ))}
                      </select>
                      {(user?.role === "admin" || user?.role === "staff") &&
                        isEditService &&
                        editingTask !== task.id && (
                          <button
                            onClick={() => {
                              setEditingTask(task.id);
                              setTaskAssignments((prev) => ({
                                ...prev,
                                [task.id]: task.assignedTo || "",
                              }));
                              setTaskDueDates((prev) => ({
                                ...prev,
                                [task.id]: task.dueDate
                                  ? format(task.dueDate, "yyyy-MM-dd")
                                  : "",
                              }));
                            }}
                            className="p-1 text-red-500 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                            title="Edit assignment and due date"
                          >
                            <Trash2 className="h-3 w-3" />
                          </button>
                        )}
                      <button
                        onClick={() => handleTaskToggle(task.id)}
                        className="p-1 hover:bg-gray-100 rounded"
                      >
                        {expandedTasks.includes(task.id) ? (
                          <ChevronUp className="h-4 w-4" />
                        ) : (
                          <ChevronDown className="h-4 w-4" />
                        )}
                      </button>
                    </div>
                  </div>

                  {expandedTasks.includes(task.id) && (
                    <div className="mt-4 pt-4 border-t border-gray-100">
                      <div className="flex items-center justify-between mb-3">
                        <p className="text-gray-600 font-medium">
                          Task Details
                        </p>
                        <Edit2
                          className="text-gray-500 hover:text-blue-600 cursor-pointer h-4 w-4"
                          onClick={() => {
                            // setIsTaskDetailsEditable(true);
                            setEditingTask(task.id);

                            // initialize state with current values
                            setTaskAssignments((prev) => ({
                              ...prev,
                              [task.id]: task.assignedTo || "",
                            }));
                            setTaskDueDates((prev) => ({
                              ...prev,
                              [task.id]: task.dueDate
                                ? format(task.dueDate, "yyyy-MM-dd")
                                : "",
                            }));
                          }}
                        />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                        <div>
                          {/* <p className="text-gray-900">Order: #{task.order}</p> */}
                          {task.isRequired && (
                            <p className="text-gray-900">
                              Required: {task.isRequired ? "Yes" : "No"}
                            </p>
                          )}

                          {task.completionDate && (
                            <p className="text-gray-900">
                              Completed: {format(task.completionDate, "PPP")}
                            </p>
                          )}
                        </div>
                        <div>
                          {/* <p className="text-gray-600 mb-1">Time Tracking</p> */}
                          {task.assignedTo && (
                            <>
                              {editingTask ? (
                                <select
                                  value={
                                    taskAssignments[task.id] ||
                                    task.assignedTo ||
                                    ""
                                  }
                                  onChange={(e) =>
                                    handleTaskAssignment(
                                      task.id,
                                      e.target.value
                                    )
                                  }
                                  className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                >
                                  <option value="">Unassigned</option>
                                  {mockStaff.map((staff) => (
                                    <option key={staff.id} value={staff.id}>
                                      {staff.name} ({staff.role})
                                    </option>
                                  ))}
                                </select>
                              ) : (
                                <p className="text-gray-900">
                                  Assigned To: {task.assignedTo}
                                </p>
                              )}
                            </>
                          )}
                          {task.dueDate && (
                            <>
                              {editingTask ? (
                                // <input
                                //   type="date"
                                //   value={
                                //     taskDueDates[task.id] ||
                                //     (task.dueDate
                                //       ? format(task.dueDate, "yyyy-MM-dd")
                                //       : "")
                                //   }
                                //   onChange={(e) =>
                                //     setTaskDueDates((prev) => ({
                                //       ...prev,
                                //       [task.id]: e.target.value,
                                //     }))
                                //   }
                                //   className="border rounded px-2 py-1 text-sm w-full"
                                // />
                                <input
                                  type="date"
                                  value={
                                    taskDueDates[task.id] ||
                                    (task.dueDate
                                      ? format(task.dueDate, "yyyy-MM-dd")
                                      : "")
                                  }
                                  onChange={(e) =>
                                    handleTaskDueDate(task.id, e.target.value)
                                  }
                                  className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent mt-2"
                                />
                              ) : (
                                <p className="text-gray-900">
                                  Due Date:{" "}
                                  {task.dueDate
                                    ? format(task.dueDate, "yyyy-MM-dd")
                                    : ""}
                                </p>
                              )}
                              {editingTask && (
                                <div className="flex items-center space-x-2 mt-3 float-end">
                                  <button
                                    onClick={() => saveTaskChanges(task.id)}
                                    className="flex items-center px-2 py-1 text-xs bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
                                  >
                                    <Save className="h-3 w-3 mr-1" />
                                    Save
                                  </button>
                                  <button
                                    onClick={() => cancelTaskEdit(task.id)}
                                    className="flex items-center px-2 py-1 text-xs bg-gray-500 text-white rounded hover:bg-gray-600 transition-colors"
                                  >
                                    <X className="h-3 w-3 mr-1" />
                                    Cancel
                                  </button>
                                </div>
                              )}
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Task Timeline/History */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Activity Timeline
            </h2>
            <div className="space-y-4">
              <div className="flex space-x-3">
                <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                <div className="flex-1">
                  <p className="text-sm text-gray-900">
                    Bank reconciliation completed by Michael Chen
                  </p>
                  <p className="text-xs text-gray-500">2 days ago</p>
                </div>
              </div>
              <div className="flex space-x-3">
                <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                <div className="flex-1">
                  <p className="text-sm text-gray-900">
                    Emma Williams started working on expense categorization
                  </p>
                  <p className="text-xs text-gray-500">3 days ago</p>
                </div>
              </div>
              <div className="flex space-x-3">
                <div className="w-2 h-2 bg-orange-500 rounded-full mt-2"></div>
                <div className="flex-1">
                  <p className="text-sm text-gray-900">
                    Client uploaded bank statements for January
                  </p>
                  <p className="text-xs text-gray-500">5 days ago</p>
                </div>
              </div>
              <div className="flex space-x-3">
                <div className="w-2 h-2 bg-purple-500 rounded-full mt-2"></div>
                <div className="flex-1">
                  <p className="text-sm text-gray-900">
                    Service created and assigned to team
                  </p>
                  <p className="text-xs text-gray-500">1 week ago</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Assigned Team */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Assigned Team
            </h3>
            <div className="space-y-3">
              {service.assignedTo.map((userId, index) => (
                <div key={userId} className="flex items-center space-x-3">
                  <img
                    src={`https://ui-avatars.com/api/?name=User${userId}&background=0ea5e9&color=fff`}
                    alt={`User ${userId}`}
                    className="h-8 w-8 rounded-full"
                  />
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      {userId === "2" ? "Michael Chen" : "Emma Williams"}
                    </p>
                    <p className="text-xs text-gray-500">
                      {userId === "2" ? "Senior Accountant" : "Tax Specialist"}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Documents */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Documents</h3>
              {(user?.role !== "client" || service.clientId === "client-1") && (
                <button className="flex items-center px-2 py-1 text-sm text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded transition-colors">
                  <Upload className="h-4 w-4 mr-1" />
                  Upload
                </button>
              )}
            </div>

            <div className="space-y-2">
              {mockDocuments
                .filter((doc) => doc.serviceId === service.id)
                .map((doc) => (
                  <div
                    key={doc.id}
                    className="flex items-center justify-between p-2 hover:bg-gray-50 rounded-lg"
                  >
                    <div className="flex items-center space-x-2">
                      <FileText className="h-4 w-4 text-gray-400" />
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          {doc.originalName}
                        </p>
                        <p className="text-xs text-gray-500">
                          {(doc.size / 1024 / 1024).toFixed(1)}MB •{" "}
                          {formatDistanceToNow(doc.uploadedAt)} ago
                        </p>
                      </div>
                    </div>
                    <button className="p-1 hover:bg-gray-100 rounded">
                      <Download className="h-4 w-4 text-gray-400" />
                    </button>
                  </div>
                ))}

              {mockDocuments.filter((doc) => doc.serviceId === service.id)
                .length === 0 && (
                <p className="text-sm text-gray-500 text-center py-4">
                  No documents uploaded
                </p>
              )}
            </div>
          </div>

          {/* Communication */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Communication
            </h3>

            {/* Comments */}
            <div className="space-y-4 mb-4 max-h-64 overflow-y-auto">
              {mockComments
                .filter((comment) => comment.serviceId === service.id)
                .map((comment) => (
                  <div key={comment.id} className="space-y-2">
                    <div className="flex items-start space-x-2">
                      <img
                        src={`https://ui-avatars.com/api/?name=${encodeURIComponent(
                          comment.authorName
                        )}&background=0ea5e9&color=fff`}
                        alt={comment.authorName}
                        className="h-6 w-6 rounded-full"
                      />
                      <div className="flex-1">
                        <div className="flex items-center space-x-2">
                          <p className="text-sm font-medium text-gray-900">
                            {comment.authorName}
                          </p>
                          {comment.isInternal && (
                            <span className="px-2 py-0.5 text-xs bg-orange-100 text-orange-700 rounded">
                              Internal
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-gray-700 mt-1">
                          {comment.content}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          {formatDistanceToNow(comment.createdAt)} ago
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
            </div>

            {/* Add Comment */}
            <form onSubmit={handleCommentSubmit} className="space-y-3">
              <textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Add a comment..."
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none text-sm"
              />

              <div className="flex items-center justify-between">
                {(user?.role === "admin" ||
                  user?.role === "staff" ||
                  user?.role === "partner") && (
                  <label className="flex items-center space-x-2 text-sm">
                    <input
                      type="checkbox"
                      checked={isInternal}
                      onChange={(e) => setIsInternal(e.target.checked)}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-gray-600">Internal comment</span>
                  </label>
                )}

                <button
                  type="submit"
                  disabled={!newComment.trim()}
                  className="flex items-center px-3 py-1 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm"
                >
                  <Send className="h-3 w-3 mr-1" />
                  Send
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
