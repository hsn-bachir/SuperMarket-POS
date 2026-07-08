import PageHeader from "@/components/ui/PageHeader";
import UserForm from "../components/UserForm";

export default function AddUser() {
  return (
    <>
      <PageHeader title="Add User" subtitle="Create a new system user." />

      <UserForm />
    </>
  );
}
