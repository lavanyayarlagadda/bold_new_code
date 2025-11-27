import React, { useState, useEffect } from "react";
import { X } from "lucide-react";
import { UserItem } from "../redux/services/usersApi";
import { Client, useGetAllClientsQuery } from "../redux/services/dropdownApi";
import { Eye, EyeOff } from "lucide-react";

interface Props {
  open: boolean;
  onClose: () => void;
  mode: "create" | "edit";
  user: UserItem | null;
  onSubmit: (formData: any) => void;
}

export default function UserDrawer({
  open,
  onClose,
  mode,
  user,
  onSubmit,
}: Props) {
  const { data: clientsData } = useGetAllClientsQuery();

  const [clientsDataState, setClientsDataState] = useState<Client[]>([]);
  // const [showPassword, setShowPassword] = useState(false);
  // const [showOldPassword, setShowOldPassword] = useState(false);
  // const [showNewPassword, setShowNewPassword] = useState(false);

  const [formData, setFormData] = React.useState({
    fullName: "",
    email: "",
    roleId: "",
    clientId: "",
    createdBy: "",
    phoneNumber: "",
    // password: "",
    // oldPassword: "",
    // newPassword: "",
  });

  useEffect(() => {
    if (clientsData?.data) setClientsDataState(clientsData.data);
  }, [clientsData]);

  useEffect(() => {
    if (user) {
      setFormData({
        fullName: user.fullName || "",
        email: user.email || "",
        roleId: user.roleId?.toString() || "",
        clientId: user.clientId?.toString() || "",
        createdBy: user.createdBy?.toString() || "",
        phoneNumber: user.phoneNumber?.toString() || "",
        // password: "",
        // oldPassword: "",
        // newPassword: "",
      });
    } else {
      setFormData({
        fullName: "",
        email: "",
        roleId: "",
        clientId: "",
        createdBy: "",
        phoneNumber: "",
        // password: "",
        // oldPassword: "",
        // newPassword: "",
      });
    }
  }, [user, mode]);

  if (!open) return null;
  const roles = [
    { roleId: 1, roleName: "Admin" },
    { roleId: 2, roleName: "Staff" },
    { roleId: 3, roleName: "User" },
  ];

  if (mode === "edit" && !formData.email) {
    return (
      <div className="fixed inset-0 bg-black/40 flex justify-end z-50">
        <div className="w-[400px] bg-white h-full flex items-center justify-center">
          <p>Loading user details...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/40 flex justify-end z-50">
      <div className="w-[400px] bg-white h-full shadow-xl animate-slideIn flex flex-col">
        {/* HEADER */}
        <div className="flex items-center justify-between px-5 py-4 border-b">
          <h2 className="text-xl font-semibold">
            {mode === "create" ? "Create User" : "Edit User"}
          </h2>
          <button onClick={onClose}>
            <X className="w-6 h-6 text-gray-600" />
          </button>
        </div>

        {/* BODY */}
        <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4">
          {/* Full Name */}
          <div>
            <label className="text-sm font-medium">Full Name</label>
            <input
              type="text"
              value={formData.fullName}
              onChange={(e) =>
                setFormData({ ...formData, fullName: e.target.value })
              }
              className="w-full border p-2 rounded-md"
            />
          </div>
          {/* phone number */}
          <div>
            <label className="text-sm font-medium">Phone Number</label>
            <input
              value={formData.phoneNumber}
              onChange={(e) =>
                setFormData({ ...formData, phoneNumber: e.target.value })
              }
              className="w-full border p-2 rounded-md"
            />
          </div>
          {/* Email */}
          <div>
            <label className="text-sm font-medium">Email</label>
            <input
              type="email"
              value={formData.email}
              disabled={mode === "edit"}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              className="w-full border p-2 rounded-md"
            />
          </div>

          {/* CREATE MODE → Password */}
          {/* {mode === "create" && (
            <div>
              <label className="text-sm font-medium">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={formData.password || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                  className="w-full border p-2 rounded-md pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-2.5 text-gray-500"
                >
                  {showPassword ? <Eye size={18} /> : <EyeOff size={18} />}
                </button>
              </div>
            </div>
          )} */}

          {/* EDIT MODE → Old Password */}
          {/* {mode === "edit" && (
            <div>
              <label className="text-sm font-medium">
                Old Password (optional)
              </label>
              <div className="relative">
                <input
                  type={showOldPassword ? "text" : "password"}
                  value={formData.oldPassword || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, oldPassword: e.target.value })
                  }
                  className="w-full border p-2 rounded-md pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowOldPassword(!showOldPassword)}
                  className="absolute right-3 top-2.5 text-gray-500"
                >
                  {showOldPassword ? <Eye size={18} /> : <EyeOff size={18} />}
                </button>
              </div>
            </div>
          )} */}

          {/* EDIT MODE → New Password */}
          {/* {mode === "edit" && (
            <div>
              <label className="text-sm font-medium">
                New Password (optional)
              </label>
              <div className="relative">
                <input
                  type={showNewPassword ? "text" : "password"}
                  value={formData.newPassword || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, newPassword: e.target.value })
                  }
                  className="w-full border p-2 rounded-md pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  className="absolute right-3 top-2.5 text-gray-500"
                >
                  {showNewPassword ? <Eye size={18} /> : <EyeOff size={18} />}
                </button>
              </div>
            </div>
          )} */}

          {/* Role */}
          <div>
            <label className="text-sm font-medium">Role</label>
            <select
              value={formData.roleId}
              onChange={(e) =>
                setFormData({ ...formData, roleId: e.target.value })
              }
              className="w-full border px-3 py-2 rounded"
            >
              <option value="">Select Role</option>
              {roles.map((r) => (
                <option key={r.roleId} value={r.roleId}>
                  {r.roleName}
                </option>
              ))}
            </select>
          </div>

          {/* Client */}
          <div>
            <label className="text-sm font-medium">Client</label>
            <select
              value={formData.clientId}
              onChange={(e) =>
                setFormData({ ...formData, clientId: e.target.value })
              }
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
        </div>

        {/* FOOTER */}
        <div className="px-5 py-4 border-t flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 border rounded-md hover:bg-gray-100"
          >
            Cancel
          </button>

          <button
            onClick={() => onSubmit(formData)}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            {mode === "create" ? "Create" : "Update"}
          </button>
        </div>
      </div>
    </div>
  );
}
