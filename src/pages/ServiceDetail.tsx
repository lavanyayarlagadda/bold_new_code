import React, { useEffect, useState } from "react";
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
  // ChevronDown,
  // ChevronUp,
  // Settings,
  Save,
  X,
  // DeleteIcon,
  // Trash2,
  Edit2,
} from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import { format, formatDistanceToNow } from "date-fns";
import ActivityTimeline from "../components/ActivityTimeline";
import {
  useFetchServiceTaskDetailsQuery,
  useSaveCommentsMutation,
} from "../redux/services/serviceTasksApi";
import {
  SingleUser,
  TaskFormData,
  useCreateUpdateTaskMutation,
  useGetAllServicesQuery,
  useGetAllUsersQuery,
} from "../redux/services/dropdownApi";
import TaskModal from "../components/ReusableComponents/TaskModal";
import { toast } from "react-toastify";
import { isKeyObject } from "node:util/types";
interface Task {
  serviceId: number;
  taskId: number;
  taskName: string;
  taskDescription: string;
  assigneeName: string;
  assignedId: string | number;
  status: string;
  dueDate: string;
  priorityLabel: string;
  statusId?: number;
}

export default function ServiceDetail() {
  const { serviceId } = useParams<{ serviceId: string }>();
  const numericServiceId = serviceId ? Number(serviceId) : undefined;

  console.log("Service ID:", numericServiceId);

  // 🔹 Call your API only when serviceId exists
  const {
    data: serviceTaskDetails,
    isLoading,
    error,
    refetch: refetchServiceTaskDetails,
  } = useFetchServiceTaskDetailsQuery(numericServiceId!, {
    skip: !numericServiceId,
  });
  const [saveComment, { isLoading: isSaving, error: saveError }] =
    useSaveCommentsMutation();
  const [
    createUpdateTasks,
    { isLoading: iscreateupdatetaskLoading, error: taskCreateUpdateError },
  ] = useCreateUpdateTaskMutation();

  const { user } = useAuth();
  const [newComment, setNewComment] = useState("");
  const [isInternal, setIsInternal] = useState(false);
  // const [showAISummary, setShowAISummary] = useState(true);
  const [editingTask, setEditingTask] = useState<number | null>(null);
  const [taskAssignments, setTaskAssignments] = useState<
    Record<number, number | "">
  >({});

  const [taskDueDates, setTaskDueDates] = useState<Record<string, string>>({});
  const [isEditService, setIsEditService] = useState(false);

  const [showTaskModal, setShowTaskModal] = useState(false);
  const serviceInfo = serviceTaskDetails?.data?.serviceInformation;
  const tasksList = serviceTaskDetails?.data?.taskList || [];
  const assignedTeam = serviceTaskDetails?.data?.assignedTeam || [];
  const doccuments = serviceTaskDetails?.data?.documents || [];
  const comments = serviceTaskDetails?.data?.comments || [];
  const ActivityTime = serviceTaskDetails?.data?.activityLogs || [];
  const service = serviceInfo;
  // const tasks = tasksList;
  const [tasks, setTasks] = useState<Task[]>([]);
  const [staffList, setStaffList] = useState<SingleUser[]>([]);
  const [serviceName, setServiceName] = useState("");
  console.log("TASKID", tasks, tasksList);
  const clientId = serviceTaskDetails?.data?.serviceInformation?.clientId;
  console.log("clientId", clientId);

  console.log("ActivityTimeline", ActivityTime);
  const { data: statusData } = useGetAllServicesQuery();
  const { data: usersData } = useGetAllUsersQuery();
  const allStatus = statusData?.data || [];
  const allUsers = usersData?.data || [];

  useEffect(() => {
    if (serviceInfo) {
      const service = serviceInfo.serviceName;
      setServiceName(service);
    }
  }, [serviceInfo]);
  useEffect(() => {
    if (tasksList && tasksList.length > 0) {
      setTasks(tasksList);
    }
  }, [tasksList]);

  useEffect(() => {
    if (allUsers && allUsers.length > 0) {
      setStaffList(allUsers);
    }
  }, [allUsers]);
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

  if (!serviceId) return <p>Invalid service ID</p>;
  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Error fetching details</p>;

  console.log("serviceDetails", serviceTaskDetails);
  const handleTaskStatusChange = (taskId: number, statusId: number | null) => {
    console.log(`Task ${taskId} changed to status: ${statusId}`);
    // setTaskStatuses((prev) => ({
    //   ...prev,
    //   [taskId]: newStatus,
    // }));
    updateTaskField(taskId, "statusId", statusId);
  };

  const handleTaskAssignment = (taskId: number, assignedId: number | "") => {
    // setTaskAssignments((prev) => ({
    //   ...prev,
    //   [taskId]: assigneeId,
    // }));
    console.log("handleTaskAssignment", taskId, assignedId);
    updateTaskField(taskId, "assignedId", assignedId);
  };

  const handleTaskDueDate = (taskId: number, dueDate: string) => {
    updateTaskField(taskId, "dueDate", dueDate);
  };

  const getTaskName = (users: any, assignedId: number) => {
    const obj = users?.find((user: any) => user.userId == assignedId);
    console.log("objj", obj);
    return obj.fullName;
  };

  const saveTaskChanges = async (
    task: TaskFormData,
    mode: "create" | "update"
  ) => {
    console.log("taskedit", task);
    let payload: any = {
      taskId: task.taskId || 0,
      serviceId: Number(task.serviceId),
      clientId: Number(clientId),
      taskName: task.taskName,
      dueDate: task.dueDate,
      taskDescription: task.taskDescription,
      // assigneeId: Number(task.assignedId),
      statusId: Number(task.statusId),
      createdBy: 2,
      updatedBy: 2,
    };

    if (mode === "create") {
      payload.assigneeId = Number(task.assigneeId);
    } else {
      payload.assigneeId = Number(task.assignedId);
    }
    try {
      console.log("Payload:", payload);

      const response = await createUpdateTasks(payload).unwrap();
      console.log("Task saved successfully:", response);
      toast.success(response.message || "Task Updated successfully");
      refetchServiceTaskDetails();
      setEditingTask(null);
      setShowTaskModal(false);
    } catch (err: any) {
      toast.error("Something went wrong", err);
      console.error("Task save failed:", err);

      // OPTIONAL: Show error toast
      // toast.error("Failed to save task");
    }
    setEditingTask(null);
  };

  const cancelTaskEdit = (taskId: number) => {
    console.log("iddd", taskId);

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

  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    // // In a real app, this would make an API call
    // console.log("Adding comment:", { content: newComment, isInternal });
    // setNewComment("");
    try {
      const payload = {
        userId: 2,
        clientId: clientId ?? 0,
        serviceId: Number(serviceId),
        message: newComment,
        isInternal: isInternal ? 1 : 0,
      };

      console.log("Submitting comment payload:", payload);

      const response = await saveComment(payload).unwrap();

      console.log("Comment saved successfully:", response);
      toast.success("Comment saved successfully");
      refetchServiceTaskDetails();
      // setComments((prev) => [...prev, response.data]);
      setNewComment("");
      setIsInternal(false);
    } catch (error) {
      console.error("Error saving comment:", error);
      toast.error("Error saving comment");
    }
  };

  const updateTaskField = (taskId: number, field: string, value: any) => {
    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task.taskId === taskId ? { ...task, [field]: value } : task
      )
    );

    setTimeout(() => {
      console.log("TakssetTimeout", tasks);
    }, 1000);
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
            <h1 className="text-2xl font-bold text-gray-900">
              {service?.clientName}
            </h1>
            <p className="text-gray-600">{service?.clientName}</p>
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
                  service?.status || ""
                )}`}
              >
                {service?.status || ""}
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center space-x-3">
                <User className="h-5 w-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-600">Client</p>
                  <p className="font-medium text-gray-900">
                    {service?.clientName}
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <Calendar className="h-5 w-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-600">Due Date</p>
                  <p className="font-medium text-gray-900">
                    {service?.dueDate || ""}
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <div
                  className={`w-3 h-3 rounded-full ${getPriorityColor(
                    service?.priorityLabel || ""
                  )}`}
                ></div>
                <div>
                  <p className="text-sm text-gray-600">Priority</p>
                  <p className="font-medium text-gray-900 capitalize">
                    {service?.priorityLabel || ""}
                  </p>
                </div>
              </div>

              {/* <div className="flex items-center space-x-3">
                <Clock className="h-5 w-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-600">Service Type</p>
                  <p className="font-medium text-gray-900">
                    {service?.serviceType}
                  </p>
                </div>
              </div> */}
            </div>

            <div className="mt-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700">
                  Progress
                </span>
                <span className="text-sm font-medium text-gray-900">
                  {service?.progressPercent}%
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div
                  className="bg-blue-500 h-3 rounded-full transition-all duration-500"
                  style={{ width: `${service?.progressPercent}%` }}
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
          {tasks && tasks.length > 0 && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-900">Tasks</h2>
                {(user?.role === "admin" || user?.role === "staff") &&
                  isEditService && (
                    <button
                      className="flex items-center px-3 py-1 text-sm text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors"
                      onClick={() => setShowTaskModal(true)}
                    >
                      <Plus className="h-4 w-4 mr-1" />
                      Add Task
                    </button>
                  )}
              </div>

              <div className="space-y-3">
                {tasks.map((task) => (
                  <div
                    key={task.taskId}
                    className="border border-gray-200 rounded-lg p-4"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3 flex-1">
                        <TaskIcon status={task.status} />
                        <div className="flex-1">
                          <h4 className="font-medium text-gray-900">
                            {task.taskName}
                          </h4>
                          <p className="text-sm text-gray-600">
                            {task.taskDescription}
                          </p>

                          <div className="flex items-center space-x-4 mt-2 text-xs text-gray-500">
                            {task.assigneeName && (
                              <span className="flex items-center">
                                <User className="h-3 w-3 mr-1" />
                                {task.assigneeName}
                              </span>
                            )}
                            {task.dueDate && (
                              <span className="flex items-center">
                                <Calendar className="h-3 w-3 mr-1" />
                                Due {task.dueDate}
                              </span>
                            )}

                            {/* <span className="flex items-center">
                            <Clock className="h-3 w-3 mr-1" />
                            {task.estimatedHours}h estimated
                            {task.actualHours &&
                              ` / ${task.actualHours}h actual`}
                          </span> */}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <select
                          value={task.statusId || ""}
                          onChange={(e) =>
                            handleTaskStatusChange(
                              task.taskId,
                              e.target.value ? Number(e.target.value) : null
                            )
                          }
                          className={`text-xs px-2 py-1 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all`}
                        >
                          {" "}
                          {allStatus.map((option) => (
                            <option
                              key={option.statusId}
                              value={option.statusId}
                            >
                              {option.statusName}
                            </option>
                          ))}
                        </select>
                        {
                          // (user?.role === "admin" || user?.role === "staff") &&
                          // isEditService && (
                          //   // editingTask !== task.taskId && (
                          //   <button
                          //     onClick={() => {
                          //       setEditingTask(task.taskId);
                          //       setTaskAssignments((prev) => ({
                          //         ...prev,
                          //         [task.taskId]: task.assigneeName || "",
                          //       }));
                          //       setTaskDueDates((prev) => ({
                          //         ...prev,
                          //         [task.taskId]: task.dueDate
                          //           ? format(task.dueDate, "yyyy-MM-dd")
                          //           : "",
                          //       }));
                          //     }}
                          //     className="p-1 text-red-500 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                          //     title="Edit assignment and due date"
                          //   >
                          //     <Trash2 className="h-3 w-3" />
                          //   </button>
                          // )
                          // )
                        }
                        {/* <button
                          onClick={() => handleTaskToggle(task.taskId)}
                          className="p-1 hover:bg-gray-100 rounded"
                        >
                          {expandedTasks.includes(task.taskId) ? (
                            <ChevronUp className="h-4 w-4" />
                          ) : (
                            <ChevronDown className="h-4 w-4" />
                          )}
                        </button> */}
                      </div>
                    </div>

                    {/* {expandedTasks.includes(task.taskId) && ( */}
                    {isEditService && (
                      <div className="mt-4 pt-4 border-t border-gray-100">
                        <div className="flex items-center justify-between mb-3">
                          <p className="text-gray-600 font-medium">
                            Task Details
                          </p>
                          <Edit2
                            className="text-gray-500 hover:text-blue-600 cursor-pointer h-4 w-4"
                            onClick={() => {
                              // setIsTaskDetailsEditable(true);
                              setEditingTask(task.taskId);
                            }}
                          />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                          {/* <div>
                        
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
                        </div> */}

                          {/* <p className="text-gray-600 mb-1">Time Tracking</p> */}
                          {/* {task.assigneeName && ( */}

                          {editingTask === task.taskId ? (
                            <select
                              value={task.assignedId || ""}
                              // value={
                              //   taskAssignments[task.taskId] ??
                              //   task.assignedId ??
                              //   ""
                              // }
                              onChange={(e) =>
                                handleTaskAssignment(
                                  task.taskId,
                                  e.target.value ? Number(e.target.value) : ""
                                )
                              }
                              className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            >
                              <option value="">Unassigned</option>
                              {allUsers.map((user) => (
                                <option key={user.userId} value={user.userId}>
                                  {user.fullName} ({user.role.roleName})
                                </option>
                              ))}
                            </select>
                          ) : (
                            <p className="text-gray-900">
                              Assigned To:{" "}
                              {/* {getTaskName(allUsers, Number(task.assignedId || null))} */}
                              {task.assigneeName || ""}
                            </p>
                          )}

                          {/* // )} */}
                          {/* {task.dueDate && ( */}

                          {/* // )} */}

                          {editingTask === task.taskId ? (
                            <input
                              type="date"
                              value={task.dueDate ? task.dueDate : ""}
                              onChange={(e) =>
                                handleTaskDueDate(task.taskId, e.target.value)
                              }
                              className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent "
                            />
                          ) : (
                            <p className="text-gray-900">
                              Due Date: {task.dueDate ? task.dueDate : ""}
                            </p>
                          )}

                          {editingTask && (
                            <div className="flex items-center space-x-2  float-end">
                              <button
                                onClick={() => saveTaskChanges(task, "update")}
                                disabled={iscreateupdatetaskLoading}
                                className={`flex items-center px-2 py-1 text-xs text-white rounded transition-colors
    ${
      iscreateupdatetaskLoading
        ? "bg-gray-400"
        : "bg-green-600 hover:bg-green-700"
    }`}
                              >
                                {iscreateupdatetaskLoading ? (
                                  "Submitting..."
                                ) : (
                                  <>
                                    <Save className="h-3 w-3 mr-1" />
                                    Save
                                  </>
                                )}
                              </button>

                              <button
                                onClick={() => cancelTaskEdit(task.taskId)}
                                className="flex items-center px-2 py-1 text-xs bg-gray-500 text-white rounded hover:bg-gray-600 transition-colors"
                              >
                                <X className="h-3 w-3 mr-1" />
                                Cancel
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                    {/* // )} */}
                  </div>
                ))}
              </div>
            </div>
          )}
          {/* Task Timeline/History */}
          {/* <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
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
          </div> */}
          {ActivityTime && ActivityTime.length > 0 && (
            <ActivityTimeline logs={ActivityTime} />
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Assigned Team */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Assigned Team
            </h3>
            <div className="space-y-3">
              {assignedTeam.map((team) => (
                <div key={team.userId} className="flex items-center space-x-3">
                  <img
                    src={`https://ui-avatars.com/api/?name=User${team.userId}&background=0ea5e9&color=fff`}
                    alt={`User ${team.userId}`}
                    className="h-8 w-8 rounded-full"
                  />
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      {team.assignedUser}
                    </p>
                    <p className="text-xs text-gray-500">{team.designation}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Documents */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Documents</h3>
              {/* {(user?.role !== "client" || service.clientId === "client-1") && ( */}
              <button className="flex items-center px-2 py-1 text-sm text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded transition-colors">
                <Upload className="h-4 w-4 mr-1" />
                Upload
              </button>
              {/* )} */}
            </div>

            <div className="space-y-2">
              {doccuments.length > 0 &&
                doccuments
                  .filter((doc) => doc.serviceId === service.serviceId)
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
                            {doc.uploadedAt} ago
                          </p>
                        </div>
                      </div>
                      <button className="p-1 hover:bg-gray-100 rounded">
                        <Download className="h-4 w-4 text-gray-400" />
                      </button>
                    </div>
                  ))}

              {doccuments.filter((doc) => doc.serviceId === service.serviceId)
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

            <div className="space-y-4 mb-4 max-h-64 overflow-y-auto">
              {comments.map((comment) => (
                <div key={comment.commentId} className="space-y-2">
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
                        {comment.commentText}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        {formatDistanceToNow(comment.createdAt)} ago
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

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
                  {isSaving ? "Sending..." : "Send"}
                </button>
              </div>
            </form>
          </div>
        </div>
        <TaskModal
          open={showTaskModal}
          onClose={() => setShowTaskModal(false)}
          staff={staffList || []}
          serviceName={serviceName}
          mode={"create"}
          initialTask={null}
          onSave={(task) => saveTaskChanges(task, "create")}
          serviceId={Number(serviceId)}
          clientId={clientId}
        />
      </div>
    </div>
  );
}
