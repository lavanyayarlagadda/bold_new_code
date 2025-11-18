// import React, { useEffect, useState } from "react";

// export interface TaskData {
//   taskName: string;
//   taskDescription: string;
//   assignedStaff?: string;
//   priority?: string;
//   dueDate?: string;
// }
// //
// export interface Staff {
//   id: number;
//   name: string;
// }

// interface TaskModalProps {
//   open: boolean;
//   onClose: () => void;
//   onSave: (task: TaskData) => void;
//   editingTask?: TaskData | null;
//   staffList?: Staff[];
// }

// const TaskModal: React.FC<TaskModalProps> = ({
//   open,
//   onClose,
//   onSave,
//   editingTask = null,
//   staffList = [],
// }) => {
//   const [taskName, setTaskName] = useState("");
//   const [taskDescription, setTaskDescription] = useState("");
//   const [assignedStaff, setAssignedStaff] = useState("");
//   const [priority, setPriority] = useState("Medium");
//   const [dueDate, setDueDate] = useState("");

//   useEffect(() => {
//     if (editingTask) {
//       setTaskName(editingTask.taskName || "");
//       setTaskDescription(editingTask.taskDescription || "");
//       setAssignedStaff(editingTask.assignedStaff || "");
//       setPriority(editingTask.priority || "Medium");
//       setDueDate(editingTask.dueDate || "");
//     } else {
//       setTaskName("");
//       setTaskDescription("");
//       setAssignedStaff("");
//       setPriority("Medium");
//       setDueDate("");
//     }
//   }, [editingTask, open]);

//   const handleSave = () => {
//     const newTask: TaskData = {
//       taskName,
//       taskDescription,
//       assignedStaff,
//       priority,
//       dueDate,
//     };
//     onSave(newTask);
//     onClose();
//   };

//   if (!open) return null;

//   const isFormValid = taskName.trim() !== "" && taskDescription.trim() !== "";

//   return (
//     <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
//       <div className="bg-white rounded-2xl shadow-lg w-full max-w-lg p-6">
//         <h2 className="text-xl font-semibold mb-4 text-brown-700">
//           {editingTask ? "Edit Task" : "Add Task"}
//         </h2>

//         <div className="space-y-3">
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-1">
//               Task Name
//             </label>
//             <input
//               type="text"
//               value={taskName}
//               onChange={(e) => setTaskName(e.target.value)}
//               className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brown-500"
//               placeholder="Enter task name"
//             />
//           </div>

//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-1">
//               Task Description
//             </label>
//             <textarea
//               value={taskDescription}
//               onChange={(e) => setTaskDescription(e.target.value)}
//               className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brown-500"
//               rows={3}
//               placeholder="Enter task description"
//             ></textarea>
//           </div>

//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-1">
//               Assigned Staff
//             </label>
//             <select
//               value={assignedStaff}
//               onChange={(e) => setAssignedStaff(e.target.value)}
//               className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brown-500"
//             >
//               <option value="">Select Staff</option>
//               {staffList.map((staff) => (
//                 <option key={staff.id} value={staff.name}>
//                   {staff.name}
//                 </option>
//               ))}
//             </select>
//           </div>

//           {/* <div>
//             <label className="block text-sm font-medium text-gray-700 mb-1">
//               Priority
//             </label>
//             <select
//               value={priority}
//               onChange={(e) => setPriority(e.target.value)}
//               className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brown-500"
//             >
//               <option value="Low">Low</option>
//               <option value="Medium">Medium</option>
//               <option value="High">High</option>
//             </select>
//           </div> */}

//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-1">
//               Due Date
//             </label>
//             <input
//               type="date"
//               value={dueDate}
//               onChange={(e) => setDueDate(e.target.value)}
//               className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brown-500"
//             />
//           </div>
//         </div>

//         <div className="mt-6 flex justify-end gap-3">
//           <button
//             onClick={onClose}
//             className="px-4 py-2 rounded-lg border border-gray-300 hover:bg-gray-100"
//           >
//             Cancel
//           </button>
//           <button
//             onClick={handleSave}
//             disabled={!isFormValid}
//             className={`px-4 py-2 rounded-lg text-white ${
//               isFormValid
//                 ? "bg-[#795548] hover:bg-[#5d4037]"
//                 : "bg-gray-400 cursor-not-allowed"
//             }`}
//           >
//             {editingTask ? "Update Task" : "Add Task"}
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default TaskModal;

import { useState, useEffect } from "react";
import { SingleUser, TaskFormData } from "../../redux/services/dropdownApi";

// interface TaskModalProps {
//   open: boolean;
//   onClose: () => void;
//   onSave: (task: TaskFormData) => void;
//   staff: SingleUser[];
//   mode: "create" | "edit";
//   initialTask?: TaskFormData | null;
//   serviceName?: string;
// }

interface TaskModalProps {
  open: boolean;
  onClose: () => void;
  onSave: (task: TaskFormData) => void;
  staff: SingleUser[];
  mode: "create" | "edit";
  initialTask?: TaskFormData | null;
  serviceName?: string;
  serviceId?: number;
  clientId?: number;
  taskId?: number;
  createdBy?:string;
  updatedBy?:string;
}

const TaskModal: React.FC<TaskModalProps> = ({
  open,
  onClose,
  onSave,
  staff,
  mode,
  initialTask,
  serviceId,
  clientId,
  taskId,
  createdBy,
  updatedBy
}) => {
  const [formData, setFormData] = useState<TaskFormData>({
    id: initialTask?.id || undefined,
    taskName: initialTask?.taskName || "",
    taskDescription: initialTask?.taskDescription || "",
    assigneeId: initialTask?.assigneeId || null,
    dueDate: initialTask?.dueDate || "",
    taskTemplateId: initialTask?.taskTemplateId || null,
    serviceId,
    clientId,
    taskId: taskId ? taskId : 0,
    createdBy:  createdBy ? createdBy: "2",
    updatedBy : updatedBy ? updatedBy : "2"
  });

  // reset when editing changes
  useEffect(() => {
    if (initialTask) {
      setFormData({
        id: initialTask.id,
        taskName: initialTask.taskName,
        taskDescription: initialTask.taskDescription,
        assigneeId: initialTask.assigneeId,
        dueDate: initialTask.dueDate,
        taskTemplateId: initialTask?.taskTemplateId,
        serviceId,
        clientId,
        createdBy:" 2",
        updatedBy: "2",
      });
    }
  }, [initialTask]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("formData", formData);
    onSave(formData);
  
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center">
      <div className="bg-white p-6 rounded-xl w-full max-w-lg shadow-xl">
        <h2 className="text-xl font-semibold mb-4">
          {mode === "edit" ? "Update Task" : "Create Task"}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Task Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Task Name *
            </label>
            <input
              type="text"
              value={formData.taskName}
              onChange={(e) =>
                setFormData({ ...formData, taskName: e.target.value })
              }
              className="w-full p-2 border rounded"
              required
              disabled={mode === "edit"}
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              rows={3}
              value={formData.taskDescription}
              onChange={(e) =>
                setFormData({ ...formData, taskDescription: e.target.value })
              }
              className="w-full p-2 border rounded"
               disabled={mode === "edit"}
            />
          </div>

          {/* Assigned Staff */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Assigned Staff / Partner
            </label>

            <select
              value={formData.assigneeId ?? ""}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  assigneeId: Number(e.target.value),
                })
              }
              className="w-full p-2 border rounded"
            >
              <option value="">Select staff</option>

              {staff.map((member) => (
                <option key={member.userId} value={member.userId}>
                  {member.fullName} ({member.role.roleName} –{" "}
                  {member.client.clientName})
                </option>
              ))}
            </select>
          </div>

          {/* Due Date */}
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
              className="w-full p-2 border rounded"
            />
          </div>

          {/* Buttons */}
          <div className="flex justify-end gap-3 mt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-200 rounded"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded"
            >
              {mode === "edit" ? "Update Task" : "Create Task"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TaskModal;
