import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Header } from "@/components/layout/Header";
import { Sidebar } from "@/components/layout/Sidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  FileText,
  Plus,
  MoreHorizontal,
  Edit,
  Trash2,
  Send,
  Loader2,
  Clock,
  CheckCircle,
  XCircle,
  MessageSquare,
} from "lucide-react";
import { contractsAPI, Contract } from "@/lib/contractApi";
import { useToast } from "@/hooks/use-toast";

export const Contracts = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [contracts, setContracts] = useState<Contract[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    fetchContracts();
  }, []);

  const fetchContracts = async () => {
    setLoading(true);
    const result = await contractsAPI.getAll();
    if (result.success && result.data) {
      setContracts(result.data);
    }
    setLoading(false);
  };

  const handleDelete = async () => {
    if (!deleteId) return;

    setDeleting(true);
    const result = await contractsAPI.delete(deleteId);
    setDeleting(false);
    setDeleteId(null);

    if (result.success) {
      toast({ title: "Deleted", description: "Contract deleted successfully" });
      setContracts(contracts.filter(c => c._id !== deleteId));
    } else {
      toast({ title: "Error", description: result.message || "Failed to delete", variant: "destructive" });
    }
  };

  const getStatusCounts = (contract: Contract) => {
    const counts = { pending: 0, accepted: 0, rejected: 0, connected: 0 };
    contract.sentContracts.forEach(sc => {
      counts[sc.status]++;
    });
    return counts;
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'accepted':
        return <Badge className="bg-green-100 text-green-700"><CheckCircle className="h-3 w-3 mr-1" />Accepted</Badge>;
      case 'rejected':
        return <Badge variant="destructive"><XCircle className="h-3 w-3 mr-1" />Rejected</Badge>;
      case 'connected':
        return <Badge className="bg-blue-100 text-blue-700"><MessageSquare className="h-3 w-3 mr-1" />Connected</Badge>;
      default:
        return <Badge variant="secondary"><Clock className="h-3 w-3 mr-1" />Pending</Badge>;
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />
        <main className="flex-1 w-full p-4 md:p-6 space-y-5 overflow-y-auto">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-bold">Contracts</h1>
              <p className="text-sm text-muted-foreground">
                Create and manage contracts to send to influencers
              </p>
            </div>
            <Button asChild>
              <Link to="/contracts/create">
                <Plus className="h-4 w-4 mr-2" />
                Create Contract
              </Link>
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2">
                  <FileText className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">Total Contracts</span>
                </div>
                <p className="text-2xl font-bold mt-1">{contracts.length}</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2">
                  <Send className="h-4 w-4 text-blue-500" />
                  <span className="text-sm text-muted-foreground">Sent</span>
                </div>
                <p className="text-2xl font-bold mt-1">
                  {contracts.reduce((sum, c) => sum + c.sentContracts.length, 0)}
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span className="text-sm text-muted-foreground">Accepted</span>
                </div>
                <p className="text-2xl font-bold mt-1">
                  {contracts.reduce((sum, c) => sum + c.sentContracts.filter(sc => sc.status === 'accepted').length, 0)}
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-yellow-500" />
                  <span className="text-sm text-muted-foreground">Pending</span>
                </div>
                <p className="text-2xl font-bold mt-1">
                  {contracts.reduce((sum, c) => sum + c.sentContracts.filter(sc => sc.status === 'pending').length, 0)}
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Contracts List */}
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            </div>
          ) : contracts.length === 0 ? (
            <Card>
              <CardContent className="p-12 text-center">
                <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No contracts yet</h3>
                <p className="text-muted-foreground mb-4">
                  Create your first contract to send to influencers
                </p>
                <Button asChild>
                  <Link to="/contracts/create">
                    <Plus className="h-4 w-4 mr-2" />
                    Create Contract
                  </Link>
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-3">
              {contracts.map((contract) => {
                const statusCounts = getStatusCounts(contract);
                return (
                  <Card key={contract._id} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-semibold truncate">{contract.title}</h3>
                            {contract.sentContracts.length > 0 && (
                              <Badge variant="outline" className="text-xs">
                                {contract.sentContracts.length} sent
                              </Badge>
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                            {contract.content.substring(0, 150)}
                            {contract.content.length > 150 && '...'}
                          </p>
                          <div className="flex items-center gap-4 text-xs text-muted-foreground">
                            <span>Created {new Date(contract.createdAt).toLocaleDateString()}</span>
                            {contract.sentContracts.length > 0 && (
                              <div className="flex items-center gap-2">
                                {statusCounts.accepted > 0 && (
                                  <span className="text-green-600">{statusCounts.accepted} accepted</span>
                                )}
                                {statusCounts.pending > 0 && (
                                  <span className="text-yellow-600">{statusCounts.pending} pending</span>
                                )}
                                {statusCounts.rejected > 0 && (
                                  <span className="text-red-600">{statusCounts.rejected} rejected</span>
                                )}
                              </div>
                            )}
                          </div>
                        </div>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => navigate(`/contracts/edit/${contract._id}`)}>
                              <Edit className="h-4 w-4 mr-2" />
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              className="text-destructive"
                              onClick={() => setDeleteId(contract._id)}
                            >
                              <Trash2 className="h-4 w-4 mr-2" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>

                      {/* Sent Contracts List */}
                      {contract.sentContracts.length > 0 && (
                        <div className="mt-4 pt-4 border-t">
                          <p className="text-xs font-medium text-muted-foreground mb-2">Recent Recipients</p>
                          <div className="space-y-2">
                            {contract.sentContracts.slice(0, 3).map((sc, idx) => (
                              <div key={idx} className="flex items-center justify-between text-sm">
                                <div className="flex items-center gap-2">
                                  <span className="font-medium">
                                    {typeof sc.influencer === 'object' ? sc.influencer.name : sc.influencerName}
                                  </span>
                                  {sc.campaignName && (
                                    <span className="text-muted-foreground text-xs">
                                      ({sc.campaignName})
                                    </span>
                                  )}
                                </div>
                                {getStatusBadge(sc.status)}
                              </div>
                            ))}
                            {contract.sentContracts.length > 3 && (
                              <p className="text-xs text-muted-foreground">
                                +{contract.sentContracts.length - 3} more
                              </p>
                            )}
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </main>
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Contract?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete this contract and all its sent records.
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={deleting}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {deleting && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};
