import Badge from "@/components/ui/Badge";

export default function PaymentBadge({ method }) {
  switch (method) {
    case "CASH":
      return <Badge variant="success">Cash</Badge>;

    case "CARD":
      return <Badge variant="info">Card</Badge>;

    default:
      return <Badge>{method}</Badge>;
  }
}
