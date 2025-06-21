import { RequestItem } from "@/components/dashboard/request-item";
import { requests } from "@/lib/data";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function EntrepreneurDashboard() {
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold font-headline">Collaboration Requests</h1>
        <p className="text-muted-foreground">Manage interest from potential investors.</p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Incoming Requests</CardTitle>
          <CardDescription>You have {requests.filter(r => r.status === 'pending').length} pending requests.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {requests.map(request => (
                <RequestItem key={request.id} request={request} />
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
