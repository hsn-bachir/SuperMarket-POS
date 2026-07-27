import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";

import FormInput from "@/components/forms/FormInput";
import FormSelect from "@/components/forms/FormSelect";
import FormCheckbox from "@/components/forms/FormCheckbox";

import { createUser, updateUser, getUser, getGroups } from "../api/usersApi";

const initialState = {
  username: "",
  password: "",
  first_name: "",
  last_name: "",
  email: "",
  phone: "",
  is_active: true,
  groups: [],
};

export default function UserForm({ id }) {
  const navigate = useNavigate();

  const [form, setForm] = useState(initialState);

  const [groups, setGroups] = useState([]);

  const [loading, setLoading] = useState(false);

  const [pageLoading, setPageLoading] = useState(!!id);

  useEffect(() => {
    loadGroups();

    if (id) {
      loadUser();
    }
  }, [id]);

  async function loadGroups() {
    try {
      const res = await getGroups();

      setGroups(res.data.results ?? res.data);
    } catch {
      toast.error("Unable to load roles.");
    }
  }

  async function loadUser() {
    try {
      const res = await getUser(id);

      setForm({
        ...res.data,
        password: "",
      });
    } catch {
      toast.error("Unable to load user.");
    } finally {
      setPageLoading(false);
    }
  }

  function handleChange(e) {
    const { name, value, type, checked } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  }

  async function handleSubmit(e) {
    e.preventDefault();

    try {
      setLoading(true);

      const payload = {
        ...form,
        groups: form.groups,
      };

      if (!payload.password) {
        delete payload.password;
      }

      if (id) {
        await updateUser(id, payload);

        toast.success("User updated successfully.");
      } else {
        await createUser(payload);

        toast.success("User created successfully.");
      }

      navigate("/users");
    } catch {
      toast.error("Unable to save user.");
    } finally {
      setLoading(false);
    }
  }

  if (pageLoading) {
    return <div>Loading...</div>;
  }

  return (
    <Card>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid md:grid-cols-2 gap-5">
          <FormInput
            label="Username"
            name="username"
            value={form.username}
            onChange={handleChange}
            required
          />

          <FormInput
            label={id ? "New Password" : "Password"}
            type="password"
            name="password"
            value={form.password}
            onChange={handleChange}
            required={!id}
          />

          <FormInput
            label="First Name"
            name="first_name"
            value={form.first_name}
            onChange={handleChange}
          />

          <FormInput
            label="Last Name"
            name="last_name"
            value={form.last_name}
            onChange={handleChange}
          />

          <FormInput
            label="Phone"
            name="phone"
            value={form.phone}
            onChange={handleChange}
          />

          <FormSelect
            label="Role"
            name="groups"
            value={form.groups[0] || ""}
            onChange={(e) =>
              setForm({
                ...form,
                groups: [e.target.value],
              })
            }
            options={[
              {
                value: "",
                label: "Select Role",
              },

              ...groups.map((group) => ({
                value: group.name,
                label: group.name,
              })),
            ]}
            required
          />
        </div>

        <FormCheckbox
          label="Active User"
          name="is_active"
          checked={form.is_active}
          onChange={handleChange}
        />

        <div className="flex justify-end gap-3 pt-4 border-t">
          <Button
            type="button"
            variant="secondary"
            onClick={() => navigate("/users")}
          >
            Cancel
          </Button>

          <Button type="submit" disabled={loading}>
            {loading ? "Saving..." : id ? "Update User" : "Create User"}
          </Button>
        </div>
      </form>
    </Card>
  );
}
