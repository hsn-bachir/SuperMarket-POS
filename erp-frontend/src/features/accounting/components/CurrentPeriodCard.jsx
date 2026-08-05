import Button from "@/components/ui/Button";
import SectionCard from "@/components/ui/SectionCard";

export default function CurrentPeriodCard({ period, onClose }) {
  return (
    <SectionCard title="Current Period">
      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <p className="text-sm text-gray-500">Name</p>

          <p className="font-medium">{period.name}</p>
        </div>

        <div>
          <p className="text-sm text-gray-500">Status</p>

          <p className="font-medium">{period.status}</p>
        </div>

        <div>
          <p className="text-sm text-gray-500">Start Date</p>

          <p>{period.start_date}</p>
        </div>

        <div>
          <p className="text-sm text-gray-500">End Date</p>

          <p>{period.end_date}</p>
        </div>
      </div>

      {period.status === "OPEN" && (
        <div className="mt-6 flex justify-end">
          <Button variant="danger" onClick={onClose}>
            Close Period
          </Button>
        </div>
      )}
    </SectionCard>
  );
}
