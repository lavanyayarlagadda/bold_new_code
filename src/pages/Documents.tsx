// import React, { useState, useRef, useEffect, useMemo } from "react";
// import {
//   Upload,
//   Search,
//   Filter,
//   FileText,
//   Download,
//   Eye,
//   Trash2,
//   Calendar,
//   User,
//   Tag,
//   ChevronDown,
//   Plus,
//   X,
// } from "lucide-react";
// import { useAuth } from "../contexts/AuthContext";
// import { mockDocuments, mockServices, mockClients } from "../data/mockData";
// import { format, formatDistanceToNow } from "date-fns";
// import {
//   Client,
//   Status,
//   useGetAllClientsQuery,
//   useGetAllServicesQuery,
// } from "../redux/services/dropdownApi";
//   import { useUploadDocumentsMutation } from "../redux/services/uploadDocumentApi";
// import { toast } from "react-toastify";

// export default function Documents() {
//   const { user } = useAuth();

//   const { data: clientsData } = useGetAllClientsQuery();
//   const { data: statusData } = useGetAllServicesQuery();

//   const [searchQuery, setSearchQuery] = useState("");
//   const [serviceFilter, setServiceFilter] = useState("all");
//   const [showFilters, setShowFilters] = useState(false);
//   const [dragActive, setDragActive] = useState(false);
//   // const [uploadingFiles, setUploadingFiles] = useState<File[]>([]);
//   const fileInputRef = useRef<HTMLInputElement>(null);
//   const [client, setClient] = useState("");
//   const [service, setService] = useState("");
//   const [clientsDataState, setClientsDataState] = useState<Client[]>([]);
//   const [statusDataState, setStatusDataState] = useState<Status[]>([]);
//   const [uploadedFilesList, setUploadedFilesList] = useState<File[]>([]);

//   const clients = useMemo(() => clientsData?.data || [], [clientsData]);

//   // const Statueses = useMemo(statusData?.data || [];
//   const statuses = useMemo(() => statusData?.data || [], [statusData]);

//   const [uploadDocuments] = useUploadDocumentsMutation();
 
// const [files, setFiles] = useState<File[]>([]);
// const userId = 2

// const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//   if (e.target.files) {
//     setFiles(Array.from(e.target.files));
//   }
// };
// const handleUpload = async () => {
//   const formData = new FormData();

//   formData.append("serviceId", service);   
//   formData.append("userId", userId.toString());         

//   files.forEach((file) => {
//     formData.append("documents", file); // backend expects "documents"
//   });

//   try {
//     const res = await uploadDocuments(formData).unwrap();
//     console.log("Upload success:", res);
//     toast.success("Files uploaded successfully!");
//   } catch (error) {
//     toast.error("Error uploading files");
//   }
// };

//   useEffect(() => {
//     if (clients?.length) {
//       setClientsDataState(clients);
//     }
//   }, [clients]);

//   useEffect(() => {
//     if (statuses?.length) {
//       setStatusDataState(statuses);
//     }
//   }, [statuses]);

//   const getFilteredDocuments = () => {
//     let filtered = mockDocuments;

//     // Role-based filtering
//     if (user?.role === "client") {
//       filtered = filtered.filter((doc) => doc.isClientVisible);
//     }

//     // Search filter
//     if (searchQuery) {
//       filtered = filtered.filter(
//         (doc) =>
//           doc.originalName.toLowerCase().includes(searchQuery.toLowerCase()) ||
//           doc.tags.some((tag) =>
//             tag.toLowerCase().includes(searchQuery.toLowerCase())
//           )
//       );
//     }

//     // Service filter
//     if (serviceFilter !== "all") {
//       filtered = filtered.filter((doc) => doc.serviceId === serviceFilter);
//     }

//     return filtered;
//   };

//   const handleDrag = (e: React.DragEvent) => {
//     e.preventDefault();
//     e.stopPropagation();
//     if (!client || !service) return;
//     if (e.type === "dragenter" || e.type === "dragover") {
//       setDragActive(true);
//     } else if (e.type === "dragleave") {
//       setDragActive(false);
//     }
//   };

//   const handleDrop = (e: React.DragEvent) => {
//     e.preventDefault();
//     e.stopPropagation();
//     setDragActive(false);
//     if (!client || !service) return;
//     if (e.dataTransfer.files && e.dataTransfer.files[0]) {
//       handleFiles(e.dataTransfer.files);
//     }
//   };

//   const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
//     if (!client || !service) return;
//     if (e.target.files) {
//       handleFiles(e.target.files);
//     }
//   };

//   const handleFiles = (files: FileList) => {
//     const newFiles = Array.from(files);

//     // Simulate upload process
//     newFiles.forEach((file, index) => {
//       setTimeout(() => {
//         setUploadedFilesList((prev) => [...prev, file]);
//         console.log("File uploaded:", file.name);
//       }, (index + 1) * 1500);
//     });
//   };

//   const getFileIcon = (mimeType: string) => {
//     if (mimeType.includes("pdf")) return "📄";
//     if (mimeType.includes("image")) return "🖼️";
//     if (mimeType.includes("zip")) return "📦";
//     if (mimeType.includes("document") || mimeType.includes("word")) return "📝";
//     if (mimeType.includes("spreadsheet") || mimeType.includes("excel"))
//       return "📊";
//     return "📄";
//   };

//   const formatFileSize = (bytes: number) => {
//     if (bytes === 0) return "0 Bytes";
//     const k = 1024;
//     const sizes = ["Bytes", "KB", "MB", "GB"];
//     const i = Math.floor(Math.log(bytes) / Math.log(k));
//     return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
//   };

//   const filteredDocuments = getFilteredDocuments();
//   const isUploadEnabled = client !== "" && service !== "";
//   const handleSubmitUpload = () => {
//     const payload = {
//       clientId: client,
//       serviceId: service,
//       uploadedFiles: uploadedFilesList,
//       userId:2
//     };

//     console.log("SUBMIT PAYLOAD:", payload);

//     // TODO: Call your API here
//     // uploadDocumentsApi(payload)

//     alert("Documents submitted successfully!");
//   };

//   const handleDeleteFile = (index: number) => {
//     setUploadedFilesList((prev) => prev.filter((_, i) => i !== index));
//   };

//   return (
//     <div>
//       {/* Header */}
//       <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6">
//         <div>
//           <h1 className="text-2xl font-bold text-gray-900">Document Hub</h1>
//           <p className="text-gray-600 mt-1">
//             Manage and organize all your files in one place
//           </p>
//         </div>
//       </div>

//       {/* Upload Area */}

//       <div className="flex flex-col md:flex-row gap-6">
//         {/* Left: Dropdowns */}
//         <div className="md:w-1/3 w-full space-y-4">
//           <div>
//             <label className="block text-gray-700 font-medium mb-2">
//               Select Client *
//             </label>
//             <select
//               value={client}
//               onChange={(e) => {
//                 setClient(e.target.value);
//               }}
//               className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//             >
//               <option value="">Select Client</option>
//               {clientsDataState.map((c) => (
//                 <option key={c.clientId} value={c.clientId}>
//                   {c.clientName}
//                 </option>
//               ))}
//             </select>
//           </div>

//           <div>
//             <label className="block text-gray-700 font-medium mb-2">
//               Select Service *
//             </label>
//             <select
//               value={service}
//               onChange={(e) => setService(e.target.value)}
//               className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//             >
//               <option value="">Select Service</option>
//               {statusDataState.map((s) => (
//                 <option key={s.statusId} value={s.statusId}>
//                   {s.statusName}
//                 </option>
//               ))}
//             </select>
//           </div>
//         </div>
//         {/* Right: Upload Section */}
//         <div className="md:w-2/3 w-full space-y-4">
//           <div
//             className={`relative border-2 border-dashed rounded-xl p-8 text-center transition-colors ${
//               !isUploadEnabled
//                 ? "border-gray-300 bg-gray-100 cursor-not-allowed"
//                 : dragActive
//                 ? "border-blue-500 bg-blue-50"
//                 : "border-gray-300 hover:border-gray-400"
//             }`}
//             onDragEnter={handleDrag}
//             onDragLeave={handleDrag}
//             onDragOver={handleDrag}
//             onDrop={handleDrop}
//           >
//             <input
//               ref={fileInputRef}
//               type="file"
//               multiple
//               onChange={handleFileInput}
//               disabled={!isUploadEnabled}
//               className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
//             />
//             <Upload
//               className={`h-12 w-12 mx-auto mb-4 ${
//                 isUploadEnabled ? "text-gray-400" : "text-gray-300"
//               }`}
//             />
//             <h3 className="text-lg font-medium text-gray-900 mb-2">
//               Upload Documents
//             </h3>
//             <p className="text-gray-600 mb-4">
//               {isUploadEnabled
//                 ? "Drag and drop files here, or click to browse"
//                 : "Select Client and Service first"}
//             </p>
//             <button
//               onClick={() => isUploadEnabled && fileInputRef.current?.click()}
//               disabled={!isUploadEnabled}
//               className={`inline-flex items-center px-4 py-2 rounded-lg transition-colors ${
//                 isUploadEnabled
//                   ? "bg-blue-600 text-white hover:bg-blue-700"
//                   : "bg-gray-400 text-gray-200 cursor-not-allowed"
//               }`}
//             >
//               <Plus className="h-4 w-4 mr-2" />
//               Choose Files
//             </button>
//           </div>

//           {uploadedFilesList.length > 0 && (
//             <div className="mt-6">
//               <h3 className="text-lg font-semibold mb-2">Uploaded Files</h3>

//               <div className="space-y-2">
//                 {uploadedFilesList.map((file, i) => (
//                   <div
//                     key={i}
//                     className="flex items-center justify-between bg-gray-50 px-3 py-2 rounded border"
//                   >
//                     <div className="flex items-center space-x-2">
//                       <FileText className="h-4 w-4 text-gray-600" />
//                       <span className="text-sm">{file.name}</span>
//                       <span className="text-xs text-gray-500">
//                         {(file.size / 1024).toFixed(1)} KB
//                       </span>
//                     </div>

//                     <div>
//                       {" "}
//                       <button
//                         onClick={() => handleDeleteFile(i)}
//                         className="text-red-500 text-sm hover:underline"
//                       >
//                         Delete
//                       </button>
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             </div>
//           )}
//         </div>
//       </div>
//       <button
//         disabled={!client || !service || uploadedFilesList.length === 0}
//         onClick={handleSubmitUpload}
//         className={`mt-4 w-full px-4 py-2 rounded-lg text-white 
//       ${
//         client && service && uploadedFilesList.length
//           ? "bg-green-600 hover:bg-green-700"
//           : "bg-gray-400 cursor-not-allowed"
//       }`}
//       >
//         Submit Upload
//       </button>
//       {/* Search and Filters */}
//       <div className="bg-white rounded-lg border border-gray-200 p-4 mb-6">
//         <div className="flex flex-col lg:flex-row lg:items-center space-y-4 lg:space-y-0 lg:space-x-4">
//           {/* Search */}
//           <div className="flex-1 relative">
//             <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
//             <input
//               type="text"
//               placeholder="Search documents..."
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
//           </div>
//         </div>

//         {/* Filter Options */}
//         {showFilters && (
//           <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4 pt-4 border-t border-gray-200">
//             <select
//               value={serviceFilter}
//               onChange={(e) => setServiceFilter(e.target.value)}
//               className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//             >
//               <option value="all">All Services</option>
//               {mockServices.map((service) => (
//                 <option key={service.id} value={service.id}>
//                   {service.name}
//                 </option>
//               ))}
//             </select>

//             <div className="flex items-center space-x-2">
//               <input
//                 type="date"
//                 className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                 placeholder="Upload date"
//               />
//             </div>

//             <button
//               onClick={() => {
//                 setServiceFilter("all");
//                 setSearchQuery("");
//               }}
//               className="px-3 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-50 border border-gray-300 rounded-lg transition-colors"
//             >
//               Clear Filters
//             </button>
//           </div>
//         )}
//       </div>

//       {/* Documents Grid */}
//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
//         {filteredDocuments.map((doc) => {
//           const service = mockServices.find((s) => s.id === doc.serviceId);
//           const client = mockClients.find((c) => c.id === service?.clientId);

//           return (
//             <div
//               key={doc.id}
//               className="bg-white rounded-lg border border-gray-200 hover:border-gray-300 hover:shadow-md transition-all p-4"
//             >
//               <div className="flex items-start justify-between mb-3">
//                 <div className="text-2xl">{getFileIcon(doc.mimeType)}</div>
//                 <div className="flex items-center space-x-1">
//                   <button className="p-1 hover:bg-gray-100 rounded">
//                     <Eye className="h-4 w-4 text-gray-400" />
//                   </button>
//                   <button className="p-1 hover:bg-gray-100 rounded">
//                     <Download className="h-4 w-4 text-gray-400" />
//                   </button>
//                   {(user?.role === "admin" || user?.role === "staff") && (
//                     <button className="p-1 hover:bg-gray-100 rounded">
//                       <Trash2 className="h-4 w-4 text-gray-400 hover:text-red-500" />
//                     </button>
//                   )}
//                 </div>
//               </div>

//               <h3
//                 className="font-medium text-gray-900 mb-2 line-clamp-2"
//                 title={doc.originalName}
//               >
//                 {doc.originalName}
//               </h3>

//               <div className="space-y-2 text-sm text-gray-600">
//                 <div className="flex items-center space-x-2">
//                   <Calendar className="h-3 w-3" />
//                   <span>{formatDistanceToNow(doc.uploadedAt)} ago</span>
//                 </div>

//                 <div className="flex items-center space-x-2">
//                   <User className="h-3 w-3" />
//                   <span>{doc.uploadedBy === "4" ? "Client" : "Staff"}</span>
//                 </div>

//                 <div className="flex items-center space-x-2">
//                   <FileText className="h-3 w-3" />
//                   <span>{formatFileSize(doc.size)}</span>
//                 </div>

//                 {service && (
//                   <div className="text-xs text-blue-600 bg-blue-50 px-2 py-1 rounded">
//                     {service.name}
//                   </div>
//                 )}
//               </div>

//               {/* Tags */}
//               {doc.tags.length > 0 && (
//                 <div className="mt-3 flex flex-wrap gap-1">
//                   {doc.tags.slice(0, 3).map((tag) => (
//                     <span
//                       key={tag}
//                       className="inline-flex items-center px-2 py-0.5 text-xs bg-gray-100 text-gray-700 rounded"
//                     >
//                       <Tag className="h-2 w-2 mr-1" />
//                       {tag}
//                     </span>
//                   ))}
//                   {doc.tags.length > 3 && (
//                     <span className="text-xs text-gray-500">
//                       +{doc.tags.length - 3}
//                     </span>
//                   )}
//                 </div>
//               )}
//             </div>
//           );
//         })}
//       </div>

//       {filteredDocuments.length === 0 && (
//         <div className="text-center py-12">
//           <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
//           <h3 className="text-lg font-medium text-gray-900 mb-2">
//             No documents found
//           </h3>
//           <p className="text-gray-600 mb-4">
//             {searchQuery || serviceFilter !== "all"
//               ? "Try adjusting your search or filters"
//               : "Upload your first document to get started"}
//           </p>
//         </div>
//       )}
//     </div>
//   );
// }
import React, { useState, useRef, useEffect, useMemo } from "react";
import {
  Upload,
  Search,
  Filter,
  FileText,
  Download,
  Eye,
  Trash2,
  Calendar,
  User,
  Tag,
  ChevronDown,
  Plus,
} from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import { mockDocuments, mockServices, mockClients } from "../data/mockData";
import { formatDistanceToNow } from "date-fns";
import {
  Client,
  Status,
  useGetAllClientsQuery,
  useGetAllServicesQuery,
} from "../redux/services/dropdownApi";

import { useUploadDocumentsMutation } from "../redux/services/uploadDocumentApi";
import { toast } from "react-toastify";

export default function Documents() {
  const { user } = useAuth();

  const { data: clientsData } = useGetAllClientsQuery();
  const { data: statusData } = useGetAllServicesQuery();

  const [searchQuery, setSearchQuery] = useState("");
  const [serviceFilter, setServiceFilter] = useState("all");
  const [showFilters, setShowFilters] = useState(false);
  const [dragActive, setDragActive] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const [client, setClient] = useState("");
  const [service, setService] = useState("");

  const [clientsDataState, setClientsDataState] = useState<Client[]>([]);
  const [statusDataState, setStatusDataState] = useState<Status[]>([]);
  const [uploadedFilesList, setUploadedFilesList] = useState<File[]>([]);

  const [uploadDocuments, { isLoading: isUploading }] =
    useUploadDocumentsMutation();

  const userId = user?.userId || 2;

  // Load client & service dropdown data
  useEffect(() => {
    if (clientsData?.data) setClientsDataState(clientsData.data);
  }, [clientsData]);

  useEffect(() => {
    if (statusData?.data) setStatusDataState(statusData.data);
  }, [statusData]);

  const isUploadEnabled = client !== "" && service !== "";

  // ----------------------------
  // DRAG & DROP UPLOAD
  // ----------------------------
  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isUploadEnabled) return;

    if (e.type === "dragenter" || e.type === "dragover") setDragActive(true);
    else if (e.type === "dragleave") setDragActive(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (!isUploadEnabled) return;
    if (e.dataTransfer.files.length) handleFiles(e.dataTransfer.files);
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!isUploadEnabled) return;
    if (e.target.files) handleFiles(e.target.files);
  };

  const handleFiles = (files: FileList) => {
    const newFiles = Array.from(files);
    setUploadedFilesList((prev) => [...prev, ...newFiles]);
  };

  const handleDeleteFile = (index: number) => {
    setUploadedFilesList((prev) => prev.filter((_, i) => i !== index));
  };

  // ----------------------------
  // API UPLOAD
  // ----------------------------
  const handleSubmitUpload = async () => {
    if (uploadedFilesList.length === 0) {
      toast.error("Please select at least one file");
      return;
    }

    const formData = new FormData();

    formData.append("clientId", client);
    formData.append("serviceId", service);
    formData.append("userId", String(userId));

    uploadedFilesList.forEach((file) => {
      formData.append("files", file);
    });

    try {
      const res = await uploadDocuments(formData).unwrap();
      toast.success("Files uploaded successfully!");

      // clear files after upload
      setUploadedFilesList([]);

      console.log("UPLOAD RESPONSE:", res);
    } catch (err) {
      console.error("UPLOAD ERROR:", err);
      toast.error("Failed to upload documents");
    }
  };

  // Filter documents
  const filteredDocuments = useMemo(() => {
    let filtered = mockDocuments;

    if (user?.role === "client") {
      filtered = filtered.filter((doc) => doc.isClientVisible);
    }

    if (searchQuery) {
      filtered = filtered.filter((doc) =>
        doc.originalName.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (serviceFilter !== "all") {
      filtered = filtered.filter((doc) => doc.serviceId === serviceFilter);
    }

    return filtered;
  }, [searchQuery, serviceFilter, user]);

  // ----------------------------
  // RENDER
  // ----------------------------
  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Document Hub</h1>

      {/* Upload Section */}
      <div className="flex gap-6">
        {/* Left filters */}
        <div className="w-1/3 space-y-4">
          <div>
            <label className="block text-gray-700 mb-2">Select Client *</label>
            <select
              value={client}
              onChange={(e) => setClient(e.target.value)}
              className="w-full border px-3 py-2 rounded"
            >
              <option value="">Select Client</option>
              {clientsDataState.map((c) => (
                <option key={c.clientId} value={c.clientId}>
                  {c.clientName}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-gray-700 mb-2">Select Service *</label>
            <select
              value={service}
              onChange={(e) => setService(e.target.value)}
              className="w-full border px-3 py-2 rounded"
            >
              <option value="">Select Service</option>
              {statusDataState.map((s) => (
                <option key={s.statusId} value={s.statusId}>
                  {s.statusName}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Right Upload Section */}
        <div className="w-2/3">
          <div
            className={`border-2 border-dashed rounded-lg p-6 text-center ${
              isUploadEnabled ? "bg-white" : "bg-gray-100 opacity-50"
            }`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            <input
              ref={fileInputRef}
              type="file"
              multiple
              onChange={handleFileInput}
              disabled={!isUploadEnabled}
              className="hidden"
            />

            <Upload className="w-12 h-12 mx-auto mb-4 text-gray-400" />

            <h3 className="text-lg font-medium mb-2">Upload Documents</h3>
            <p className="text-gray-600 mb-4">
              Drag & drop files here, or click the button
            </p>

            <button
              onClick={() => fileInputRef.current?.click()}
              disabled={!isUploadEnabled}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:bg-gray-300"
            >
              <Plus className="w-4 h-4 inline-block mr-1" />
              Choose Files
            </button>
          </div>

          {uploadedFilesList.length > 0 && (
            <div className="mt-4 space-y-2">
              {uploadedFilesList.map((file, index) => (
                <div
                  key={index}
                  className="flex justify-between p-3 border rounded bg-gray-50"
                >
                  <span>{file.name}</span>
                  <button
                    onClick={() => handleDeleteFile(index)}
                    className="text-red-600 text-sm"
                  >
                    Delete
                  </button>
                </div>
              ))}
            </div>
          )}

          <button
            disabled={!isUploadEnabled || uploadedFilesList.length === 0}
            onClick={handleSubmitUpload}
            className="mt-4 w-full bg-green-600 text-white py-2 rounded disabled:bg-gray-400"
          >
            {isUploading ? "Uploading..." : "Submit Upload"}
          </button>
        </div>
      </div>

      {/* Documents Grid */}
      {/* <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-10">
        {filteredDocuments.map((doc) => {
          const service = mockServices.find((s) => s.id === doc.serviceId);
          const client = mockClients.find((c) => c.id === service?.clientId);

          return (
            <div key={doc.id} className="border p-4 rounded">
              <h3 className="font-semibold">{doc.originalName}</h3>
              <p className="text-sm text-gray-500">
                {formatDistanceToNow(doc.uploadedAt)} ago
              </p>
              <p className="text-xs mt-2 text-blue-600">{service?.name}</p>
            </div>
          );
        })}
      </div> */}
    </div>
  );
}
