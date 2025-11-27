import React, { useEffect, useState } from "react";
import PageHeader from "../components/common/PageHeader";
import SearchFiltersBar from "../components/common/SearchFiltersBar";

import {
  useFetchAllUsersDetailsQuery,
  UserItem,
  useGetUserDetailsByIdMutation,
  useUpdateUserByIdMutation,
  useCreateUserMutation,
} from "../redux/services/usersApi";
import { PaginatedGrid } from "../components/PaginatedGrid";
import TableWithPagination from "../components/TableWithPagination";
import { Edit2 } from "lucide-react";
import UserDrawer from "../components/UserDrawer";
import { toast } from "react-toastify";

const Users = () => {
  const { data, isLoading, error, refetch } = useFetchAllUsersDetailsQuery();
  const [getUserDetailsById] = useGetUserDetailsByIdMutation();
  const [updateUserById, { isLoading: updateLoading }] =
    useUpdateUserByIdMutation();
  const [createUser, { isLoading: createLoading }] = useCreateUserMutation();

  const [searchQuery, setSearchQuery] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [viewMode, setViewMode] = useState<"list" | "grid">("list");
  const [usersData, setUsersData] = useState<UserItem[]>([]);
  const [openDrawer, setOpenDrawer] = useState(false);
  const [drawerMode, setDrawerMode] = useState<"create" | "edit">("create");
  const [selectedUser, setSelectedUser] = useState<UserItem | null>(null);

  // ⬇️ Store API data into state
  useEffect(() => {
    if (data?.data) {
      setUsersData(data.data);
    }
  }, [data]);

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error fetching user data</div>;

  const UserRow = ({ user }: { user: UserItem }) => {
    return (
      <tr className="border-b border-gray-100 hover:bg-gray-50">
        <td className="py-4 px-4">{user.fullName || "N/A"}</td>
        <td className="py-4 px-4 text-sm text-gray-900">
          {user.contactPhone || "N/A"}
        </td>
        <td className="py-4 px-4 text-sm text-gray-900">
          {user.email || "N/A"}
        </td>
        <td className="py-4 px-4 text-sm text-gray-900">
          {user.roleName || "N/A"}
        </td>
        <td className="py-4 px-4 text-sm text-gray-900">
          {user.clientName || "N/A"}
        </td>

        {/* <td className="py-4 px-4">
          <span
            className={`px-2 py-1 text-xs rounded-full font-medium ${getStatusColor(
              service.statusName
            )}`}
          >
            {service.statusName || "N/A"}
          </span>
        </td> */}

        <td className="py-4 px-4">
          <button
            onClick={async () => {
              try {
                const response = await getUserDetailsById({
                  userId: user.userId,
                }).unwrap();

                const apiUser = response.data[0];

                setSelectedUser(apiUser);

                setDrawerMode("edit");
                setOpenDrawer(true);
              } catch (err) {
                console.error(err);
              }
            }}
            className="inline-flex px-3 py-1 text-blue-600 hover:bg-blue-50 rounded-md"
          >
            <Edit2 className="h-4 w-4" />
          </button>
        </td>
      </tr>
    );
  };

const handleUserSubmit = async (formData: any) => {
  try {
    if (drawerMode === "create") {
      const payload = {
        email: formData.email,
        fullName: formData.fullName,
        password: formData.password,
        roleId: Number(formData.roleId),
        clientId: Number(formData.clientId),
        createdBy: 1,
      };

      const res = await createUser(payload).unwrap();
      if (res.statusCode === 200) toast.success("User created successfully!");
    } 
    else if (drawerMode === "edit") {
      const payload = {
        userId: selectedUser?.userId,
        fullName: formData.fullName,
        email: formData.email,
        roleId: Number(formData.roleId),
        clientId: Number(formData.clientId),
        oldPassword: formData.oldPassword || "",
        newPassword: formData.newPassword || "",
        updatedBy: 1,
      };

      const res = await updateUserById(payload).unwrap();
      if (res.statusCode === 200) toast.success("User updated successfully!");
    }

    // ✅ Reset drawer state
    setSelectedUser(null);      // <-- IMPORTANT
    setDrawerMode("create");    // optional
    setOpenDrawer(false);

    refetch();
  } catch (error) {
    toast.error("Something went wrong");
  }
};


  const filteredUsers = usersData.filter((user) => {
    const query = searchQuery.toLowerCase();

    return (
      user.fullName?.toLowerCase().includes(query) ||
      user.email?.toLowerCase().includes(query) ||
      user.roleName?.toLowerCase().includes(query) ||
      user.contactPhone?.toLowerCase().includes(query)
    );
  });

  return (
    <div>
      <PageHeader
        title="Users"
        buttonText="Create User"
        onButtonClick={() => {
          setSelectedUser(null);
          setDrawerMode("create");
          setOpenDrawer(true);
        }}
      />

      <SearchFiltersBar
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        showFilters={showFilters}
        setShowFilters={setShowFilters}
        rightArea={null} // your toggle buttons can go here
      />

      {/* Example: show data */}
      {usersData.length === 0 && viewMode === "grid" ? (
        // <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        //   {filteredServices.map((service) => (
        //     <ServiceCard key={service.serviceId} service={service} />
        //   ))}
        // </div>
        <div>grid</div>
      ) : (
        // <PaginatedGrid
        //   data={filteredServices}
        //   itemsPerPage={6}
        //   renderItem={(service) => (
        //     <ServiceCard key={service.serviceId} service={service} />
        //   )}
        //   emptyMessage="No matching services found."
        // />
        <TableWithPagination
          columns={[
            { label: "Full Name" },
            { label: "Phone No." },
            { label: "Email" },
            { label: "Role Name" },
            { label: "Client Name" },
            { label: "Actions" },
          ]}
          data={filteredUsers}
          rowsPerPage={5}
          renderRow={(user) => <UserRow key={user.userId} user={user} />}
        />
      )}

      {/* Later you can pass usersData to your table/grid */}
      <UserDrawer
        open={openDrawer}
        onClose={() => setOpenDrawer(false)}
        mode={drawerMode}
        user={selectedUser}
        onSubmit={handleUserSubmit}
      />
    </div>
  );
};

export default Users;
