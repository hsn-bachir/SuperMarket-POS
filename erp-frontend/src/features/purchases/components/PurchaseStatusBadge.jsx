import Badge from "@/components/ui/Badge";

export default function PurchaseStatusBadge({ currency }) {
  return <Badge variant="info">{currency}</Badge>;
}
