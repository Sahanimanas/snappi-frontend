import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Header } from "@/components/layout/Header";
import { Sidebar } from "@/components/layout/Sidebar";
import { Card, CardContent } from "@/components/ui/card";
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
  User,
} from "lucide-react";
import { contractsAPI, Contract, SentContract } from "@/lib/contractApi";
import { useToast } from "@/hooks/use-toast";

type Tab = "sent" | "templates";

interface FlatSentContract {
  contractId: string;
  contractTitle: string;
  sentContract: SentContract;
}

export const Contracts = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [contracts, setContracts] = useState<Contract[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [activeTab, setActiveTab] = useState<Tab>("sent");

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
      toast({ title: "Deleted", description: "Contract template deleted successfully" });
      setContracts(contracts.filter(c => c._id !== deleteId));
    } else {
      toast({ title: "Error", description: result.message || "Failed to delete", variant: "destructive" });
    }
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

  // Flatten all sent contracts from all templates into individual entries
  const allSentContracts: FlatSentContract[] = contracts.flatMap(contract =>
    contract.sentContracts.map(sc => ({
      contractId: contract._id,
      contractTitle: contract.title,
      sentContract: sc,
    }))
  ).sort((a, b) => new Date(b.sentContract.sentAt).getTime() - new Date(a.sentContract.sentAt).getTime());

  const totalSent = allSentContracts.length;
  const totalAccepted = allSentContracts.filter(s => s.sentContract.status === 'accepted').length;
  const totalPending = allSentContracts.filter(s => s.sentContract.status === 'pending').length;

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
                  <span className="text-sm text-muted-foreground">Templates</span>
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
                <p className="text-2xl font-bold mt-1">{totalSent}</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span className="text-sm text-muted-foreground">Accepted</span>
                </div>
                <p className="text-2xl font-bold mt-1">{totalAccepted}</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-yellow-500" />
                  <span className="text-sm text-muted-foreground">Pending</span>
                </div>
                <p className="text-2xl font-bold mt-1">{totalPending}</p>
              </CardContent>
            </Card>
          </div>

          {/* Tabs */}
          <div className="flex items-center gap-1 border-b">
            <button
              onClick={() => setActiveTab("sent")}
              className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
                activeTab === "sent"
                  ? "border-primary text-primary"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              Sent Contracts
              {totalSent > 0 && (
                <span className="ml-2 text-xs bg-muted px-1.5 py-0.5 rounded-full">{totalSent}</span>
              )}
            </button>
            <button
              onClick={() => setActiveTab("templates")}
              className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
                activeTab === "templates"
                  ? "border-primary text-primary"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              Templates
              <span className="ml-2 text-xs bg-muted px-1.5 py-0.5 rounded-full">{contracts.length}</span>
            </button>
          </div>

          {/* Content */}
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            </div>
          ) : activeTab === "sent" ? (
            /* Sent Contracts Tab */
            allSentContracts.length === 0 ? (
              <Card>
                <CardContent className="p-12 text-center">
                  <Send className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No contracts sent yet</h3>
                  <p className="text-muted-foreground mb-4">
                    Send a contract to an influencer from a campaign to see it here
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-3">
                {allSentContracts.map((item, idx) => {
                  const sc = item.sentContract;
                  const influencerName = typeof sc.influencer === 'object' ? sc.influencer.name : (sc.influencerName || 'Unknown');
                  const influencerImage = typeof sc.influencer === 'object' ? sc.influencer.profileImage : undefined;
                  const campaignName = typeof sc.campaign === 'object' ? sc.campaign.name : sc.campaignName;

                  return (
                    <Card key={sc._id || idx} className="hover:shadow-md transition-shadow">
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3 flex-1 min-w-0">
                            {/* Influencer Avatar */}
                            <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center flex-shrink-0 overflow-hidden">
                              {influencerImage ? (
                                <img src={influencerImage} alt={influencerName} className="h-full w-full object-cover" />
                              ) : (
                                <User className="h-5 w-5 text-muted-foreground" />
                              )}
                            </div>

                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-0.5">
                                <span className="font-semibold truncate">{influencerName}</span>
                                {getStatusBadge(sc.status)}
                              </div>
                              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                <span className="truncate">{item.contractTitle}</span>
                                {campaignName && (
                                  <>
                                    <span>·</span>
                                    <span className="truncate">{campaignName}</span>
                                  </>
                                )}
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center gap-3 flex-shrink-0 ml-3">
                            <span className="text-xs text-muted-foreground hidden sm:block">
                              {new Date(sc.sentAt).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            )
          ) : (
            /* Templates Tab */
            contracts.length === 0 ? (
              <Card>
                <CardContent className="p-12 text-center">
                  <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No templates yet</h3>
                  <p className="text-muted-foreground mb-4">
                    Create your first contract template to send to influencers
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
                {contracts.map((contract) => (
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
                          <p className="text-sm text-muted-foreground line-clamp-2 mb-2">
                            {contract.content.substring(0, 150)}
                            {contract.content.length > 150 && '...'}
                          </p>
                          <span className="text-xs text-muted-foreground">
                            Created {new Date(contract.createdAt).toLocaleDateString()}
                          </span>
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
                    </CardContent>
                  </Card>
                ))}
              </div>
            )
          )}
        </main>
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Contract?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete this contract template and all its sent records.
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
