// import React, { useEffect, useState } from "react";
// import { Link } from "react-router-dom";
// import {
//   Search,
//   // Filter,
//   Plus,
//   Eye,
//   Mail,
//   Phone,
//   Calendar,
//   FolderOpen,
//   User,
//   // ChevronDown,
//   Users as UsersIcon,
// } from "lucide-react";
// import { useAuth } from "../contexts/AuthContext";
// import { mockClients, mockServices } from "../data/mockData";
// import { format, formatDistanceToNow } from "date-fns";

// import {
//   Client,
//   ClientMetric,
//   useClientMetricsQuery,
//   useGetAllClientsMutation,
// } from "../redux/services/clientsApi";

// export default function Clients() {
//   const { user } = useAuth();
//   const { data: metricsData } = useClientMetricsQuery();
//   const [getAllClients, { data: clientsData }] = useGetAllClientsMutation();

//   const [metrics, setMetrics] = useState<ClientMetric>();
//   const [searchQuery, setSearchQuery] = useState("");
//   const [statusFilter, setStatusFilter] = useState("all");
//   const [showFilters, setShowFilters] = useState(false);
//   const [viewMode, setViewMode] = useState<"list" | "grid">("list");
//   const [clients, setClients] = useState<Client[]>([]);

//   useEffect(() => {
//     if (metricsData?.data) {
//       setMetrics(metricsData.data);
//     }
//   }, [metricsData]);

//   useEffect(() => {
//     getAllClients({ searchText: "" });
//   }, []);
//   useEffect(() => {
//     if (clientsData?.data) {
//       setClients(clientsData.data);
//     }
//   }, [clientsData]);

//   const getFilteredClients = () => {
//     let filtered = mockClients;

//     // Role-based filtering
//     if (user?.role === "staff" || user?.role === "partner") {
//       // Filter to show only clients assigned to this staff/partner
//       const assignedServices = mockServices.filter((service) =>
//         service.assignedTo.includes(user.id)
//       );
//       const assignedClientIds = [
//         ...new Set(assignedServices.map((service) => service.clientId)),
//       ];
//       filtered = filtered.filter((client) =>
//         assignedClientIds.includes(client.id)
//       );
//     }

//     // Search filter
//     if (searchQuery) {
//       filtered = filtered.filter(
//         (client) =>
//           client.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
//           client.email.toLowerCase().includes(searchQuery.toLowerCase())
//       );
//     }

//     // Status filter
//     if (statusFilter !== "all") {
//       filtered = filtered.filter((client) => client.status === statusFilter);
//     }

//     return filtered;
//   };

//   const getClientStats = (clientId: string) => {
//     const clientServices = mockServices.filter(
//       (service) => service.clientId === clientId
//     );
//     return {
//       totalServices: clientServices.length,
//       activeServices: clientServices.filter(
//         (service) =>
//           service.status === "in_progress" || service.status === "not_started"
//       ).length,
//       completedServices: clientServices.filter(
//         (service) => service.status === "completed"
//       ).length,
//       overdueServices: clientServices.filter(
//         (service) => service.status === "overdue"
//       ).length,
//     };
//   };

//   const getStatusColor = (status: string) => {
//     switch (status) {
//       case "active":
//         return "bg-green-100 text-green-700";
//       case "inactive":
//         return "bg-gray-100 text-gray-700";
//       case "pending":
//         return "bg-yellow-100 text-yellow-700";
//       default:
//         return "bg-gray-100 text-gray-700";
//     }
//   };

//   const ClientCard = ({ client }: { client: any }) => {
//     const stats = getClientStats(client.id);

//     return (
//       <div className="bg-white rounded-lg border border-gray-200 hover:border-gray-300 hover:shadow-md transition-all p-6">
//         <div className="flex items-start justify-between mb-4">
//           <div className="flex items-center space-x-3">
//             <img
//               src={
//                 client.avatar ||
//                 `https://ui-avatars.com/api/?name=${encodeURIComponent(
//                   client.name
//                 )}&background=0ea5e9&color=fff`
//               }
//               alt={client.name}
//               className="h-12 w-12 rounded-full object-cover"
//             />
//             <div>
//               <h3 className="font-semibold text-gray-900">{client.name}</h3>
//               <p className="text-sm text-gray-600">{client.email}</p>
//             </div>
//           </div>
//           <span
//             className={`px-2 py-1 text-xs rounded-full font-medium ${getStatusColor(
//               client.status
//             )}`}
//           >
//             {client.status}
//           </span>
//         </div>

//         <div className="grid grid-cols-2 gap-4 mb-4">
//           <div className="text-center">
//             <p className="text-2xl font-bold text-blue-600">
//               {stats.totalServices}
//             </p>
//             <p className="text-xs text-gray-600">Total Services</p>
//           </div>
//           <div className="text-center">
//             <p className="text-2xl font-bold text-green-600">
//               {stats.activeServices}
//             </p>
//             <p className="text-xs text-gray-600">Active</p>
//           </div>
//         </div>

//         <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
//           <span className="flex items-center">
//             <Calendar className="h-3 w-3 mr-1" />
//             Onboarded {formatDistanceToNow(client.onboardedAt)} ago
//           </span>
//           {stats.overdueServices > 0 && (
//             <span className="text-red-600 font-medium">
//               {stats.overdueServices} overdue
//             </span>
//           )}
//         </div>

//         <div className="flex items-center justify-between">
//           <div className="flex items-center space-x-2">
//             <button className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
//               <Mail className="h-4 w-4" />
//             </button>
//             <button className="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors">
//               <Phone className="h-4 w-4" />
//             </button>
//           </div>
//           <Link
//             to={`/clients/${client.id}`}
//             className="flex items-center px-3 py-1 text-sm text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-md transition-colors"
//           >
//             <Eye className="h-3 w-3 mr-1" />
//             View Details
//           </Link>
//         </div>
//       </div>
//     );
//   };

//   const ClientRow = ({ client }: { client: any }) => {
//     const stats = getClientStats(client.id);

//     return (
//       <tr className="border-b border-gray-100 hover:bg-gray-50">
//         <td className="py-4 px-4">
//           <div className="flex items-center space-x-3">
//             <img
//               src={
//                 client.avatar ||
//                 `https://ui-avatars.com/api/?name=${encodeURIComponent(
//                   client.name
//                 )}&background=0ea5e9&color=fff`
//               }
//               alt={client.name}
//               className="h-10 w-10 rounded-full object-cover"
//             />
//             <div>
//               <p className="font-medium text-gray-900">{client.name}</p>
//               <p className="text-sm text-gray-500">{client.email}</p>
//             </div>
//           </div>
//         </td>
//         <td className="py-4 px-4 text-sm text-gray-900">{client.email}</td>
//         <td className="py-4 px-4 text-center">
//           <span className="text-lg font-semibold text-gray-900">
//             {stats.totalServices}
//           </span>
//         </td>
//         <td className="py-4 px-4">
//           <span
//             className={`px-2 py-1 text-xs rounded-full font-medium ${getStatusColor(
//               client.status
//             )}`}
//           >
//             {client.status}
//           </span>
//         </td>
//         <td className="py-4 px-4 text-sm text-gray-600">
//           {format(client.onboardedAt, "MMM d, yyyy")}
//         </td>
//         <td className="py-4 px-4">
//           <div className="flex items-center space-x-2">
//             <button className="p-1 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors">
//               <Mail className="h-4 w-4" />
//             </button>
//             <Link
//               to={`/clients/${client.id}`}
//               className="inline-flex items-center px-3 py-1 text-sm text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-md transition-colors"
//             >
//               <Eye className="h-3 w-3 mr-1" />
//               View
//             </Link>
//           </div>
//         </td>
//       </tr>
//     );
//   };

//   const filteredClients = getFilteredClients();

//   return (
//     <div>
//       {/* Header */}
//       <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6">
//         <div>
//           <h1 className="text-2xl font-bold text-gray-900">Clients</h1>
//           <p className="text-gray-600 mt-1">
//             Manage your client relationships and accounts
//           </p>
//         </div>
//         {(user?.role === "admin" || user?.role === "staff") && (
//           <Link
//             to="/clients/invite"
//             className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors mt-4 sm:mt-0"
//           >
//             <Plus className="h-4 w-4 mr-2" />
//             Invite Client
//           </Link>
//         )}
//       </div>

//       {/* Stats Overview */}
//       <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
//         <div className="bg-white rounded-lg border border-gray-200 p-6">
//           <div className="flex items-center justify-between">
//             <div>
//               <p className="text-sm font-medium text-gray-600">Total Clients</p>
//               <p className="text-2xl font-bold text-gray-900">
//                 {metrics?.totalClients}
//               </p>
//             </div>
//             <div className="p-3 rounded-full bg-blue-100">
//               <UsersIcon className="h-6 w-6 text-blue-600" />
//             </div>
//           </div>
//         </div>

//         <div className="bg-white rounded-lg border border-gray-200 p-6">
//           <div className="flex items-center justify-between">
//             <div>
//               <p className="text-sm font-medium text-gray-600">
//                 Active Clients
//               </p>
//               <p className="text-2xl font-bold text-gray-900">
//                 {/* {filteredClients.filter((c) => c.status === "active").length} */}
//                 {metrics?.activeClients}
//               </p>
//             </div>
//             <div className="p-3 rounded-full bg-green-100">
//               <User className="h-6 w-6 text-green-600" />
//             </div>
//           </div>
//         </div>

//         <div className="bg-white rounded-lg border border-gray-200 p-6">
//           <div className="flex items-center justify-between">
//             <div>
//               <p className="text-sm font-medium text-gray-600">Pending</p>
//               <p className="text-2xl font-bold text-gray-900">
//                 {/* {filteredClients.filter((c) => c.status === "pending").length} */}
//                 {metrics?.inactiveClients}
//               </p>
//             </div>
//             <div className="p-3 rounded-full bg-yellow-100">
//               <Calendar className="h-6 w-6 text-yellow-600" />
//             </div>
//           </div>
//         </div>

//         <div className="bg-white rounded-lg border border-gray-200 p-6">
//           <div className="flex items-center justify-between">
//             <div>
//               <p className="text-sm font-medium text-gray-600">
//                 Total Services
//               </p>
//               <p className="text-2xl font-bold text-gray-900">
//                 {/* {filteredClients.reduce(
//                   (total, client) =>
//                     total + getClientStats(client.id).totalServices,
//                   0
//                 )} */}
//                 {metrics?.totalServices}
//               </p>
//             </div>
//             <div className="p-3 rounded-full bg-purple-100">
//               <FolderOpen className="h-6 w-6 text-purple-600" />
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Filters and Search */}
//       <div className="bg-white rounded-lg border border-gray-200 p-4 mb-6">
//         <div className="flex flex-col lg:flex-row lg:items-center space-y-4 lg:space-y-0 lg:space-x-4">
//           {/* Search */}
//           <div className="flex-1 relative">
//             <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
//             <input
//               type="text"
//               placeholder="Search clients..."
//               value={searchQuery}
//               onChange={(e) => setSearchQuery(e.target.value)}
//               className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//             />
//           </div>

//           {/* Filters */}
//           {/* <div className="flex items-center space-x-2">
//             <button
//               onClick={() => setShowFilters(!showFilters)}
//               className="flex items-center px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
//             >
//               <Filter className="h-4 w-4 mr-2" />
//               Filters
//               <ChevronDown className={`h-4 w-4 ml-1 transform transition-transform ${showFilters ? 'rotate-180' : ''}`} />
//             </button>

//             <div className="flex border border-gray-300 rounded-lg overflow-hidden">
//               <button
//                 onClick={() => setViewMode('list')}
//                 className={`px-3 py-2 text-sm ${viewMode === 'list' ? 'bg-blue-100 text-blue-700' : 'text-gray-600 hover:bg-gray-50'}`}
//               >
//                 List
//               </button>
//               <button
//                 onClick={() => setViewMode('grid')}
//                 className={`px-3 py-2 text-sm ${viewMode === 'grid' ? 'bg-blue-100 text-blue-700' : 'text-gray-600 hover:bg-gray-50'}`}
//               >
//                 Grid
//               </button>
//             </div>
//           </div> */}
//         </div>

//         {/* Filter Options */}
//         {showFilters && (
//           <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4 pt-4 border-t border-gray-200">
//             <select
//               value={statusFilter}
//               onChange={(e) => setStatusFilter(e.target.value)}
//               className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//             >
//               <option value="all">All Statuses</option>
//               <option value="active">Active</option>
//               <option value="inactive">Inactive</option>
//               <option value="pending">Pending</option>
//             </select>

//             <select className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
//               <option value="all">All Staff</option>
//               <option value="assigned">Assigned to Me</option>
//               <option value="unassigned">Unassigned</option>
//             </select>

//             <button
//               onClick={() => {
//                 setStatusFilter("all");
//                 setSearchQuery("");
//               }}
//               className="px-3 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-50 border border-gray-300 rounded-lg transition-colors"
//             >
//               Clear Filters
//             </button>
//           </div>
//         )}
//       </div>

//       {/* Clients List/Grid */}
//       {viewMode === "grid" ? (
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//           {filteredClients.map((client) => (
//             <ClientCard key={client.id} client={client} />
//           ))}
//         </div>
//       ) : (
//         <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
//           <div className="overflow-x-auto">
//             <table className="w-full">
//               <thead className="bg-gray-50 border-b border-gray-200">
//                 <tr>
//                   <th className="text-left py-3 px-4 font-medium text-gray-700">
//                     Client
//                   </th>
//                   <th className="text-left py-3 px-4 font-medium text-gray-700">
//                     Email
//                   </th>
//                   <th className="text-left py-3 px-4 font-medium text-gray-700">
//                     Services
//                   </th>
//                   <th className="text-left py-3 px-4 font-medium text-gray-700">
//                     Status
//                   </th>
//                   <th className="text-left py-3 px-4 font-medium text-gray-700">
//                     Onboarded
//                   </th>
//                   <th className="text-left py-3 px-4 font-medium text-gray-700">
//                     Actions
//                   </th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {filteredClients.map((client) => (
//                   <ClientRow key={client.id} client={client} />
//                 ))}
//               </tbody>
//             </table>
//           </div>
//         </div>
//       )}

//       {filteredClients.length === 0 && (
//         <div className="text-center py-12">
//           <UsersIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
//           <h3 className="text-lg font-medium text-gray-900 mb-2">
//             No clients found
//           </h3>
//           <p className="text-gray-600 mb-4">
//             {searchQuery || statusFilter !== "all"
//               ? "Try adjusting your search or filters"
//               : "Get started by inviting your first client"}
//           </p>
//           {(user?.role === "admin" || user?.role === "staff") &&
//             !searchQuery && (
//               <Link
//                 to="/clients/invite"
//                 className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
//               >
//                 <Plus className="h-4 w-4 mr-2" />
//                 Invite Client
//               </Link>
//             )}
//         </div>
//       )}
//     </div>
//   );
// }

import React, { useEffect, useState } from "react";
import { Search, Eye, Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";

import {
  Client,
  ClientMetric,
  useClientMetricsQuery,
  useGetAllClientsMutation,
} from "../redux/services/clientsApi";
import TableWithPagination from "../components/TableWithPagination";
import PageHeader from "../components/common/PageHeader";

export default function Clients() {
  const navigate = useNavigate();
  const { data: metricsData } = useClientMetricsQuery();
  const [getAllClients, { data: clientsData }] = useGetAllClientsMutation();

  const [metrics, setMetrics] = useState<ClientMetric>();
  const [clients, setClients] = useState<Client[]>([]);
  const [searchText, setSearchText] = useState("");

  const [typingTimeout, setTypingTimeout] = useState<any>(null);

  //  Load metrics
  useEffect(() => {
    if (metricsData?.data) setMetrics(metricsData.data);
  }, [metricsData]);

  //  Load all clients initially
  useEffect(() => {
    getAllClients({ searchText: "" });
  }, []);

  //  Store client list into state
  useEffect(() => {
    if (clientsData?.data) {
      setClients(clientsData.data);
    }
  }, [clientsData]);

  //  Handle Search
  // const handleSearch = () => {
  //   getAllClients({ searchText });
  // };
  const handleSearchChange = (value: string) => {
    setSearchText(value);

    // Clear previous timer
    if (typingTimeout) clearTimeout(typingTimeout);

    // Create new timer
    const newTimeout = setTimeout(() => {
      getAllClients({ searchText: value });
    }, 400); // 400ms delay

    setTypingTimeout(newTimeout);
  };

  const columns = [
    { label: "Client Name" },
    { label: "Email" },
    { label: "Phone" },
    { label: "Services" },
    { label: "Documents" },
  ];

  const renderRow = (client: Client) => (
    <tr
      key={client.clientId}
      className="border-b border-gray-200 hover:bg-gray-50"
    >
      <td className="py-3 px-4 font-medium">{client.clientName}</td>
      <td className="py-3 px-4">{client.clientEmail}</td>
      <td className="py-3 px-4">{client.clientPhone}</td>
      <td className="py-3 px-4 text-center">{client.totalServices}</td>
      <td className="py-3 px-4 text-center">{client.totalDocuments}</td>
    </tr>
  );

  return (
    <div>
      {/* HEADER */}

      <PageHeader
        title="Clients"
        buttonText="Invite Client"
        onButtonClick={() => navigate("/clients/invite")}
      />

      {/* METRICS */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <MetricBox title="Total Clients" value={metrics?.totalClients} />
        <MetricBox title="Active Clients" value={metrics?.activeClients} />
        <MetricBox title="Inactive Clients" value={metrics?.inactiveClients} />
        <MetricBox title="Total Services" value={metrics?.totalServices} />
      </div>

      {/* SEARCH BAR */}
      <div className="bg-white border rounded-lg p-4 mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />

          <input
            type="text"
            placeholder="Search clients..."
            value={searchText}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="pl-10 pr-4 py-2 border rounded-lg w-full"
          />
        </div>
      </div>

      {/* TABLE WITH PAGINATION */}
      <TableWithPagination
        columns={columns}
        data={clients}
        rowsPerPage={5}
        renderRow={(row) => renderRow(row)}
        showPagination={true}
      />

      {clients.length === 0 && (
        <p className="text-center text-gray-600 mt-8">No clients found.</p>
      )}
    </div>
  );
}

function MetricBox({ title, value }: { title: string; value?: number }) {
  return (
    <div className="bg-white border rounded-lg p-6">
      <p className="text-gray-500 text-sm">{title}</p>
      <p className="text-2xl font-bold">{value ?? 0}</p>
    </div>
  );
}
