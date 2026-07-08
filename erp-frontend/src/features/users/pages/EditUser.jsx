import { useParams } from "react-router-dom";

import PageHeader from "@/components/ui/PageHeader";

import UserForm from "../components/UserForm";

export default function EditUser() {
  const { id } = useParams();

  return (
    <>
      <PageHeader title="Edit User" subtitle="Update user information." />

      <UserForm id={id} />
    </>
  );
}
