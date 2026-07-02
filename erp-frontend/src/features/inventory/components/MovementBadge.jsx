import Badge from "@/components/ui/Badge";

export default function MovementBadge({ type }) {
  switch (type) {
    case "PURCHASE":
      return <Badge variant="success">Purchase</Badge>;

    case "SALE":
      return <Badge variant="danger">Sale</Badge>;

    case "ADJUSTMENT":
      return <Badge variant="warning">Adjustment</Badge>;

    default:
      return <Badge>{type}</Badge>;
  }
}
