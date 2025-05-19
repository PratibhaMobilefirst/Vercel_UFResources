import { EditRoleCreationForm } from "@/components/EditRoleCreationForm";
import Layout from "@/components/Layout";

const EditRoleCreationPage = () => {
  return (
    <Layout>
      <div className="bg-white rounded-md shadow-sm p-6">
        <EditRoleCreationForm />
      </div>
    </Layout>
  );
};

export default EditRoleCreationPage;
