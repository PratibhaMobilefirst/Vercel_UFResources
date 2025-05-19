import LoginForm from "@/components/LoginForm";

const LoginFormPage = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-7xl">
        <LoginForm />
      </div>
    </div>
  );
};

export default LoginFormPage;
