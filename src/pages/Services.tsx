// import React, { useEffect, useState } from "react";
// import {
//   Plus,
//   Search,
//   Filter,
//   ChevronDown,
//   Calendar,
//   User,
//   Clock,
//   MessageSquare,
//   FileText,
//   Eye,
//   FolderOpen,
// } from "lucide-react";
// import { Link, useNavigate } from "react-router-dom";
// import { useAuth } from "../contexts/AuthContext";
// import {
//   mockServices,
//   mockClients,
//   // mockServiceTemplates,
// } from "../data/mockData";
// import { format } from "date-fns";
// import TableWithPagination from "../components/TableWithPagination";
// import { useFetchServiceTasksMutation } from "../redux/services/serviceTasksApi";

// export default function Services() {
//   const { user } = useAuth();
//     const [fetchServiceTasks, { data, isLoading, error }] = useFetchServiceTasksMutation();
//   const [searchQuery, setSearchQuery] = useState("");
//   const [statusFilter, setStatusFilter] = useState("all");
//   const [clientFilter, setClientFilter] = useState("all");
//   const [serviceTypeFilter, setServiceTypeFilter] = useState("all");
//   const [showFilters, setShowFilters] = useState(false);
//   const [viewMode, setViewMode] = useState<"list" | "grid">("list");

//    useEffect(() => {
//     fetchServiceTasks({
//       serviceName: "Monthly Bookkeeping",
//       serviceType: "",
//       clientName: "",
//       statusName: "",
//     });
//   }, [fetchServiceTasks]);

//   if (isLoading) return <p>Loading...</p>;
//   if (error) return <p>Error fetching tasks</p>;

//   const getFilteredServices = () => {
//     let filtered = mockServices;

//     // Role-based filtering
//     if (user?.role === "client") {
//       filtered = filtered.filter((service) => service.clientId === "client-1");
//     } else if (user?.role === "staff" || user?.role === "partner") {
//       filtered = filtered.filter((service) =>
//         service.assignedTo.includes(user.id)
//       );
//     }

//     // Search filter
//     if (searchQuery) {
//       filtered = filtered.filter(
//         (service) =>
//           service.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
//           service.description.toLowerCase().includes(searchQuery.toLowerCase())
//       );
//     }

//     // Status filter
//     if (statusFilter !== "all") {
//       filtered = filtered.filter((service) => service.status === statusFilter);
//     }

//     // Client filter (admin/staff view only)
//     if (
//       clientFilter !== "all" &&
//       (user?.role === "admin" || user?.role === "staff")
//     ) {
//       filtered = filtered.filter(
//         (service) => service.clientId === clientFilter
//       );
//     }

//     // Service type filter
//     if (serviceTypeFilter !== "all") {
//       filtered = filtered.filter(
//         (service) => service.serviceType === serviceTypeFilter
//       );
//     }

//     return filtered;
//   };

//   const getStatusColor = (status: string) => {
//     switch (status) {
//       case "completed":
//         return "bg-green-100 text-green-700";
//       case "in_progress":
//         return "bg-blue-100 text-blue-700";
//       case "review":
//         return "bg-yellow-100 text-yellow-700";
//       case "overdue":
//         return "bg-red-100 text-red-700";
//       default:
//         return "bg-gray-100 text-gray-700";
//     }
//   };

//   const getPriorityColor = (priority: string) => {
//     switch (priority) {
//       case "urgent":
//         return "bg-red-500";
//       case "high":
//         return "bg-orange-500";
//       case "medium":
//         return "bg-yellow-500";
//       case "low":
//         return "bg-green-500";
//       default:
//         return "bg-gray-500";
//     }
//   };

//   const ServiceCard = ({ service }: { service: any }) => {
//     const client = mockClients.find((c) => c.id === service.clientId);
//     const navigate = useNavigate();
//     return (
//       <div
//         onClick={() => navigate(`/services/${service.id}`)}
//         className="bg-white rounded-lg border border-gray-200 hover:border-gray-300 hover:shadow-md transition-all p-6 cursor-pointer"
//       >
//         <div className="flex items-start justify-between mb-4">
//           <div className="flex-1">
//             <div className="flex items-center space-x-2 mb-2">
//               <h3 className="font-semibold text-gray-900">{service.name}</h3>
//               {/* <div className={`w-2 h-2 rounded-full ${getPriorityColor(service.priority)}`}></div> */}
//             </div>
//             <p className="text-sm text-gray-600 mb-2">{service.description}</p>
//             <div className="flex items-center space-x-4 text-xs text-gray-500">
//               <span className="flex items-center">
//                 <Calendar className="h-3 w-3 mr-1" />
//                 Due {format(service.dueDate, "MMM d")}
//               </span>
//               <span className="flex items-center">
//                 <User className="h-3 w-3 mr-1" />
//                 {client?.name}
//               </span>
//             </div>
//           </div>
//           <span
//             className={`px-2 py-1 text-xs rounded-full font-medium ${getStatusColor(
//               service.status
//             )}`}
//           >
//             {service.status.replace("_", " ")}
//           </span>
//         </div>

//         <div className="mb-4">
//           <div className="flex items-center justify-between text-sm text-gray-600 mb-1">
//             <span>Progress</span>
//             <span>{service.progress}%</span>
//           </div>
//           <div className="w-full bg-gray-200 rounded-full h-2">
//             <div
//               className="bg-blue-500 h-2 rounded-full transition-all duration-300"
//               style={{ width: `${service.progress}%` }}
//             ></div>
//           </div>
//         </div>

//         <div className="flex items-center justify-between">
//           <div className="flex items-center space-x-4 text-xs text-gray-500">
//             <span className="flex items-center">
//               <Clock className="h-3 w-3 mr-1" />
//               {service.tasks.length} tasks
//             </span>
//             <span className="flex items-center">
//               <FileText className="h-3 w-3 mr-1" />
//               {service.documents.length} docs
//             </span>
//             <span className="flex items-center">
//               <MessageSquare className="h-3 w-3 mr-1" />
//               {service.comments.length} comments
//             </span>
//           </div>
//           {/* <Link
//             to={`/services/${service.id}`}
//             className="flex items-center px-3 py-1 text-sm text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-md transition-colors"
//           >
//             <Eye className="h-3 w-3 mr-1" />
//             View1
//           </Link> */}
//         </div>
//       </div>
//     );
//   };

//   const ServiceRow = ({ service }: { service: any }) => {
//     const client = mockClients.find((c) => c.id === service.clientId);

//     return (
//       <tr className="border-b border-gray-100 hover:bg-gray-50">
//         <td className="py-4 px-4">
//           <div className="flex items-center space-x-3">
//             {/* <div className={`w-2 h-2 rounded-full ${getPriorityColor(service.priority)}`}></div> */}
//             <div>
//               <p className="font-medium text-gray-900">{service.name}</p>
//               <p className="text-sm text-gray-500">{service.serviceType}</p>
//             </div>
//           </div>
//         </td>
//         <td className="py-4 px-4">
//           <div className="flex items-center space-x-2">
//             {/* <img
//               src={client?.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(client?.name || 'Unknown')}&background=0ea5e9&color=fff`}
//               alt={client?.name}
//               className="h-6 w-6 rounded-full"
//             /> */}
//             <span className="text-sm font-medium text-gray-900">
//               {client?.name}
//             </span>
//           </div>
//         </td>
//         <td className="py-4 px-4">
//           <div className="flex -space-x-1">
//             {service.assignedTo
//               .slice(0, 3)
//               .map((userId: string, index: number) => (
//                 <img
//                   key={userId}
//                   src={`https://ui-avatars.com/api/?name=User${userId}&background=0ea5e9&color=fff`}
//                   alt={`User ${userId}`}
//                   className="h-6 w-6 rounded-full border-2 border-white"
//                 />
//               ))}
//             {service.assignedTo.length > 3 && (
//               <div className="h-6 w-6 rounded-full bg-gray-100 border-2 border-white flex items-center justify-center">
//                 <span className="text-xs text-gray-600">
//                   +{service.assignedTo.length - 3}
//                 </span>
//               </div>
//             )}
//           </div>
//         </td>
//         <td className="py-4 px-4 ">
//           <span
//             className={`px-2 py-1 text-xs rounded-full font-medium ${getStatusColor(
//               service.status
//             )}`}
//           >
//             {service.status.replace("_", " ")}
//           </span>
//         </td>
//         <td className="py-4 px-4">
//           <div className="flex items-center space-x-2">
//             <div className="flex-1 bg-gray-200 rounded-full h-2 min-w-[60px]">
//               <div
//                 className="bg-blue-500 h-2 rounded-full transition-all duration-300"
//                 style={{ width: `${service.progress}%` }}
//               ></div>
//             </div>
//             <span className="text-sm text-gray-600 min-w-[35px]">
//               {service.progress}%
//             </span>
//           </div>
//         </td>
//         <td className="py-4 px-4 text-sm text-gray-600">
//           {format(service.dueDate, "MMM d, yyyy")}
//         </td>
//         <td className="py-4 px-4">
//           <Link
//             to={`/services/${service.id}`}
//             className="inline-flex items-center px-3 py-1 text-sm text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-md transition-colors"
//           >
//             <Eye className="h-3 w-3 mr-1" />
//             View
//           </Link>
//         </td>
//       </tr>
//     );
//   };

//   const filteredServices = getFilteredServices();

//   return (
//     <div>
//       {/* Header */}
//       <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6">
//         <div>
//           <h1 className="text-2xl font-bold text-gray-900">Services & Tasks</h1>
//           <p className="text-gray-600 mt-1">
//             Manage your services and track progress
//           </p>
//         </div>
//         {(user?.role === "admin" || user?.role === "staff") && (
//           <Link
//             to="/services/new"
//             className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors mt-4 sm:mt-0"
//           >
//             <Plus className="h-4 w-4 mr-2" />
//             New Service
//           </Link>
//         )}
//       </div>

//       {/* Filters and Search */}
//       <div className="bg-white rounded-lg border border-gray-200 p-4 mb-6">
//         <div className="flex flex-col lg:flex-row lg:items-center space-y-4 lg:space-y-0 lg:space-x-4">
//           {/* Search */}
//           <div className="flex-1 relative">
//             <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
//             <input
//               type="text"
//               placeholder="Search services..."
//               value={searchQuery}
//               onChange={(e) => setSearchQuery(e.target.value)}
//               className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//             />
//           </div>

//           {/* Filters */}
//           <div className="flex items-center space-x-2">
//             <button
//               onClick={() => setShowFilters(!showFilters)}
//               className="flex items-center px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
//             >
//               <Filter className="h-4 w-4 mr-2" />
//               Filters
//               <ChevronDown
//                 className={`h-4 w-4 ml-1 transform transition-transform ${
//                   showFilters ? "rotate-180" : ""
//                 }`}
//               />
//             </button>

//             {/* View Mode Toggle */}
//             <div className="flex border border-gray-300 rounded-lg overflow-hidden">
//               <button
//                 onClick={() => setViewMode("list")}
//                 className={`px-3 py-2 text-sm ${
//                   viewMode === "list"
//                     ? "bg-blue-100 text-blue-700"
//                     : "text-gray-600 hover:bg-gray-50"
//                 }`}
//               >
//                 List
//               </button>
//               <button
//                 onClick={() => setViewMode("grid")}
//                 className={`px-3 py-2 text-sm ${
//                   viewMode === "grid"
//                     ? "bg-blue-100 text-blue-700"
//                     : "text-gray-600 hover:bg-gray-50"
//                 }`}
//               >
//                 Grid
//               </button>
//             </div>
//           </div>
//         </div>

//         {/* Filter Options */}
//         {showFilters && (
//           <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-4 pt-4 border-t border-gray-200">
//             <select
//               value={statusFilter}
//               onChange={(e) => setStatusFilter(e.target.value)}
//               className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//             >
//               <option value="all">All Statuses</option>
//               <option value="not_started">Not Started</option>
//               <option value="in_progress">In Progress</option>
//               <option value="review">In Review</option>
//               <option value="completed">Completed</option>
//               <option value="overdue">Overdue</option>
//             </select>

//             {(user?.role === "admin" || user?.role === "staff") && (
//               <select
//                 value={clientFilter}
//                 onChange={(e) => setClientFilter(e.target.value)}
//                 className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//               >
//                 <option value="all">All Clients</option>
//                 {mockClients.map((client) => (
//                   <option key={client.id} value={client.id}>
//                     {client.name}
//                   </option>
//                 ))}
//               </select>
//             )}

//             <select
//               value={serviceTypeFilter}
//               onChange={(e) => setServiceTypeFilter(e.target.value)}
//               className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//             >
//               <option value="all">All Service Types</option>
//               <option value="Accounting">Accounting</option>
//               <option value="Tax">Tax</option>
//               <option value="GST">GST</option>
//             </select>

//             <button
//               onClick={() => {
//                 setStatusFilter("all");
//                 setClientFilter("all");
//                 setServiceTypeFilter("all");
//                 setSearchQuery("");
//               }}
//               className="px-3 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-50 border border-gray-300 rounded-lg transition-colors"
//             >
//               Clear Filters
//             </button>
//           </div>
//         )}
//       </div>

//       {/* Services List/Grid */}
//       {viewMode === "grid" ? (
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//           {filteredServices.map((service) => (
//             <ServiceCard key={service.id} service={service} />
//           ))}
//         </div>
//       ) : (
//         <TableWithPagination
//           columns={[
//             { label: "Service", width: "w-[200px]" },
//             { label: "Client" },
//             { label: "Assigned To" },
//             { label: "Status", width: "w-[110px]" },
//             { label: "Progress" },
//             { label: "Due Date" },
//             { label: "Actions" },
//           ]}
//           data={filteredServices}
//           rowsPerPage={5}
//           renderRow={(service) => (
//             <ServiceRow key={service.id} service={service} />
//           )}
//         />
//       )}

//       {filteredServices.length === 0 && (
//         <div className="text-center py-12">
//           <FolderOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
//           <h3 className="text-lg font-medium text-gray-900 mb-2">
//             No services found
//           </h3>
//           <p className="text-gray-600 mb-4">
//             {searchQuery ||
//             statusFilter !== "all" ||
//             clientFilter !== "all" ||
//             serviceTypeFilter !== "all"
//               ? "Try adjusting your search or filters"
//               : "Get started by creating your first service"}
//           </p>
//           {(user?.role === "admin" || user?.role === "staff") &&
//             !searchQuery && (
//               <Link
//                 to="/services/new"
//                 className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
//               >
//                 <Plus className="h-4 w-4 mr-2" />
//                 Create Service
//               </Link>
//             )}
//         </div>
//       )}
//     </div>
//   );
// }

import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  Plus,
  Search,
  Filter,
  ChevronDown,
  Calendar,
  User,
  Clock,
  MessageSquare,
  FileText,
  Eye,
  FolderOpen,
} from "lucide-react";

import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { format } from "date-fns";
import TableWithPagination from "../components/TableWithPagination";
import { PaginatedGrid } from "../components/PaginatedGrid";
import TooltipText from "../components/TooltipText";
import {
  ServiceTask,
  useFetchServiceTasksMutation,
} from "../redux/services/serviceTasksApi";
import {
  useGetAllClientsQuery,
  useGetAllServicesQuery,
} from "../redux/services/dropdownApi";
import {
  setSelectedClient,
  setSelectedStatus,
} from "../redux/slices/dropdownSlice";
import { RootState } from "../redux/store";

export default function Services() {
  const { user } = useAuth();
  const dispatch = useDispatch();
  const { selectedClient, selectedStatus } = useSelector(
    (state: RootState) => state.dropdown
  );

  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [clientFilter, setClientFilter] = useState("all");
  const [serviceTypeFilter, setServiceTypeFilter] = useState("all");
  const [showFilters, setShowFilters] = useState(false);
  const [viewMode, setViewMode] = useState<"list" | "grid">("list");

  // Fetch APIs
  const { data: clientsData, isLoading: clientsLoading } =
    useGetAllClientsQuery();
  const { data: statusData, isLoading: statusLoading } =
    useGetAllServicesQuery();
  const [fetchServiceTasks, { data, isLoading, error }] =
    useFetchServiceTasksMutation();

  const clients = clientsData?.data || [];
  const allStatus = statusData?.data || [];
  console.log("user123", user);
  // Fetch API Data
  useEffect(() => {
    fetchServiceTasks({
      // serviceName: "",
      // serviceType: "",
      // clientName: selectedClient || "",
      // statusName: selectedStatus || "",
      serviceTemplateId: 0,
      clientId: selectedClient
        ? Number(selectedClient)
        : user?.clientId
        ? user.clientId
        : 0,
      statusId: Number(selectedStatus) || 0,
    });
  }, [fetchServiceTasks, selectedClient, selectedStatus]);

  const servicesData = Array.isArray(data?.data) ? data.data : [];

  console.log("servicesData", servicesData);

  // 🔹 Filtering logic
  const getFilteredServices = () => {
    let filtered = [...servicesData];

    if (user?.role === "client") {
      filtered = filtered.filter((s) => s.clientName === String(user?.userId));
    } else if (user?.role === "staff" || user?.role === "partner") {
      filtered = filtered.filter((s) =>
        s.assignedTo?.includes(String(user?.userId))
      );
    }

    if (searchQuery.trim()) {
      const lower = searchQuery.toLowerCase();
      filtered = filtered.filter((s) => {
        const fields = [
          s.serviceName,
          s.serviceCategory,
          s.clientName,
          s.statusName,
          Array.isArray(s.assignedTo) ? s.assignedTo.join(", ") : s.assignedTo,
          // s.description,
        ];

        return fields.some(
          (f) => typeof f === "string" && f.toLowerCase().includes(lower)
        );
      });
    }

    // if (statusFilter !== "all") {
    //   filtered = filtered.filter((s) => s.statusName === statusFilter);
    // }

    if (statusFilter !== "all") {
      filtered = filtered.filter(
        (s) => String(s.statusId) === String(statusFilter)
      );
    }

    if (clientFilter !== "all") {
      filtered = filtered.filter(
        (s) => String(s.clientId) === String(clientFilter)
      );
    }

    // if (
    //   clientFilter !== "all" &&
    //   (user?.role === "admin" || user?.role === "staff")
    // ) {
    //   filtered = filtered.filter((s) => s.clientName === clientFilter);
    // }

    // if (serviceTypeFilter !== "all") {
    //   filtered = filtered.filter((s) => s.serviceType === serviceTypeFilter);
    // }

    return filtered;
  };

  const filteredServices = searchQuery ? getFilteredServices() : servicesData;

  console.log("searchQuery:", searchQuery);
  console.log("filteredServices:", filteredServices.length);

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

  const ServiceCard = ({ service }: { service: ServiceTask }) => {
    const navigate = useNavigate();

    return (
      // <div
      //   onClick={() => navigate(`/services/${service.serviceId}`)}
      //   className="bg-white rounded-lg border border-gray-200 hover:border-gray-300 hover:shadow-md transition-all p-6 cursor-pointer"
      // >
      //   <div className="flex items-start justify-between mb-4">
      //     <div className="flex-1">
      //       <h3 className="font-semibold text-gray-900">
      //         <TooltipText text={service.serviceName} maxLength={20} />
      //       </h3>
      //       <p className="text-sm text-gray-600 mb-2">
      //         <TooltipText text={service.description || "No description"} maxLength={20} />
      //       </p>
      //       <div className="flex items-center space-x-4 text-xs text-gray-500">
      //         <span className="flex items-center">
      //           <Calendar className="h-3 w-3 mr-1" />
      //           {service.dueDate
      //             ? `Due ${format(new Date(service.dueDate), "MMM d")}`
      //             : "No due date"}
      //         </span>
      //         <span className="flex items-center">
      //           <User className="h-3 w-3 mr-1" />
      //           {/* {client?.name || "Unknown Client"} */}
      //             <TooltipText text={service.clientName} maxLength={20} />
      //         </span>
      //       </div>
      //     </div>
      //     <span
      //       className={`px-2 py-1 text-xs rounded-full font-medium ${getStatusColor(
      //         service.statusName
      //       )}`}
      //     >
      //       {service.statusName || "N/A"}
      //     </span>
      //   </div>

      //   <div className="mb-4">
      //     <div className="flex items-center justify-between text-sm text-gray-600 mb-1">
      //       <span>Progress</span>
      //       <span>{service.progressPercent || 0}%</span>
      //     </div>
      //     <div className="w-full bg-gray-200 rounded-full h-2">
      //       <div
      //         className="bg-blue-500 h-2 rounded-full transition-all duration-300"
      //         style={{ width: `${service.progressPercent || 0}%` }}
      //       ></div>
      //     </div>
      //   </div>

      //   <div className="flex items-center justify-between text-xs text-gray-500">
      //     <span className="flex items-center">
      //       <Clock className="h-3 w-3 mr-1" />
      //       {service.taskCount || 0} tasks
      //     </span>
      //     <span className="flex items-center">
      //       <FileText className="h-3 w-3 mr-1" />
      //       {service.documentCount || 0} docs
      //     </span>
      //     <span className="flex items-center">
      //       <MessageSquare className="h-3 w-3 mr-1" />
      //       {service.commentCount || 0} comments
      //     </span>
      //   </div>
      // </div>
      <div
        onClick={() => navigate(`/services/${service.serviceId}`)}
        className="bg-white rounded-lg border border-gray-200 hover:border-gray-300 hover:shadow-md transition-all p-6 cursor-pointer"
      >
        {/* ===== Header Section ===== */}
        <div className="flex items-start justify-between  w-full">
          <div className="flex items-center w-4/6 ">
            <h3 className="font-semibold text-gray-900 mb-1">
              <TooltipText text={service.serviceName} maxLength={20} />
            </h3>
          </div>

          <span
            className={`px-2 py-1 text-xs rounded-full font-medium ${getStatusColor(
              service.statusName
            )}`}
          >
            {service.statusName || "N/A"}
          </span>
        </div>

        {/* 🔹 Description */}
        <p className="text-sm text-gray-600 mb-3">
          <TooltipText
            text={service.description || "No description"}
            maxLength={20}
          />
        </p>

        <div className="flex justify-between items-center w-full text-xs text-gray-500 mb-4">
          <span className="flex items-center w-2/6 truncate">
            <Calendar className="h-3 w-3 mr-1 shrink-0" />
            {service.dueDate
              ? `Due ${format(new Date(service.dueDate), "MMM d")}`
              : "No due date"}
          </span>

          <span className="flex items-center w-4/6 truncate justify-end">
            <User className="h-3 w-3 mr-1 shrink-0" />
            <TooltipText text={service.clientName} maxLength={20} />
          </span>
        </div>

        {/* ===== Progress Bar ===== */}
        <div className="mb-4">
          <div className="flex items-center justify-between text-sm text-gray-600 mb-1">
            <span>Progress</span>
            <span>{service.progressPercent || 0}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-blue-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${service.progressPercent || 0}%` }}
            ></div>
          </div>
        </div>

        {/* ===== Footer: Tasks, Docs, Comments ===== */}
        <div className="flex items-center justify-between text-xs text-gray-500">
          <span className="flex items-center">
            <Clock className="h-3 w-3 mr-1" />
            {service.taskCount || 0} tasks
          </span>
          <span className="flex items-center">
            <FileText className="h-3 w-3 mr-1" />
            {service.documentCount || 0} docs
          </span>
          <span className="flex items-center">
            <MessageSquare className="h-3 w-3 mr-1" />
            {service.commentCount || 0} comments
          </span>
        </div>
      </div>
    );
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
        <td className="py-4 px-4">
          <Link
            to={`/services/${service.serviceId}`}
            className="inline-flex items-center px-3 py-1 text-sm text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-md transition-colors"
          >
            <Eye className="h-3 w-3 mr-1" />
            View
          </Link>
        </td>
      </tr>
    );
  };

  console.log(user, "user deails");
  const handleClear = () => {
    dispatch(setSelectedClient("all"));
    dispatch(setSelectedStatus("all"));
    setStatusFilter("all");
    setClientFilter("all");
    setServiceTypeFilter("all");
    setSearchQuery("");

    setTimeout(() => {
      fetchServiceTasks({
        serviceTemplateId: 0,
        clientId: user?.clientId ? user.clientId : 0,
        statusId: 0,
      });
    }, 0);
  };

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Error fetching services</p>;

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Services & Tasks</h1>
          <p className="text-gray-600 mt-1">
            Manage your services and track progress
          </p>
        </div>
        {(user?.roleId === 1 || user?.roleId === 2) && ( 
        <Link
          to="/services/new"
          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors mt-4 sm:mt-0"
        >
          <Plus className="h-4 w-4 mr-2" />
          New Service
        </Link>
        )} 
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg border border-gray-200 p-4 mb-6">
        <div className="flex flex-col lg:flex-row lg:items-center space-y-4 lg:space-y-0 lg:space-x-4">
          {/* Search */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search services..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Filter Button + View Mode */}
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <Filter className="h-4 w-4 mr-2" />
              Filters
              <ChevronDown
                className={`h-4 w-4 ml-1 transform transition-transform ${
                  showFilters ? "rotate-180" : ""
                }`}
              />
            </button>

            <div className="flex border border-gray-300 rounded-lg overflow-hidden">
              <button
                onClick={() => setViewMode("list")}
                className={`px-3 py-2 text-sm ${
                  viewMode === "list"
                    ? "bg-blue-100 text-blue-700"
                    : "text-gray-600 hover:bg-gray-50"
                }`}
              >
                List
              </button>
              <button
                onClick={() => setViewMode("grid")}
                className={`px-3 py-2 text-sm ${
                  viewMode === "grid"
                    ? "bg-blue-100 text-blue-700"
                    : "text-gray-600 hover:bg-gray-50"
                }`}
              >
                Grid
              </button>
            </div>
          </div>
        </div>

        {/* Filter Options */}
        {showFilters && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-4 pt-4 border-t border-gray-200">
            <select
              value={statusFilter}
              // onChange={(e) => setStatusFilter(e.target.value)}
              onChange={(e) => (
                setStatusFilter(e.target.value),
                dispatch(setSelectedStatus(e.target.value))
              )}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">
                {" "}
                {statusLoading ? "Loading..." : "All Statuses"}
              </option>
              {!statusLoading &&
                allStatus.map((status) => (
                  <option key={status.statusId} value={status.statusId}>
                    {status.statusName}
                  </option>
                ))}
            </select>
            {/* 
            {(user?.role === "admin" || user?.role === "staff") && ( */}
            <select
              value={clientFilter}
              // onChange={(e) => setClientFilter(e.target.value)}
              onChange={(e) => (
                setClientFilter(e.target.value),
                dispatch(setSelectedClient(e.target.value))
              )}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">
                {" "}
                {clientsLoading ? "Loading..." : "All Clients"}
              </option>
              {!clientsLoading &&
                clients.map((client) => (
                  <option key={client.clientId} value={client.clientId}>
                    {client.clientName}
                  </option>
                ))}
            </select>
            {/* // )} */}

            {/* <select
              value={serviceTypeFilter}
              onChange={(e) => setServiceTypeFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Service Types</option>
              <option value="Accounting">Accounting</option>
              <option value="Tax">Tax</option>
              <option value="GST">GST</option>
            </select> */}

            <button
              onClick={handleClear}
              className="px-3 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-50 border border-gray-300 rounded-lg transition-colors"
            >
              Clear Filters
            </button>
          </div>
        )}
      </div>

      {/* Data View */}
      {servicesData.length === 0 ? (
        <div className="text-center py-12">
          <FolderOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No services found
          </h3>
          <p className="text-gray-600 mb-4">
            {searchQuery ||
            statusFilter !== "all" ||
            clientFilter !== "all" ||
            serviceTypeFilter !== "all"
              ? "Try adjusting your search or filters"
              : "Get started by creating your first service"}
          </p>
          {!searchQuery && (
            <Link
              to="/services/new"
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus className="h-4 w-4 mr-2" />
              Create Service
            </Link>
          )}
        </div>
      ) : viewMode === "grid" ? (
        // <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        //   {filteredServices.map((service) => (
        //     <ServiceCard key={service.serviceId} service={service} />
        //   ))}
        // </div>
        <PaginatedGrid
          data={filteredServices}
          itemsPerPage={6}
          renderItem={(service) => (
            <ServiceCard key={service.serviceId} service={service} />
          )}
          emptyMessage="No matching services found."
        />
      ) : (
        <TableWithPagination
          columns={[
            { label: "Service", width: "w-[200px]" },
            { label: "Client" },
            { label: "Assigned To" },
            { label: "Status", width: "w-[120px]" },
            { label: "Progress" },
            { label: "Due Date" },
            { label: "Actions" },
          ]}
          data={filteredServices}
          rowsPerPage={5}
          renderRow={(service) => (
            <ServiceRow key={service.serviceId} service={service} />
          )}
        />
      )}
    </div>
  );
}
