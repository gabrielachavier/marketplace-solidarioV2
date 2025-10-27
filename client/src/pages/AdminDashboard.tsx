import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import { toast } from "sonner";
import { Loader2, Mail, Phone, MessageSquare, CheckCircle, Eye, Trash2 } from "lucide-react";
import { Link, useLocation } from "wouter";

export default function AdminDashboard() {
  const { user, loading: authLoading } = useAuth();
  const [, setLocation] = useLocation();
  const [selectedSubmission, setSelectedSubmission] = useState<number | null>(null);

  // Redirect if not admin
  useEffect(() => {
    if (!authLoading && (!user || user.role !== "admin")) {
      setLocation("/");
    }
  }, [user, authLoading, setLocation]);

  const { data: submissions, isLoading, refetch } = trpc.contact.list.useQuery(undefined, {
    enabled: user?.role === "admin",
  });

  const { data: selectedData } = trpc.contact.getById.useQuery(
    { id: selectedSubmission! },
    { enabled: selectedSubmission !== null && user?.role === "admin" }
  );

  const updateStatusMutation = trpc.contact.updateStatus.useMutation({
    onSuccess: () => {
      toast.success("Status atualizado com sucesso!");
      refetch();
    },
    onError: (error) => {
      toast.error(error.message || "Erro ao atualizar status");
    },
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "new":
        return "bg-blue-100 text-blue-800";
      case "read":
        return "bg-yellow-100 text-yellow-800";
      case "replied":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "new":
        return "Novo";
      case "read":
        return "Lido";
      case "replied":
        return "Respondido";
      default:
        return status;
    }
  };

  if (authLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="animate-spin h-8 w-8 text-orange-500" />
      </div>
    );
  }

  if (!user || user.role !== "admin") {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Card className="p-8 text-center">
          <h1 className="text-2xl font-bold mb-4">Acesso Negado</h1>
          <p className="text-gray-600 mb-6">Você não tem permissão para acessar esta página.</p>
          <Link href="/">
            <Button className="bg-orange-500 hover:bg-orange-600">Voltar para Home</Button>
          </Link>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Dashboard Admin</h1>
            <p className="text-gray-600">Gerenciar submissões de contato</p>
          </div>
          <Link href="/">
            <Button variant="outline">Voltar para Home</Button>
          </Link>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Stats Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Total de Submissões</p>
                <p className="text-3xl font-bold text-gray-900">{submissions?.length || 0}</p>
              </div>
              <MessageSquare className="h-12 w-12 text-blue-500 opacity-20" />
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Novas Submissões</p>
                <p className="text-3xl font-bold text-gray-900">
                  {submissions?.filter((s) => s.status === "new").length || 0}
                </p>
              </div>
              <Mail className="h-12 w-12 text-blue-500 opacity-20" />
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Respondidas</p>
                <p className="text-3xl font-bold text-gray-900">
                  {submissions?.filter((s) => s.status === "replied").length || 0}
                </p>
              </div>
              <CheckCircle className="h-12 w-12 text-green-500 opacity-20" />
            </div>
          </Card>
        </div>

        {/* Main Content */}
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Submissions List */}
          <div className="lg:col-span-2">
            <Card className="overflow-hidden">
              <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900">Submissões Recebidas</h2>
              </div>

              {isLoading ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="animate-spin h-8 w-8 text-orange-500" />
                </div>
              ) : submissions && submissions.length > 0 ? (
                <div className="divide-y divide-gray-200">
                  {submissions.map((submission) => (
                    <div
                      key={submission.id}
                      onClick={() => setSelectedSubmission(submission.id)}
                      className={`p-6 cursor-pointer transition hover:bg-gray-50 ${
                        selectedSubmission === submission.id ? "bg-orange-50 border-l-4 border-orange-500" : ""
                      }`}
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-900">{submission.name}</h3>
                          <p className="text-sm text-gray-600 flex items-center gap-1 mt-1">
                            <Mail className="h-4 w-4" />
                            {submission.email}
                          </p>
                          {submission.phone && (
                            <p className="text-sm text-gray-600 flex items-center gap-1 mt-1">
                              <Phone className="h-4 w-4" />
                              {submission.phone}
                            </p>
                          )}
                        </div>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(submission.status)}`}>
                          {getStatusLabel(submission.status)}
                        </span>
                      </div>

                      <p className="text-sm text-gray-700 line-clamp-2 mb-3">{submission.message}</p>

                      <p className="text-xs text-gray-500">
                        {new Date(submission.createdAt).toLocaleDateString("pt-BR", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="py-12 text-center">
                  <MessageSquare className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-600">Nenhuma submissão recebida ainda</p>
                </div>
              )}
            </Card>
          </div>

          {/* Submission Details */}
          <div>
            {selectedData ? (
              <Card className="overflow-hidden sticky top-20">
                <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
                  <h2 className="text-lg font-semibold text-gray-900">Detalhes da Submissão</h2>
                </div>

                <div className="p-6 space-y-6">
                  {/* Name */}
                  <div>
                    <label className="text-sm font-medium text-gray-700">Nome</label>
                    <p className="mt-1 text-gray-900">{selectedData.name}</p>
                  </div>

                  {/* Email */}
                  <div>
                    <label className="text-sm font-medium text-gray-700">Email</label>
                    <p className="mt-1 text-gray-900 break-all">{selectedData.email}</p>
                  </div>

                  {/* Phone */}
                  {selectedData.phone && (
                    <div>
                      <label className="text-sm font-medium text-gray-700">Telefone</label>
                      <p className="mt-1 text-gray-900">{selectedData.phone}</p>
                    </div>
                  )}

                  {/* Message */}
                  <div>
                    <label className="text-sm font-medium text-gray-700">Mensagem</label>
                    <p className="mt-1 text-gray-900 whitespace-pre-wrap">{selectedData.message}</p>
                  </div>

                  {/* Status */}
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-3 block">Status</label>
                    <div className="space-y-2">
                      {(["new", "read", "replied"] as const).map((status) => (
                        <Button
                          key={status}
                          variant={selectedData.status === status ? "default" : "outline"}
                          className={`w-full justify-start ${
                            selectedData.status === status
                              ? "bg-orange-500 hover:bg-orange-600"
                              : "hover:bg-gray-100"
                          }`}
                          onClick={() =>
                            updateStatusMutation.mutate({
                              id: selectedData.id,
                              status,
                            })
                          }
                          disabled={updateStatusMutation.isPending}
                        >
                          {updateStatusMutation.isPending ? (
                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          ) : null}
                          {getStatusLabel(status)}
                        </Button>
                      ))}
                    </div>
                  </div>

                  {/* Date */}
                  <div className="pt-4 border-t border-gray-200">
                    <p className="text-xs text-gray-500">
                      Recebido em:{" "}
                      {new Date(selectedData.createdAt).toLocaleDateString("pt-BR", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>
                </div>
              </Card>
            ) : (
              <Card className="p-6 text-center sticky top-20">
                <Eye className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-600">Selecione uma submissão para ver os detalhes</p>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

