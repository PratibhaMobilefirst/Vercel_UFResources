import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { useLocation, useNavigate } from "react-router-dom";
import { usePermissionsList } from "@/hooks/usePermissions"; // Custom hook to fetch permissions
import { Loader, Loader2 } from "lucide-react";
import { useUpateRole } from "@/hooks/useupateRole";

// Define the permission types
type Permission = "Not Allowed" | "View" | "Manage" | "Create";

// Define the form state structure
interface RoleFormState {
  roleName: string;
  roleDescription: string;
  permissions: {
    [key: string]: Permission;
  };
}

export const EditRoleCreationForm: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { id, name, sno, status } = location.state || {};
  const { data, isLoading, error } = usePermissionsList(id); // Fetch permissions for the given role ID
  const updateRole = useUpateRole();

  const initialPermissions: Record<string, Permission> = {
    dashboard: "Not Allowed",
    attorneyManagement: "Not Allowed",
    campaignManagement: "Not Allowed",
    contentManagement: "Not Allowed",
    templates: "Not Allowed",
    approveTemplates: "Not Allowed",
    support: "Not Allowed",
    crm: "Not Allowed",
    webAccessManagement: "Not Allowed",
    followUp: "Not Allowed",
  };

  // Initialize form data state
  const [formData, setFormData] = useState<RoleFormState>({
    roleName: name || "",
    roleDescription: "",
    permissions: initialPermissions,
  });

  useEffect(() => {
    // If location.state has role description or permissions, populate formData
    if (location.state) {
      setFormData((prev) => ({
        ...prev,
        roleName: name || prev.roleName,
        roleDescription: "", // Optionally set a description if needed
      }));
    }
  }, [location.state, name]);

  // Set the initial permission values based on the status
  useEffect(() => {
    if (data) {
      const updatedPermissions = { ...initialPermissions };

      data.data.forEach((functionality) => {
        updatedPermissions[functionality.featureName] =
          functionality.permissions?.find((perm) => perm.status === true)
            ?.name || "Not Allowed";
      });

      setFormData((prev) => ({
        ...prev,
        permissions: updatedPermissions,
      }));
    }
  }, [data]);

  // Handle input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle permission changes (radio buttons)
  const handlePermissionChange = (
    functionality: string,
    permission: Permission
  ) => {
    setFormData((prev) => ({
      ...prev,
      permissions: {
        ...prev.permissions,
        [functionality]: permission,
      },
    }));
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Prepare the permissions list with featureId and status for the API call
    const permissionList = Object.entries(formData.permissions)
      .map(([functionality, permission]) => {
        const feature = data?.data?.find(
          (feature) =>
            feature.featureName.toLowerCase() === functionality.toLowerCase()
        );

        if (feature) {
          return {
            permissionId: feature.permissions?.find(
              (perm) => perm.name === permission
            )?.id,
            status: permission !== "Not Allowed",
          };
        }
        return null;
      })
      .filter(Boolean);

    const payload = {
      roleId: id, // Role ID to be updated
      roleName: formData.roleName, // Role name to be updated
      data: permissionList,
    };

    console.log({ payload }); // Check the payload structure

    // Call the mutation to update the role
    updateRole.mutate(payload);
  };

  if (isLoading) {
    return (
      <div>
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  if (error) {
    return <div>Error fetching permissions.</div>;
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className="flex items-center mb-6">
        <div className="flex-1">
          <h2 className="text-xl font-semibold text-[#00426E]">Edit a role</h2>
          <p className="text-gray-500 text-sm mt-1">Set up role information</p>
        </div>
      </div>

      <div className="space-y-6">
        {/* Role Name & Description */}
        <div className="space-y-4">
          <div>
            <Label htmlFor="roleName">Role Name</Label>
            <Input
              id="roleName"
              name="roleName"
              value={formData.roleName}
              onChange={handleInputChange}
              className="mt-1"
            />
          </div>
        </div>

        {/* Functionalities and Permissions */}
        <div>
          <h3 className="font-semibold mb-4">Functionalities</h3>

          <Card className="border-none shadow-none">
            <CardContent className="p-0">
              {/* Render permissions only if data is available */}
              {data?.data?.map((functionality) => (
                <div key={functionality.featureId} className="mb-8">
                  <div className="grid grid-cols-12 items-center">
                    <div className="col-span-4 font-medium capitalize">
                      {functionality.featureName}
                    </div>
                    <div className="col-span-8">
                      <RadioGroup
                        value={formData.permissions[functionality.featureName]}
                        onValueChange={(value: Permission) =>
                          handlePermissionChange(
                            functionality.featureName,
                            value
                          )
                        }
                      >
                        {/* Ensure functionality.permissions exists before mapping */}
                        {functionality.permissions?.map((perm) => (
                          <div key={perm.id} className="flex items-center">
                            <div className="flex items-center space-x-2 w-40">
                              <RadioGroupItem
                                value={perm.name as Permission}
                                id={`${functionality.featureName}-${perm.name}`}
                              />
                              <Label
                                htmlFor={`${functionality.featureName}-${perm.name}`}
                              >
                                {perm.name}
                              </Label>
                            </div>
                          </div>
                        ))}
                      </RadioGroup>
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Form Actions */}
        <div className="flex justify-end gap-4 mt-8">
          <Button
            variant="outline"
            onClick={() => navigate("/user-management")}
            type="button"
          >
            Cancel
          </Button>
          <Button
            disabled={updateRole.status === "pending"}
            type="submit"
            style={{ backgroundColor: "#00426E" }}
          >
            {updateRole.status === "pending" ? (
              <Loader className="w-5 h-5 mr-2" />
            ) : (
              "Update Role"
            )}
          </Button>
        </div>
      </div>
    </form>
  );
};
