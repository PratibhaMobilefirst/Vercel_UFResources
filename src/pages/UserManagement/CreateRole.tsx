import Layout from "@/components/Layout";
import { RoleCreationForm } from "@/components/RoleCreationForm";

const CreateRole = () => {
  return (
    <Layout>
      <div className="bg-white rounded-md shadow-sm p-6">
        <RoleCreationForm />
      </div>
    </Layout>
  );
};

export default CreateRole;
