import { EntrepreneurCard } from "@/components/dashboard/entrepreneur-card";
import { entrepreneurs } from "@/lib/data";

export default function InvestorDashboard() {
  return (
    <div>
        <div className="mb-8">
            <h1 className="text-3xl font-bold font-headline">Discover Entrepreneurs</h1>
            <p className="text-muted-foreground">Browse profiles of innovative founders seeking investment.</p>
        </div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {entrepreneurs.map(entrepreneur => (
                <EntrepreneurCard key={entrepreneur.id} entrepreneur={entrepreneur} />
            ))}
        </div>
    </div>
  );
}
