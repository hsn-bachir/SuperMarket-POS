import Badge from "@/components/ui/Badge";

export default function ProductStatusBadge({ active }) {
  return active ? (
    <Badge variant="success">Active</Badge>
  ) : (
    <Badge variant="danger">Inactive</Badge>
  );
}
