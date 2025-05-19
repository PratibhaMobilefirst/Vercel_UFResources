import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"; // Import RadioGroup
import { Label } from "@/components/ui/label";
import { useNavigate } from "react-router-dom";
import { usePermissions } from "@/hooks/usePermissions";
import { Loader, Loader2 } from "lucide-react";
import { useCreateRole } from "@/hooks/useCreateRole"; // Import the custom hook

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

export const RoleCreationForm: React.FC = () => {
  const navigate = useNavigate();
  const { data, isLoading, error } = usePermissions();
  const createRole = useCreateRole();

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

  // Form state
  const [formData, setFormData] = useState<RoleFormState>({
    roleName: "",
    roleDescription: "",
    permissions: initialPermissions,
  });

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
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Prepare the permissions list for the API call with featureIds
    const permissionList = Object.entries(formData.permissions)
      .map(([functionality, permission]) => {
        // Find the corresponding featureId from the API response
        const feature = data?.data?.find(
          (feature) =>
            feature.name.toLowerCase() === functionality.toLowerCase()
        );

        if (feature) {
          return {
            featureId: feature.id, // Use the actual feature ID from the response
            permission: feature.Permission.map((perm) => ({
              permissionId: perm.id, // Use permission ID from the API response
              status: permission === "Not Allowed" ? false : true,
            })),
          };
        }

        return null;
      })
      .filter(Boolean); // Remove null values
    console.log({ permissionList });

    const payload = {
      roleName: formData.roleName,
      permissionList,
    };

    createRole.mutate(payload); // Call the mutation to create the role
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
          <h2 className="text-xl font-semibold text-[#00426E]">
            Create a role
          </h2>
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
          {/* <div>
            <Label htmlFor="roleDescription">Role Description</Label>
            <Input
              id="roleDescription"
              name="roleDescription"
              value={formData.roleDescription}
              onChange={handleInputChange}
              className="mt-1"
            />
          </div> */}
        </div>

        {/* Functionality Permissions */}
        <div>
          <h3 className="font-semibold mb-4">Functionalities</h3>

          <Card className="border-none shadow-none">
            <CardContent className="p-0">
              {data?.data?.map((functionality) => (
                <div key={functionality.id} className="mb-8">
                  <div className="grid grid-cols-12 items-center">
                    <div className="col-span-4 font-medium capitalize">
                      {functionality.name}
                    </div>
                    <div className="col-span-8">
                      <RadioGroup
                        value={formData.permissions[functionality.name]}
                        onValueChange={(value: Permission) =>
                          handlePermissionChange(functionality.name, value)
                        }
                      >
                        {functionality.Permission.map((perm) => (
                          <div key={perm.id} className="flex items-center">
                            <div className="flex items-center space-x-2 w-40">
                              <RadioGroupItem
                                value={perm.name as Permission}
                                id={`${functionality.name}-${perm.name}`}
                              />
                              <Label
                                htmlFor={`${functionality.name}-${perm.name}`}
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
            onClick={() => navigate("/user-management", { state: { selectedTab: "Role Creation" } })}
            type="button"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            className="bg-[#00426E] hover:bg-[#00426E]/90"
            disabled={createRole.status === "pending"}
          >
            {createRole.status === "pending" ? (
              <Loader className="w-4 h-4 animate-spin mr-2" />
            ) : null}
            Create Role
          </Button>
        </div>
      </div>
    </form>
  );
};
