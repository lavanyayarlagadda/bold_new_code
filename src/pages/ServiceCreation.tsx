import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Search,
  Plus,
  FileText,
  User,
  // Users,
  Calendar,
  // Clock,
  Target,
  ChevronDown,
  X,
  // Settings,
  Sparkles,
  CheckCircle,
  Edit2,
} from "lucide-react";

import TaskModal from "../components/ReusableComponents/TaskModal";
import {
  useGetAllUsersQuery,
  useGetAllClientsQuery,
  TaskFormData,
  SingleUser,
  ServiceTemplate,
  useGetAllServiceTemplatesMutation,
} from "../redux/services/dropdownApi";
import {
  useCreateNewServiceMutation,
  useGetTasksByServiceTemplateMutation,
} from "../redux/services/serviceTasksApi";
import { toast } from "react-toastify";

// Mock staff/partner data

export default function ServiceCreation() {
  const navigate = useNavigate();
  const { data: usersData } = useGetAllUsersQuery();
  const { data: allClientsData } = useGetAllClientsQuery();
  const [getTemplates, { data: templatesData, isLoading: loadingTemplates }] =
    useGetAllServiceTemplatesMutation();
  const [createNewService, { isLoading, isSuccess, error }] =
    useCreateNewServiceMutation();
  const [
    getTasksbyServiceTemplate,
    { data: tasksDatafromDropdown, isLoading: tasksServiceTemplateLoading },
  ] = useGetTasksByServiceTemplateMutation();

  const allUsers = usersData?.data || [];
  const allClients = allClientsData?.data || [];

  const [showTemplateDropdown, setShowTemplateDropdown] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<number | null>(null);
  const [isCustomService, setIsCustomService] = useState(false);
  const [templateSearchQuery, setTemplateSearchQuery] = useState("");
  const [serviceName, setServiceName] = useState("");
  const [showClientDropdown, setShowClientDropdown] = useState(false);
  const [selectedClient, setSelectedClient] = useState<number | null>(null);
  const [showStaffDropdown, setShowStaffDropdown] = useState(false);
  const [selectedStaff, setSelectedStaff] = useState<number[]>([]);
  const [priority, setPriority] = useState<number | null>(null);
  const [frequency, setFrequency] = useState<"one-time" | "recurring">(
    "one-time"
  );
  const [recurringFrequency, setRecurringFrequency] = useState("monthly");
  const [customFrequency, setCustomFrequency] = useState("");
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const [editingTask, setEditingTask] = useState<TaskFormData | null>(null);
  const [staffList, setStaffList] = useState<SingleUser[]>([]);
  const [tasks, setTasks] = useState<TaskFormData[]>([]);
  const [dueDate, setDueDate] = useState("");
  const [tasksDatafromDropdownData, setTasksDatafromDropdownData] = useState();

  useEffect(() => {
    if (tasksDatafromDropdown && tasksDatafromDropdown.data?.length > 0) {
      setTasksDatafromDropdownData(tasksDatafromDropdown.data);
    }
  }, [tasksDatafromDropdown]);

  useEffect(() => {
    if (allUsers && allUsers.length > 0) {
      setStaffList(allUsers);
    }
  }, [allUsers]);

  useEffect(() => {
    getTemplates();
  }, []);
  const templates = templatesData?.data || [];

  const selectedTemplateData = templates
    ? templates.find(
        (t: ServiceTemplate) => t.serviceTemplateId === selectedTemplate
      )
    : null;

  const handleTemplateSelect = async (template: ServiceTemplate) => {
    console.log("templateId", template);

    const templateObj = templates.find(
      (t: ServiceTemplate) => t.serviceTemplateId === template.serviceTemplateId
    );
    console.log("templateId", templateObj);
    console.log("template", template);
    if (template) {
      setIsCustomService(false);
      setServiceName(template.serviceName);
      setSelectedTemplate(templateObj?.serviceTemplateId || null);
      // setMockkServiceTemplateShow(true);
      setShowTemplateDropdown(false);
    }
    try {
      await getTasksbyServiceTemplate({
        serviceTemplateId: templateObj?.serviceTemplateId,
      });
    } catch (err) {
      console.error("Error fetching tasks:", err);
    }
  };

  const getFilteredTemplates = () => {
    return templates.filter(
      (template: ServiceTemplate) =>
        template.serviceName
          .toLowerCase()
          .includes(templateSearchQuery.toLowerCase()) ||
        template.description
          .toLowerCase()
          .includes(templateSearchQuery.toLowerCase())
    );
  };
  const handleSaveTask = (task: TaskFormData) => {
    if (task.id) {
      console.log("Update Task:", task);
      setTasks((prev) => prev.map((t) => (t.id === task.id ? task : t)));
    } else {
      const newTask = {
        ...task,
        id: Date.now(),
      };

      setTasks((prev) => [...prev, newTask]);
    }
    console.log("existing task update", task);

    // setShowTaskModal(false);
  };

  const handleEditSave = (task: TaskFormData) => {
    console.log("ttt", task, tasksDatafromDropdownData);

    setTasksDatafromDropdownData((prev: any[]) => {
      if (!prev) return prev; // safety

      return prev.map((item) =>
        item.taskName === task.taskName
          ? {
              ...item, // keep existing fields
              ...task, // overwrite with updated fields: assigneeId, dueDate, createdBy, updatedBy
            }
          : item
      );
    });
    setShowTaskModal(false)
  };

  const getAssignedId = (assignedId: number) => {
    let userName = allUsers.find((user) => user.userId == assignedId);
    if (userName) {
      return userName.fullName;
    }
  };

  // clients dropdown data
  const selectedClientData = allClients.find(
    (c) => c.clientId === selectedClient
  );

  const handleCustomServiceToggle = () => {
    setIsCustomService(true);
    setServiceName("Custom");
    setSelectedTemplate(null);
    setShowTemplateDropdown(false);
  };

  const handleStaffToggle = (staffId: number) => {
    if (selectedStaff.includes(staffId)) {
      setSelectedStaff(selectedStaff.filter((id) => id !== staffId));
    } else {
      setSelectedStaff([...selectedStaff, staffId]);
    }
  };

  const getFrequencyCode = () => {
    if (frequency === "one-time") return 1;

    if (frequency === "recurring") {
      switch (recurringFrequency) {
        case "weekly":
          return 2;
        case "bi-weekly":
          return 3;
        case "monthly":
          return 4;
        case "quarterly":
          return 5;
        default:
          return null;
      }
    }

    return null;
  };

  const handleCreateService = async () => {
    const serviceData = {
      templateType: isCustomService ? "Custom" : "Existing",
      serviceTemplateId: !isCustomService ? selectedTemplate : null,
      clientId: selectedClient,
      userId: 2,
      // name: serviceName,
      assignedUsers: selectedStaff,
      priorityId: priority,
      frequency: getFrequencyCode(),
      isCustomService,
      dueDate: dueDate,
      serviceName: serviceName,
      tasks: isCustomService ? tasks : tasksDatafromDropdownData,
    };
    console.log("Creating service:", serviceData);
    try {
      const response = await createNewService(serviceData).unwrap();
      console.log("Service created successfully:", response);
      toast.success("Service created successfully!");
      navigate("/services");
    } catch (err) {
      console.error("Failed to create service:", err);
      toast.error("Failed to create service");
    }
  };

  const isFormValid =
    serviceName.trim() &&
    selectedClient &&
    selectedStaff.length > 0 &&
    (!isCustomService
      ? selectedTemplate
      : tasks.some((task) => task.taskName.trim()));

  const handleEditTask = (task: TaskFormData) => {
    setEditingTask(task);
    setIsEditing(true);
    setShowTaskModal(true);
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center space-x-4 mb-8">
        <button
          onClick={() => navigate("/services")}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <ArrowLeft className="h-5 w-5 text-gray-600" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Create New Service
          </h1>
          <p className="text-gray-600">
            Set up a new service with templates or create a custom one
          </p>
        </div>
      </div>

      {/* Service Details Section */}
      <div className="bg-white rounded-xl border border-gray-200 p-8">
        <div className="space-y-8">
          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-6">
              Service Details
            </h2>

            {/* Template Selection */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Template Selection *
              </label>
              <div className="relative">
                <button
                  className={`w-full px-4 py-3 text-left border-2 rounded-lg transition-all ${
                    selectedTemplate || isCustomService
                      ? "border-blue-500 bg-blue-50"
                      : "border-gray-300 hover:border-gray-400 bg-white"
                  }`}
                  onClick={() => setShowTemplateDropdown(!showTemplateDropdown)}
                >
                  <div className="flex items-center justify-between">
                    {selectedTemplateData ? (
                      <div className="flex items-center space-x-3">
                        <FileText className="h-5 w-5 text-blue-600" />
                        <div>
                          <span className="font-medium text-gray-900">
                            {selectedTemplateData.serviceName}
                          </span>
                        </div>
                      </div>
                    ) : isCustomService ? (
                      <div className="flex items-center space-x-3">
                        <Sparkles className="h-5 w-5 text-purple-600" />
                        <span className="font-medium text-gray-900">
                          Custom Service
                        </span>
                      </div>
                    ) : (
                      <span className="text-gray-500">
                        Select a template or create custom service...
                      </span>
                    )}
                    <ChevronDown className="h-4 w-4 text-gray-400" />
                  </div>
                </button>

                {/* dropdown options */}

                {showTemplateDropdown && (
                  <div className="absolute z-10 w-full mt-2 bg-white border border-gray-300 rounded-lg shadow-lg">
                    <div className="p-3 border-b border-gray-200">
                      <div className="relative mb-3">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <input
                          type="text"
                          placeholder="Search templates..."
                          value={templateSearchQuery}
                          onChange={(e) =>
                            setTemplateSearchQuery(e.target.value)
                          }
                          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>

                      <button
                        onClick={handleCustomServiceToggle}
                        className="w-full flex items-center px-3 py-2 text-left bg-purple-50 hover:bg-purple-100 rounded-lg transition-colors"
                      >
                        <Sparkles className="h-4 w-4 text-purple-600 mr-3" />
                        <span className="font-medium text-purple-900">
                          Create Custom Service
                        </span>
                      </button>
                    </div>
                    {loadingTemplates ? (
                      <div className="p-4 text-center text-gray-500">
                        Loading templates...
                      </div>
                    ) : (
                      <div className="max-h-60 overflow-y-auto">
                        {getFilteredTemplates().map(
                          (template: ServiceTemplate) => (
                            <button
                              key={template.serviceTemplateId}
                              onClick={() => handleTemplateSelect(template)}
                              className="w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors"
                            >
                              <div className="flex items-start space-x-3">
                                <FileText className="h-5 w-5 text-blue-600 mt-0.5" />
                                <div className="flex-1">
                                  <div className="flex items-center space-x-2 mb-1">
                                    <h4 className="font-medium text-gray-900">
                                      {template.serviceName}
                                    </h4>
                                  </div>
                                  <p className="text-sm text-gray-600 mb-2">
                                    {template.description}
                                  </p>
                                </div>
                              </div>
                            </button>
                          )
                        )}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Service Name */}
            <div className="mb-6">
              <label
                htmlFor="serviceName"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Service Name *
              </label>
              <input
                id="serviceName"
                type="text"
                value={serviceName === "Custom" ? "" : serviceName}
                onChange={(e) => setServiceName(e.target.value)}
                placeholder="Enter service name"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div className="mb-6">
              <div className="flex flex-col md:flex-row md:items-start md:space-x-4 space-y-4 md:space-y-0">
                {/* Client Assignment */}
                <div className="w-full md:w-2/4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Client *
                  </label>
                  <div className="relative">
                    <button
                      onClick={() => setShowClientDropdown(!showClientDropdown)}
                      className="w-full px-3 py-2 text-left border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex items-center justify-between">
                        {selectedClientData ? (
                          <div className="flex items-center space-x-3">
                            <span className="font-medium text-gray-900">
                              {selectedClientData?.clientName}
                            </span>
                          </div>
                        ) : (
                          <span className="text-gray-500">
                            Select a client...
                          </span>
                        )}
                        <ChevronDown className="h-4 w-4 text-gray-400" />
                      </div>
                    </button>

                    {showClientDropdown && (
                      <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg">
                        <div className="max-h-60 overflow-y-auto">
                          {allClients.map((client) => (
                            <button
                              key={client.clientId}
                              onClick={() => {
                                setSelectedClient(client.clientId);
                                setShowClientDropdown(false);
                              }}
                              className="w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors"
                            >
                              <div className="flex items-center space-x-3">
                                <div>
                                  <p className="font-medium text-gray-900">
                                    {client.clientName}
                                  </p>
                                  <p className="text-sm text-gray-500">
                                    {client.contactEmail}
                                  </p>
                                </div>
                              </div>
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Staff Assignment */}
                <div className="w-full md:w-2/4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Assigned Staff/Partner *
                  </label>
                  <div className="relative">
                    <button
                      onClick={() => setShowStaffDropdown(!showStaffDropdown)}
                      className="w-full px-3 py-2 text-left border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex items-center justify-between">
                        {selectedStaff.length > 0 ? (
                          <div className="flex items-center space-x-2">
                            <div className="flex -space-x-1">
                              {selectedStaff.length > 3 && (
                                <div className="h-6 w-6 rounded-full bg-gray-100 border-2 border-white flex items-center justify-center">
                                  <span className="text-xs text-gray-600">
                                    +{selectedStaff.length - 3}
                                  </span>
                                </div>
                              )}
                            </div>
                            <span className="font-medium text-gray-900">
                              {selectedStaff.length} staff member
                              {selectedStaff.length > 1 ? "s" : ""} selected
                            </span>
                          </div>
                        ) : (
                          <span className="text-gray-500">
                            Select staff/partner...
                          </span>
                        )}
                        <ChevronDown className="h-4 w-4 text-gray-400" />
                      </div>
                    </button>

                    {showStaffDropdown && (
                      <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg">
                        <div className="max-h-60 overflow-y-auto">
                          {allUsers.map((staff) => (
                            <button
                              key={staff.userId}
                              onClick={() => handleStaffToggle(staff.userId)}
                              className="w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors"
                            >
                              <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-3">
                                  <img
                                    // src={staff.avatar}
                                    alt={staff.fullName}
                                    className="h-6 w-6 rounded-full"
                                  />
                                  <div>
                                    <p className="font-medium text-gray-900">
                                      {staff.fullName}
                                    </p>
                                    <p className="text-sm text-gray-500">
                                      {staff.role.roleName}
                                    </p>
                                  </div>
                                </div>
                                {selectedStaff.includes(staff.userId) && (
                                  <CheckCircle className="h-5 w-5 text-blue-600" />
                                )}
                              </div>
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* calendar + Priority */}
            <div className="mb-6">
              <div className="flex flex-col md:flex-row md:items-start md:space-x-4 space-y-4 md:space-y-0">
                {/*   Priority */}
                <div className="w-full md:w-2/4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Priority *
                  </label>
                  <select
                    value={priority ?? ""}
                    onChange={(e) => setPriority(Number(e.target.value))}
                    className={`w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white hover:bg-gray-50 transition-colors ${
                      priority === null ? "text-gray-400" : "text-black"
                    }`}
                  >
                    <option value="" disabled>
                      Select priority
                    </option>
                    <option value="1" className="text-black">
                      Low
                    </option>
                    <option value="2" className="text-black">
                      Medium
                    </option>
                    <option value="3" className="text-black">
                      High
                    </option>
                  </select>
                </div>

                <div className="w-full md:w-2/4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Due Date
                  </label>
                  <input
                    type="date"
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                    className="w-full p-2 border rounded"
                  />
                </div>
              </div>
            </div>

            {/* Frequency Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Frequency *
              </label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div
                  onClick={() => setFrequency("one-time")}
                  className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                    frequency === "one-time"
                      ? "border-blue-500 bg-blue-50"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <div
                      className={`w-4 h-4 rounded-full border-2 ${
                        frequency === "one-time"
                          ? "border-blue-500 bg-blue-500"
                          : "border-gray-300"
                      }`}
                    >
                      {frequency === "one-time" && (
                        <div className="w-2 h-2 bg-white rounded-full mx-auto mt-0.5"></div>
                      )}
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900">
                        One-Time Service
                      </h4>
                      <p className="text-sm text-gray-600">
                        Complete once and close
                      </p>
                    </div>
                  </div>
                </div>

                <div
                  onClick={() => setFrequency("recurring")}
                  className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                    frequency === "recurring"
                      ? "border-blue-500 bg-blue-50"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <div
                      className={`w-4 h-4 rounded-full border-2 ${
                        frequency === "recurring"
                          ? "border-blue-500 bg-blue-500"
                          : "border-gray-300"
                      }`}
                    >
                      {frequency === "recurring" && (
                        <div className="w-2 h-2 bg-white rounded-full mx-auto mt-0.5"></div>
                      )}
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900">
                        Recurring Service
                      </h4>
                      <p className="text-sm text-gray-600">
                        Repeat on schedule
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Recurring Frequency Options */}
              {frequency === "recurring" && (
                <div className="bg-gray-50 rounded-lg p-4">
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Recurring Frequency
                  </label>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
                    {[
                      { value: "weekly", label: "Weekly" },
                      { value: "bi-weekly", label: "Bi-Weekly" },
                      { value: "monthly", label: "Monthly" },
                      { value: "quarterly", label: "Quarterly" },
                    ].map((option) => (
                      <button
                        key={option.value}
                        onClick={() => setRecurringFrequency(option.value)}
                        className={`px-3 py-2 text-sm rounded-lg border transition-colors ${
                          recurringFrequency === option.value
                            ? "bg-blue-600 text-white border-blue-600"
                            : "bg-white text-gray-700 border-gray-300 hover:border-gray-400"
                        }`}
                      >
                        {option.label}
                      </button>
                    ))}
                  </div>
                  {recurringFrequency === "custom" && (
                    <div className="mt-3">
                      <input
                        type="text"
                        value={customFrequency}
                        onChange={(e) => setCustomFrequency(e.target.value)}
                        placeholder="e.g., Every 6 weeks, Twice per month"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Tasks Section */}

          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Tasks</h3>
            <div>
              {isCustomService && (
                <div className="flex items-center justify-between mb-4">
                  <p className="text-sm text-gray-600">
                    {/* Add custom tasks for this service */}
                    Add {serviceName || "service"} tasks for this service
                  </p>
                  <button
                    // onClick={addCustomTask}
                    onClick={() => {
                      setEditingTask(null);
                      setShowTaskModal(true);
                    }}
                    className="flex items-center px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Task
                  </button>
                </div>
              )}
              {tasks.length > 0 || tasksDatafromDropdown?.data?.length > 0 ? (
                <div className="border border-gray-200 rounded-lg p-4 space-y-3 w-full">
                  {/* --- CUSTOM TASKS --- */}
                  {tasks.length > 0 && (
                    <>
                      {!selectedTemplateData && (
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">
                          Custom Tasks
                        </h3>
                      )}
                      {tasks.map((task) => (
                        <div
                          key={task.id}
                          className="flex items-start justify-between border-b last:border-b-0 pb-3 last:pb-0 w-full"
                        >
                          <div className="flex-1">
                            <h4 className="font-medium text-gray-900">
                              {task.taskName || "Untitled Task"}
                            </h4>
                            {task.taskDescription && (
                              <p className="text-sm text-gray-500 mt-1">
                                {task.taskDescription}
                              </p>
                            )}
                            <div className="flex items-center space-x-4 mt-1 text-xs text-gray-500">
                              {task.assignedId && (
                                <span className="flex items-center">
                                  <User className="h-3 w-3 mr-1" />
                                  {allUsers.find(
                                    (s) => s.userId === task.assignedId
                                  )?.fullName || "Assigned"}
                                </span>
                              )}
                              {task.dueDate && (
                                <span className="flex items-center">
                                  <Calendar className="h-3 w-3 mr-1" />
                                  {new Date(task.dueDate).toLocaleDateString()}
                                </span>
                              )}
                            </div>
                          </div>

                          <div className="flex items-center space-x-2">
                            <button
                              onClick={() => handleEditTask(task)}
                              className="p-1 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors"
                              title="Edit Task"
                            >
                              <Edit2 className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() =>
                                setTasks(tasks.filter((t) => t.id !== task.id))
                              }
                              className="p-1 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded transition-colors"
                              title="Delete Task"
                            >
                              <X className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </>
                  )}

                  {tasksDatafromDropdownData?.length > 0 && (
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">
                        Template Tasks
                      </h3>

                      <ul className="space-y-3">
                        {tasksDatafromDropdownData.map((task: any) => (
                          <li
                            onClick={() => handleEditTask(task)}
                            key={task.taskTemplateId}
                            className="flex items-start justify-between border-b pb-3 last:border-none last:pb-0 cursor-pointer"
                          >
                            <div className="flex-1">
                              <h4 className="font-medium text-gray-900">
                                {task.taskName}
                              </h4>

                              {task.taskDescription && (
                                <p className="text-sm text-gray-500 mt-1">
                                  {task.taskDescription}
                                </p>
                              )}
                              {task.assigneeId && (
                                <p className="text-sm text-gray-500 mt-1">
                                  {getAssignedId(task.assigneeId)}
                                </p>
                              )}
                              {task.dueDate && (
                                <p className="text-sm text-gray-500 mt-1">
                                  {task.dueDate}
                                </p>
                              )}
                            </div>

                            {/* ❌ No edit/delete for template tasks */}
                            <div className="text-xs text-gray-400 italic">
                              Template
                            </div>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-8 border-2 border-dashed border-gray-300 rounded-lg w-full">
                  <Target className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    No tasks added yet
                  </h3>
                  <p className="text-gray-600 mb-4">
                    Click "Add Task" to create your first task
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Create Service Button */}
          <div className="pt-6 border-t border-gray-200">
            {/* <button
              onClick={handleCreateService}
              disabled={!isFormValid}
              className="w-full flex items-center justify-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium text-lg"
            >
              Create Service
            </button> */}
            <button
              onClick={handleCreateService}
              disabled={!isFormValid || isLoading}
              className="w-full flex items-center justify-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium text-lg"
            >
              {isLoading ? (
                <span className="flex items-center space-x-2">
                  <svg
                    className="animate-spin h-5 w-5 text-white"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 00-8 8h4z"
                    />
                  </svg>
                  <span>Submitting...</span>
                </span>
              ) : (
                "Create Service"
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Task Modal */}
      {showTaskModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-md mx-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">
                {isEditing ? "Edit Task" : "Add Task"}
              </h3>
              <button
                onClick={() => {
                  setShowTaskModal(false);
                  setEditingTask(null);
                }}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="h-4 w-4 text-gray-500" />
              </button>
            </div>

            <TaskModal
              open={showTaskModal}
              onClose={() => setShowTaskModal(false)}
              // staff={staff || []}
              staff={staffList || []}
              serviceName={serviceName}
              mode={editingTask ? "edit" : "create"}
              initialTask={editingTask}
              onSave={editingTask ? handleEditSave : handleSaveTask}
            />
          </div>
        </div>
      )}
    </div>
  );
}
