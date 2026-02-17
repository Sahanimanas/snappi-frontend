import { useState, useEffect } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  FileText,
  CheckCircle,
  XCircle,
  MessageSquare,
  Loader2,
  AlertCircle,
  Clock,
  Mail,
} from "lucide-react";
import { contractsAPI, ContractResponse as ContractResponseType } from "@/lib/contractApi";

export const ContractResponse = () => {
  const { token } = useParams<{ token: string }>();
  const [searchParams] = useSearchParams();
  const actionFromUrl = searchParams.get("action");

  const [contract, setContract] = useState<ContractResponseType | null>(null);
  const [loading, setLoading] = useState(true);
  const [responding, setResponding] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [response, setResponse] = useState<{ success: boolean; message: string; brandEmail?: string } | null>(null);

  useEffect(() => {
    if (token) fetchContract();
  }, [token]);

  useEffect(() => {
    // Auto-respond if action is in URL
    if (contract && actionFromUrl && !response && ['accept', 'reject', 'connect'].includes(actionFromUrl)) {
      handleRespond(actionFromUrl as 'accept' | 'reject' | 'connect');
    }
  }, [contract, actionFromUrl]);

  const fetchContract = async () => {
    setLoading(true);
    const result = await contractsAPI.getByToken(token!);

    if (!result.success || !result.data) {
      setError(result.message || "Contract not found or link has expired");
      setLoading(false);
      return;
    }

    setContract(result.data);
    setLoading(false);
  };

  const handleRespond = async (action: 'accept' | 'reject' | 'connect') => {
    if (!token) return;

    setResponding(true);
    const result = await contractsAPI.respond(token, action);
    setResponding(false);

    if (result.success) {
      setResponse({
        success: true,
        message: result.message || 'Response recorded',
        brandEmail: result.data?.brandEmail
      });
      // Update local contract status
      if (contract) {
        setContract({
          ...contract,
          status: action === 'accept' ? 'accepted' : action === 'reject' ? 'rejected' : 'connected'
        });
      }
    } else {
      setResponse({
        success: false,
        message: result.message || 'Failed to submit response'
      });
    }
  };

  const openMailClient = (email: string) => {
    const subject = encodeURIComponent(`Re: Contract from ${contract?.brandName}`);
    const body = encodeURIComponent(`Hi ${contract?.brandName},\n\nI received your contract and would like to discuss further.\n\nBest regards,\n${contract?.influencerName}`);
    window.location.href = `mailto:${email}?subject=${subject}&body=${body}`;
  };

  const getStatusDisplay = () => {
    switch (contract?.status) {
      case 'accepted':
        return (
          <Badge className="bg-green-100 text-green-700 text-sm px-3 py-1">
            <CheckCircle className="h-4 w-4 mr-1" />
            Accepted
          </Badge>
        );
      case 'rejected':
        return (
          <Badge variant="destructive" className="text-sm px-3 py-1">
            <XCircle className="h-4 w-4 mr-1" />
            Rejected
          </Badge>
        );
      case 'connected':
        return (
          <Badge className="bg-blue-100 text-blue-700 text-sm px-3 py-1">
            <MessageSquare className="h-4 w-4 mr-1" />
            Connected
          </Badge>
        );
      default:
        return (
          <Badge variant="secondary" className="text-sm px-3 py-1">
            <Clock className="h-4 w-4 mr-1" />
            Pending Response
          </Badge>
        );
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-indigo-600 mx-auto mb-4" />
          <p className="text-muted-foreground">Loading contract...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-100 flex items-center justify-center p-4">
        <Card className="max-w-md w-full">
          <CardContent className="p-8 text-center">
            <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <h2 className="text-xl font-bold mb-2">Contract Not Found</h2>
            <p className="text-muted-foreground">{error}</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-100 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-indigo-100 mb-4">
            <FileText className="h-8 w-8 text-indigo-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Contract from {contract?.brandName}</h1>
          {contract?.campaignName && (
            <p className="text-muted-foreground mt-1">Campaign: {contract.campaignName}</p>
          )}
        </div>

        {/* Status */}
        <div className="flex justify-center mb-6">
          {getStatusDisplay()}
        </div>

        {/* Response Message */}
        {response && (
          <Card className={`mb-6 ${response.success ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'}`}>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                {response.success ? (
                  <CheckCircle className="h-5 w-5 text-green-600" />
                ) : (
                  <AlertCircle className="h-5 w-5 text-red-600" />
                )}
                <p className={response.success ? 'text-green-800' : 'text-red-800'}>
                  {response.message}
                </p>
              </div>
              {response.brandEmail && (
                <Button
                  variant="outline"
                  size="sm"
                  className="mt-3"
                  onClick={() => openMailClient(response.brandEmail!)}
                >
                  <Mail className="h-4 w-4 mr-2" />
                  Email {contract?.brandName}
                </Button>
              )}
            </CardContent>
          </Card>
        )}

        {/* Contract Content */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              {contract?.title}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="bg-gray-50 rounded-lg p-6 whitespace-pre-wrap font-mono text-sm">
              {contract?.content}
            </div>
            <div className="mt-4 text-sm text-muted-foreground">
              <p>Sent on {contract?.sentAt ? new Date(contract.sentAt).toLocaleString() : 'N/A'}</p>
              {contract?.respondedAt && (
                <p>Responded on {new Date(contract.respondedAt).toLocaleString()}</p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        {contract?.status === 'pending' && !response && (
          <Card>
            <CardContent className="p-6">
              <h3 className="font-semibold mb-4 text-center">How would you like to respond?</h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <Button
                  onClick={() => handleRespond('accept')}
                  disabled={responding}
                  className="bg-green-600 hover:bg-green-700 h-auto py-4"
                >
                  {responding ? (
                    <Loader2 className="h-5 w-5 animate-spin" />
                  ) : (
                    <>
                      <CheckCircle className="h-5 w-5 mr-2" />
                      <div className="text-left">
                        <div className="font-semibold">Accept</div>
                        <div className="text-xs opacity-80">Agree to contract</div>
                      </div>
                    </>
                  )}
                </Button>

                <Button
                  onClick={() => handleRespond('reject')}
                  disabled={responding}
                  variant="destructive"
                  className="h-auto py-4"
                >
                  {responding ? (
                    <Loader2 className="h-5 w-5 animate-spin" />
                  ) : (
                    <>
                      <XCircle className="h-5 w-5 mr-2" />
                      <div className="text-left">
                        <div className="font-semibold">Reject</div>
                        <div className="text-xs opacity-80">Decline offer</div>
                      </div>
                    </>
                  )}
                </Button>

                <Button
                  onClick={() => handleRespond('connect')}
                  disabled={responding}
                  variant="outline"
                  className="h-auto py-4 border-blue-300 text-blue-700 hover:bg-blue-50"
                >
                  {responding ? (
                    <Loader2 className="h-5 w-5 animate-spin" />
                  ) : (
                    <>
                      <MessageSquare className="h-5 w-5 mr-2" />
                      <div className="text-left">
                        <div className="font-semibold">Connect</div>
                        <div className="text-xs opacity-80">Discuss terms</div>
                      </div>
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Already Responded */}
        {contract?.status !== 'pending' && !response && (
          <Card>
            <CardContent className="p-6 text-center">
              <p className="text-muted-foreground">
                You have already responded to this contract.
              </p>
              {contract?.brandEmail && (
                <Button
                  variant="outline"
                  className="mt-4"
                  onClick={() => openMailClient(contract.brandEmail)}
                >
                  <Mail className="h-4 w-4 mr-2" />
                  Contact {contract.brandName}
                </Button>
              )}
            </CardContent>
          </Card>
        )}

        {/* Footer */}
        <p className="text-center text-sm text-muted-foreground mt-8">
          Powered by Snappi - Influencer Marketing Platform
        </p>
      </div>
    </div>
  );
};
