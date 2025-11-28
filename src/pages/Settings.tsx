import { useState, useEffect } from "react";
import PageHeader from "../components/common/PageHeader";
import { Eye, EyeOff } from "lucide-react";
import {
  useGetUserDetailsByIdMutation,
  useUpdateUserByIdMutation,
} from "../redux/services/usersApi";
import { useResetPasswordMutation } from "../redux/services/authApi";
import { useAuth } from "../contexts/AuthContext";
import { toast } from "react-toastify";

const Settings = () => {
  const { user } = useAuth();

  const [getUserDetails] = useGetUserDetailsByIdMutation();
  const [updateUser] = useUpdateUserByIdMutation();
  const [resetPassword] = useResetPasswordMutation();

  const [activeTab, setActiveTab] = useState<"profile" | "password">("profile");
  const [isProcessing, setIsProcessing] = useState(false);

  // PROFILE STATE
  const [profile, setProfile] = useState({
    fullName: "",
    email: "",
    phone: "",
    roleName: "",
    clientName: "",
    roleId: "",
    clientId: "",
    updatedBy: "",
  });

  // PASSWORD STATE
  // const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // SHOW/HIDE PASSWORD
  // const [showOld, setShowOld] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  // FETCH PROFILE DETAILS

  useEffect(() => {
    if (!user?.userId) return;

    getUserDetails({ userId: user.userId })
      .unwrap()
      .then((res) => {
        const u = res.data?.[0];
        if (u) {
          setProfile({
            fullName: u.fullName || "",
            email: u.email || "",
            phone: u.contactPhone || "",
            roleName: u.roleName || "",
            clientName: u.clientName || "",
            roleId: u.roleId || "",
            clientId: u.clientId || "",
            updatedBy: u.updatedBy || "",
          });
        }
      })
      .catch(() => {});
  }, [user]);

  // COMMON SUBMIT HANDLER

  const handleUpdate = async () => {
    setIsProcessing(true);

    try {
      // PROFILE UPDATE

      if (activeTab === "profile") {
        if (!profile.fullName) return toast.error("Full Name is required");
        if (!profile.phone) return toast.error("Phone number is required");

        const payload = {
          userId: user?.userId,
          fullName: profile.fullName,
          email: profile.email,
          roleId: profile.roleId,
          clientId: profile.clientId,
          // oldPassword: "",
          // newPassword: "",
          updatedBy: profile.updatedBy,
          phoneNumber: profile.phone,
        };

        const res = await updateUser(payload).unwrap();
        if (res.statusCode === 200) {
          toast.success("Profile updated successfully!");
        } else {
          toast.error("Profile update failed");
        }

        return;
      }

      // PASSWORD UPDATE

      if (activeTab === "password") {
        if (!newPassword || !confirmPassword) {
          return toast.error("All password fields are required");
        }

        if (newPassword !== confirmPassword) {
          return toast.error("Passwords do not match");
        }

        const payload = {
          email: profile.email,
          newPassword: newPassword,
        };

        const res = await resetPassword(payload).unwrap();
        if (res.statusCode === 200) {
          toast.success("Password updated successfully!");
          setNewPassword("");
          setConfirmPassword("");
        } else {
          toast.error("Password update failed");
        }

        return;
      }
    } catch (err) {
      toast.error("Something went wrong");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="flex flex-col overflow-hidden">
      <PageHeader
        title="Account Settings"
        subtitle="Update your personal information & secure your account"
      />

      {/* TABS */}
      <div className="border-b border-gray-200 px-2">
        <div className="flex space-x-6">
          <button
            onClick={() => setActiveTab("profile")}
            className={`py-2 text-sm font-medium ${
              activeTab === "profile"
                ? "border-b-2 border-blue-600 text-blue-600"
                : "text-gray-600"
            }`}
          >
            Profile Information
          </button>

          <button
            onClick={() => setActiveTab("password")}
            className={`py-2 text-sm font-medium ${
              activeTab === "password"
                ? "border-b-2 border-blue-600 text-blue-600"
                : "text-gray-600"
            }`}
          >
            Change Password
          </button>
        </div>
      </div>

      {/* CONTENT */}
      <div className="flex-1 flex justify-center px-4 py-6 overflow-hidden">
        <div className="w-full max-w-2xl bg-white shadow-sm rounded-xl p-6">
          {/* PROFILE TAB */}
          {activeTab === "profile" && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold">Personal Details</h3>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">Full Name</label>
                  <input
                    value={profile.fullName}
                    onChange={(e) =>
                      setProfile({ ...profile, fullName: e.target.value })
                    }
                    className="w-full mt-1 p-2 border rounded-lg"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium">Email</label>
                  <input
                    disabled
                    value={profile.email}
                    className="w-full mt-1 p-2 border rounded-lg bg-gray-100"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium">Phone</label>
                  <input
                    value={profile.phone}
                    onChange={(e) =>
                      setProfile({ ...profile, phone: e.target.value })
                    }
                    className="w-full mt-1 p-2 border rounded-lg"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium">Role</label>
                  <input
                    disabled
                    value={profile.roleName}
                    className="w-full mt-1 p-2 border rounded-lg bg-gray-100"
                  />
                </div>
              </div>

              <div className="flex justify-end">
                <button
                  onClick={handleUpdate}
                  disabled={isProcessing}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg disabled:opacity-50"
                >
                  {isProcessing ? "Processing..." : "Save Changes"}
                </button>
              </div>
            </div>
          )}

          {/* PASSWORD TAB */}
          {activeTab === "password" && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold">Change Your Password</h3>

              <div className="space-y-3">
                {/* OLD PASSWORD */}
                {/* <div>
                  <label className="text-sm font-medium">Old Password</label>
                  <div className="relative">
                    <input
                      type={showOld ? "text" : "password"}
                      value={oldPassword}
                      onChange={(e) => setOldPassword(e.target.value)}
                      className="w-full mt-1 p-2 border rounded-lg pr-10"
                    />
                    <button
                      className="absolute right-3 top-3"
                      onClick={() => setShowOld(!showOld)}
                    >
                      {showOld ? <Eye /> : <EyeOff />}
                    </button>
                  </div>
                </div> */}

                {/* NEW PASSWORD */}
                <div>
                  <label className="text-sm font-medium">New Password</label>
                  <div className="relative">
                    <input
                      type={showNew ? "text" : "password"}
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="w-full mt-1 p-2 border rounded-lg pr-10"
                    />
                    <button
                      className="absolute right-3 top-3"
                      onClick={() => setShowNew(!showNew)}
                    >
                      {showNew ? <Eye /> : <EyeOff />}
                    </button>
                  </div>
                </div>

                {/* CONFIRM PASSWORD */}
                <div>
                  <label className="text-sm font-medium">
                    Confirm Password
                  </label>
                  <div className="relative">
                    <input
                      type={showConfirm ? "text" : "password"}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="w-full mt-1 p-2 border rounded-lg pr-10"
                    />
                    <button
                      className="absolute right-3 top-3"
                      onClick={() => setShowConfirm(!showConfirm)}
                    >
                      {showConfirm ? <Eye /> : <EyeOff />}
                    </button>
                  </div>
                </div>
              </div>

              <div className="flex justify-end">
                <button
                  onClick={handleUpdate}
                  disabled={isProcessing}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg disabled:opacity-50"
                >
                  {isProcessing ? "Processing..." : "Update Password"}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Settings;
