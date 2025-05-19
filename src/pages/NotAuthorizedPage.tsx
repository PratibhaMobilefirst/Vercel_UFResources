import Layout from "@/components/Layout";

const NotAuthorizedPage = () => {
  return (
    <Layout>
      <div className="flex flex-col justify-center items-center h-full">
        <h1 className="text-xl font-semibold text-red-600">Access Denied</h1>
        <p className="text-center text-gray-500">
          You do not have permission to access this page.
        </p>
      </div>
    </Layout>
  );
};

export default NotAuthorizedPage;
