import { UserRound } from "lucide-react";

import { Table } from "@/components/ui/Table";
import ActionButtons from "@/components/ui/ActionButtons";

function RoleBadge({ groups }) {
  if (!groups?.length) {
    return (
      <span
        className="
        inline-flex
        items-center
        rounded-lg
        border
        border-gray-700
        bg-gray-800
        px-3
        py-1
        text-xs
        font-medium
        text-gray-400
      "
      >
        No Role
      </span>
    );
  }

  const role = groups[0];

  const styles = {
    Admin: "border-rose-500/20 bg-rose-500/10 text-rose-400",

    Manager: "border-amber-500/20 bg-amber-500/10 text-amber-400",

    Cashier: "border-emerald-500/20 bg-emerald-500/10 text-emerald-400",
  };

  return (
    <span
      className={`
        inline-flex
        items-center
        rounded-lg
        border
        px-3
        py-1
        text-xs
        font-semibold
        ${styles[role] || "border-gray-700 bg-gray-800 text-gray-300"}
      `}
    >
      {role}
    </span>
  );
}

function StatusBadge({ active }) {
  return (
    <span
      className={`
        inline-flex
        items-center
        rounded-lg
        border
        px-3
        py-1
        text-xs
        font-semibold

        ${
          active
            ? "border-emerald-500/20 bg-emerald-500/10 text-emerald-400"
            : "border-rose-500/20 bg-rose-500/10 text-rose-400"
        }
      `}
    >
      {active ? "Active" : "Inactive"}
    </span>
  );
}

export default function UserTable({ users, onEdit, onDelete }) {
  return (
    <Table>
      <thead>
        <tr
          className="
          border-b
          border-gray-700
          bg-gray-800/60
        "
        >
          <th className="px-7 py-5 text-left text-xs font-semibold uppercase tracking-wider text-gray-400">
            User
          </th>

          <th className="px-7 py-5 text-left text-xs font-semibold uppercase tracking-wider text-gray-400">
            Username
          </th>

          <th className="px-7 py-5 text-left text-xs font-semibold uppercase tracking-wider text-gray-400">
            Phone
          </th>

          <th className="px-7 py-5 text-left text-xs font-semibold uppercase tracking-wider text-gray-400">
            Role
          </th>

          <th className="px-7 py-5 text-left text-xs font-semibold uppercase tracking-wider text-gray-400">
            Status
          </th>

          <th className="px-7 py-5 text-center text-xs font-semibold uppercase tracking-wider text-gray-400">
            Actions
          </th>
        </tr>
      </thead>

      <tbody>
        {users.map((user) => {
          const initials = (
            (user.first_name?.[0] || user.username?.[0] || "U") +
            (user.last_name?.[0] || "")
          ).toUpperCase();

          return (
            <tr
              key={user.id}
              className="
                border-b
                border-gray-800
                transition
                hover:bg-gray-800/40
              "
            >
              <td className="px-7 py-5">
                <div className="flex items-center gap-4">
                  <div
                    className="
                      flex
                      h-12
                      w-12
                      items-center
                      justify-center
                      rounded-2xl
                      border
                      border-emerald-500/20
                      bg-emerald-500/10
                      text-sm
                      font-bold
                      text-emerald-400
                    "
                  >
                    {initials}
                  </div>

                  <div>
                    <div
                      className="
                      mt-1
                      flex
                      items-center
                      gap-1
                      text-md

                      text-gray-200
                      text-gray-500
                    "
                    >
                      <UserRound size={14} />
                      ID #{user.id}
                    </div>
                  </div>
                </div>
              </td>

              <td
                className="
                px-7
                py-5
                font-medium
                text-gray-200
              "
              >
                {user.username}
              </td>

              <td
                className="
                px-7
                py-5
                text-gray-400
              "
              >
                {user.phone || "-"}
              </td>

              <td className="px-7 py-5">
                <RoleBadge groups={user.groups} />
              </td>

              <td className="px-7 py-5">
                <StatusBadge active={user.is_active} />
              </td>

              <td
                className="
                px-7
                py-5
                text-center
              "
              >
                <div className="flex justify-center">
                  <ActionButtons
                    onEdit={() => onEdit(user.id)}
                    onDelete={() => onDelete(user.id)}
                  />
                </div>
              </td>
            </tr>
          );
        })}
      </tbody>
    </Table>
  );
}
