import React, { useState } from "react";
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
import { useAuth } from "../contexts/AuthContext";
import { mockServiceTemplates, mockClients } from "../data/mockData";

// Mock staff/partner data
const mockStaff = [
  {
    id: "2",
    name: "Michael Chen",
    role: "Senior Accountant",
    avatar:
      "https://images.pexels.com/photos/91227/pexels-photo-91227.jpeg?w=150",
  },
  {
    id: "3",
    name: "Emma Williams",
    role: "Tax Specialist",
    avatar:
      "https://images.pexels.com/photos/733872/pexels-photo-733872.jpeg?w=150",
  },
  {
    id: "5",
    name: "David Rodriguez",
    role: "Junior Accountant",
    avatar:
      "https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?w=150",
  },
  {
    id: "6",
    name: "Sarah Thompson",
    role: "Partner",
    avatar:
      "https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?w=150",
  },
];

export default function ServiceCreation() {
  // const { user } = useAuth();
  const navigate = useNavigate();

  // Form state
  const [serviceName, setServiceName] = useState("");
  const [selectedTemplate, setSelectedTemplate] = useState("");
  const [selectedClient, setSelectedClient] = useState("");
  const [selectedStaff, setSelectedStaff] = useState<string[]>([]);
  const [frequency, setFrequency] = useState<"one-time" | "recurring">(
    "one-time"
  );
  const [recurringFrequency, setRecurringFrequency] = useState("monthly");
  const [customFrequency, setCustomFrequency] = useState("");
  const [isCustomService, setIsCustomService] = useState(false);
  const [customTasks, setCustomTasks] = useState<
    Array<{
      id: string;
      name: string;
      description: string;
      assignee: string;
      dueDate: string;
      estimatedTime: string;
    }>
  >([]);

  // UI state
  const [templateSearchQuery, setTemplateSearchQuery] = useState("");
  const [showClientDropdown, setShowClientDropdown] = useState(false);
  const [showStaffDropdown, setShowStaffDropdown] = useState(false);
  const [showTemplateDropdown, setShowTemplateDropdown] = useState(false);
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [editingTask, setEditingTask] = useState<any>(null);
  const [mockServiceTaskShow, setMaskServiceTemplateShow] = useState(false);
  const [priority, setPriority] = useState("");
  const [isEditing, setIsEditing] = useState(false);

  const handleTemplateSelect = (templateId: string) => {
    const template = mockServiceTemplates.find((t) => t.id === templateId);
    if (template) {
      setSelectedTemplate(templateId);
      setServiceName(template.name);
      setMaskServiceTemplateShow(true);
      setShowTemplateDropdown(false);
    }
  };

  const handleCustomServiceToggle = () => {
    setIsCustomService(true);
    setSelectedTemplate("");
    setServiceName("Custom");
    setShowTemplateDropdown(false);
  };

  const addCustomTask = () => {
    const newTask = {
      id: `task-${Date.now()}`,
      name: "",
      description: "",
      assignee: "",
      dueDate: "",
      estimatedTime: "",
    };
    setEditingTask(newTask);
    setIsEditing(false);
    setShowTaskModal(true);
  };

  const saveCustomTask = (taskData: any) => {
    if (customTasks.find((t) => t.id === taskData.id)) {
      setCustomTasks(
        customTasks.map((task) => (task.id === taskData.id ? taskData : task))
      );
    } else {
      // setCustomTasks([...customTasks, taskData]);
      setCustomTasks([taskData, ...customTasks]);
    }
    setShowTaskModal(false);
    setEditingTask(null);
  };

  const editCustomTask = (task: any) => {
    setEditingTask(task);
    setIsEditing(true);
    setShowTaskModal(true);
  };

  const removeCustomTask = (id: string) => {
    setCustomTasks(customTasks.filter((task) => task.id !== id));
  };

  const handleStaffToggle = (staffId: string) => {
    if (selectedStaff.includes(staffId)) {
      setSelectedStaff(selectedStaff.filter((id) => id !== staffId));
    } else {
      setSelectedStaff([...selectedStaff, staffId]);
    }
  };

  const handleCreateService = () => {
    const serviceData = {
      name: serviceName,
      clientId: selectedClient,
      assignedTo: selectedStaff,
      frequency,
      recurringFrequency:
        frequency === "recurring"
          ? recurringFrequency === "custom"
            ? customFrequency
            : recurringFrequency
          : null,
      templateId: !isCustomService ? selectedTemplate : null,
      customTasks: isCustomService
        ? customTasks.filter((task) => task.name.trim())
        : [],
      isCustomService,
    };

    console.log("Creating service:", serviceData);

    // Navigate to service detail page
    navigate(`/services/service-${Date.now()}`);
  };

  const getFilteredTemplates = () => {
    return mockServiceTemplates.filter(
      (template) =>
        template.name
          .toLowerCase()
          .includes(templateSearchQuery.toLowerCase()) ||
        template.description
          .toLowerCase()
          .includes(templateSearchQuery.toLowerCase()) ||
        template.serviceType
          .toLowerCase()
          .includes(templateSearchQuery.toLowerCase())
    );
  };

  const selectedTemplateData = selectedTemplate
    ? mockServiceTemplates.find((t) => t.id === selectedTemplate)
    : null;
  const selectedClientData = mockClients.find((c) => c.id === selectedClient);

  const isFormValid =
    serviceName.trim() &&
    selectedClient &&
    selectedStaff.length > 0 &&
    (!isCustomService
      ? selectedTemplate
      : customTasks.some((task) => task.name.trim()));

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

      <div className="bg-white rounded-xl border border-gray-200 p-8">
        <div className="space-y-8">
          {/* Service Details Section */}
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
                  onClick={() => setShowTemplateDropdown(!showTemplateDropdown)}
                  className={`w-full px-4 py-3 text-left border-2 rounded-lg transition-all ${
                    selectedTemplate || isCustomService
                      ? "border-blue-500 bg-blue-50"
                      : "border-gray-300 hover:border-gray-400 bg-white"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    {selectedTemplateData ? (
                      <div className="flex items-center space-x-3">
                        <FileText className="h-5 w-5 text-blue-600" />
                        <div>
                          <span className="font-medium text-gray-900">
                            {selectedTemplateData.name}
                          </span>
                          <span className="text-sm text-gray-500 ml-2">
                            ({selectedTemplateData.tasks.length} tasks)
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
                    <div className="max-h-60 overflow-y-auto">
                      {getFilteredTemplates().map((template) => (
                        <button
                          key={template.id}
                          onClick={() => handleTemplateSelect(template.id)}
                          className="w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors"
                        >
                          <div className="flex items-start space-x-3">
                            <FileText className="h-5 w-5 text-blue-600 mt-0.5" />
                            <div className="flex-1">
                              <div className="flex items-center space-x-2 mb-1">
                                <h4 className="font-medium text-gray-900">
                                  {template.name}
                                </h4>
                                <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded">
                                  {template.serviceType}
                                </span>
                              </div>
                              <p className="text-sm text-gray-600 mb-2">
                                {template.description}
                              </p>
                              <div className="flex items-center space-x-4 text-xs text-gray-500">
                                {/* <span className="flex items-center">
                                  <Clock className="h-3 w-3 mr-1" />
                                  {template.estimatedDuration} days
                                </span> */}
                                <span className="flex items-center">
                                  <Target className="h-3 w-3 mr-1" />
                                  {template.tasks.length} tasks
                                </span>
                              </div>
                            </div>
                          </div>
                        </button>
                      ))}
                    </div>
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
                value={serviceName}
                onChange={(e) => setServiceName(e.target.value)}
                placeholder="Enter service name"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Client Assignment */}
            <div className="mb-6">
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
                        <img
                          src={
                            selectedClientData.avatar ||
                            `https://ui-avatars.com/api/?name=${encodeURIComponent(
                              selectedClientData.name
                            )}&background=0ea5e9&color=fff`
                          }
                          alt={selectedClientData.name}
                          className="h-6 w-6 rounded-full"
                        />
                        <span className="font-medium text-gray-900">
                          {selectedClientData.name}
                        </span>
                      </div>
                    ) : (
                      <span className="text-gray-500">Select a client...</span>
                    )}
                    <ChevronDown className="h-4 w-4 text-gray-400" />
                  </div>
                </button>

                {showClientDropdown && (
                  <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg">
                    <div className="max-h-60 overflow-y-auto">
                      {mockClients.map((client) => (
                        <button
                          key={client.id}
                          onClick={() => {
                            setSelectedClient(client.id);
                            setShowClientDropdown(false);
                          }}
                          className="w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors"
                        >
                          <div className="flex items-center space-x-3">
                            <img
                              src={
                                client.avatar ||
                                `https://ui-avatars.com/api/?name=${encodeURIComponent(
                                  client.name
                                )}&background=0ea5e9&color=fff`
                              }
                              alt={client.name}
                              className="h-6 w-6 rounded-full"
                            />
                            <div>
                              <p className="font-medium text-gray-900">
                                {client.name}
                              </p>
                              <p className="text-sm text-gray-500">
                                {client.email}
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

            <div className="mb-6">
              <div className="flex flex-col md:flex-row md:items-start md:space-x-4 space-y-4 md:space-y-0">
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
                              {selectedStaff.slice(0, 3).map((staffId) => {
                                const staff = mockStaff.find(
                                  (s) => s.id === staffId
                                );
                                return (
                                  <img
                                    key={staffId}
                                    src={staff?.avatar}
                                    alt={staff?.name}
                                    className="h-6 w-6 rounded-full border-2 border-white"
                                  />
                                );
                              })}
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
                          {mockStaff.map((staff) => (
                            <button
                              key={staff.id}
                              onClick={() => handleStaffToggle(staff.id)}
                              className="w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors"
                            >
                              <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-3">
                                  <img
                                    src={staff.avatar}
                                    alt={staff.name}
                                    className="h-6 w-6 rounded-full"
                                  />
                                  <div>
                                    <p className="font-medium text-gray-900">
                                      {staff.name}
                                    </p>
                                    <p className="text-sm text-gray-500">
                                      {staff.role}
                                    </p>
                                  </div>
                                </div>
                                {selectedStaff.includes(staff.id) && (
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
                {/*   Priority */}
                <div className="w-full md:w-2/4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Priority *
                  </label>
                  <select
                    value={priority}
                    onChange={(e) => setPriority(e.target.value)}
                    className={`w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white hover:bg-gray-50 transition-colors ${
                      priority === "" ? "text-gray-400" : "text-black"
                    }`}
                  >
                    <option value="" disabled>
                      Select priority
                    </option>
                    <option value="High" className="text-black">
                      High
                    </option>
                    <option value="Medium" className="text-black">
                      Medium
                    </option>
                    <option value="Low" className="text-black">
                      Low
                    </option>
                  </select>
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

                  {/* <button
                    onClick={() => setRecurringFrequency("custom")}
                    className={`flex items-center px-3 py-2 text-sm rounded-lg border transition-colors ${
                      recurringFrequency === "custom"
                        ? "bg-blue-600 text-white border-blue-600"
                        : "bg-white text-gray-700 border-gray-300 hover:border-gray-400"
                    }`}
                  >
                    <Settings className="h-4 w-4 mr-2" />
                    Custom Frequency
                  </button> */}

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

            {isCustomService || serviceName ? (
              <div>
                <div className="flex items-center justify-between mb-4">
                  <p className="text-sm text-gray-600">
                    {/* Add custom tasks for this service */}
                    Add {serviceName} tasks for this service
                  </p>
                  <button
                    onClick={addCustomTask}
                    className="flex items-center px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Task
                  </button>
                </div>

                {!selectedTemplateData && customTasks.length === 0 ? (
                  <div className="text-center py-8 border-2 border-dashed border-gray-300 rounded-lg">
                    <Target className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      No tasks added yet
                    </h3>
                    <p className="text-gray-600 mb-4">
                      Click "Add Task" to create your first task
                    </p>
                  </div>
                ) 
                : (
                  <div className="space-y-3">
                    {customTasks.map((task) => (
                      <div
                        key={task.id}
                        className="border border-gray-200 rounded-lg p-4"
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h4 className="font-medium text-gray-900">
                              {task.name}
                            </h4>

                            <div className="flex items-center space-x-4 mt-2 text-xs text-gray-500">
                              {task.assignee && (
                                <span className="flex items-center">
                                  <User className="h-3 w-3 mr-1" />
                                  {mockStaff.find((s) => s.id === task.assignee)
                                    ?.name || "Assigned"}
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
                              onClick={() => editCustomTask(task)}
                              className="p-1 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors"
                            >
                              <Edit2 className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => removeCustomTask(task.id)}
                              className="p-1 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded transition-colors"
                            >
                              <X className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )
                }

                {selectedTemplateData && mockServiceTaskShow && (
                  <div
                    key={selectedTemplateData.id}
                    className="border border-gray-200 rounded-lg p-4"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900">
                          {selectedTemplateData.name}
                        </h4>

                        {selectedTemplateData.tasks.map((t, index) => (
                          <div
                            key={index}
                            className="flex items-start justify-between border-b border-gray-100 py-2 last:border-b-0"
                          >
                            <div className="flex items-center space-x-4 mt-2 text-xs text-gray-500">
                              {t.title && (
                                <span className="flex items-center">
                                  <User className="h-3 w-3 mr-1" />
                                  {t.title}
                                </span>
                              )}
                              {t.status && <span>{t.status}</span>}
                              {t.dueDate && (
                                <span className="flex items-center">
                                  <Calendar className="h-3 w-3 mr-1" />
                                  {new Date(t.dueDate).toLocaleDateString()}
                                </span>
                              )}
                            </div>

                            <div className="flex items-center space-x-2">
                              <button
                                onClick={() => editCustomTask(t)}
                                className="p-1 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors"
                              >
                                <Edit2 className="h-4 w-4" />
                              </button>
                              <button
                                onClick={() => removeCustomTask(t.title)}
                                className="p-1 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded transition-colors"
                              >
                                <X className="h-4 w-4" />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-8 border-2 border-dashed border-gray-300 rounded-lg">
                <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Select a template or create custom service
                </h3>
                <p className="text-gray-600">
                  Choose from our predefined templates or build your own service
                  from scratch
                </p>
              </div>
            )}
          </div>

          {/* Create Service Button */}
          <div className="pt-6 border-t border-gray-200">
            <button
              onClick={handleCreateService}
              disabled={!isFormValid}
              className="w-full flex items-center justify-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium text-lg"
            >
              Create Service
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
                {editingTask?.name ? "Edit Task" : "Add New Task"}
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
              task={editingTask}
              onSave={saveCustomTask}
              onCancel={() => {
                setShowTaskModal(false);
                setEditingTask(null);
              }}
              staff={mockStaff}
              isCustomService={isCustomService}
              isEditing={isEditing}
            />
          </div>
        </div>
      )}
    </div>
  );
}

// Task Modal Component
function TaskModal({ task, onSave, onCancel, staff, isCustomService }: any) {
  const [formData, setFormData] = useState({
    id: task?.id || `task-${Date.now()}`,
    name: task?.name || "",
    description: task?.description || "",
    assignee: task?.assignee || "",
    dueDate: task?.dueDate || "",
    estimatedTime: task?.estimatedTime || "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.name.trim()) {
      onSave(formData);
    } else if (formData.id) {
      onSave(formData);
    }
  };
  console.log("formData", formData);
  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Task Name *
        </label>
        <input
          type="text"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          placeholder="Enter task name"
          className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
            isCustomService
              ? "border-gray-300 bg-white text-black"
              : "bg-gray-100 text-gray-500 border-gray-200 cursor-not-allowed"
          }`}
          required
          readOnly={!isCustomService}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Description
        </label>
        <textarea
          value={formData.description}
          onChange={(e) =>
            setFormData({ ...formData, description: e.target.value })
          }
          placeholder="Enter task description"
          rows={3}
          className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none ${
            isCustomService
              ? "border-gray-300 bg-white text-black"
              : "bg-gray-100 text-gray-500 border-gray-200 cursor-not-allowed"
          }`}
          readOnly={!isCustomService}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Assignee
        </label>
        <select
          value={formData.assignee}
          onChange={(e) =>
            setFormData({ ...formData, assignee: e.target.value })
          }
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="">Select assignee...</option>
          {staff.map((member: any) => (
            <option key={member.id} value={member.id}>
              {member.name} ({member.role})
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Due Date
        </label>
        <input
          type="date"
          value={formData.dueDate}
          onChange={(e) =>
            setFormData({ ...formData, dueDate: e.target.value })
          }
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>

      {/* <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Estimated Time
        </label>
        <input
          type="text"
          value={formData.estimatedTime}
          onChange={(e) =>
            setFormData({ ...formData, estimatedTime: e.target.value })
          }
          placeholder="e.g., 2 hours, 1 day"
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div> */}

      <div className="flex items-center justify-end space-x-3 pt-4">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Save Task
        </button>
      </div>
    </form>
  );
}
