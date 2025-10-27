import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import { toast } from "sonner";
import { Loader2, Heart, Home as HomeIcon, Gift } from "lucide-react";

export default function Home() {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
    terms: false,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const submitContactMutation = trpc.contact.submit.useMutation({
    onSuccess: () => {
      toast.success("Mensagem enviada com sucesso!");
      setFormData({ name: "", email: "", phone: "", message: "", terms: false });
      setErrors({});
    },
    onError: (error) => {
      toast.error(error.message || "Erro ao enviar mensagem");
    },
  });

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim() || formData.name.length < 3) {
      newErrors.name = "Nome deve ter pelo menos 3 caracteres";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email é obrigatório";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Email inválido";
    }

    if (!formData.message.trim() || formData.message.length < 10) {
      newErrors.message = "Mensagem deve ter pelo menos 10 caracteres";
    }

    if (!formData.terms) {
      newErrors.terms = "Você deve concordar para continuar";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      await submitContactMutation.mutateAsync({
        name: formData.name,
        email: formData.email,
        phone: formData.phone || undefined,
        message: formData.message,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <img src="/logo_icon.webp" alt="Logo" className="h-10 w-auto" />
            <span className="font-bold text-lg">Marketplace Solidário</span>
          </div>
          <nav className="hidden md:flex gap-6">
            <a href="#sobre" className="text-gray-700 hover:text-orange-500 transition">
              Sobre
            </a>
            <a href="#como-funciona" className="text-gray-700 hover:text-orange-500 transition">
              Como Funciona
            </a>
            <a href="#contato" className="text-gray-700 hover:text-orange-500 transition">
              Contato
            </a>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section
        className="relative min-h-screen flex items-center justify-center bg-cover bg-center overflow-hidden"
        style={{
          backgroundImage: "url('/hero_background.webp')",
        }}
      >
        <div className="absolute inset-0 bg-black/50 z-0"></div>

        <div className="relative z-10 text-center text-white max-w-2xl px-4">
          <div className="mb-8 flex justify-center">
            <img src="/logo_icon.webp" alt="Logo" className="h-32 w-auto drop-shadow-lg" />
          </div>

          <h1 className="text-5xl md:text-6xl font-black mb-4">
            <span className="text-orange-400">Marketplace</span>
            <br />
            <span>Solidário</span>
          </h1>

          <p className="text-lg md:text-xl mb-8 uppercase tracking-wider font-semibold">
            Conectando Doadores a Vítimas de Enchentes para Apoio Emergencial
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              className="bg-orange-500 hover:bg-orange-600 text-white rounded-full px-8"
              onClick={() => document.getElementById("contato")?.scrollIntoView({ behavior: "smooth" })}
            >
              Preciso de Doação
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-2 border-orange-500 text-orange-500 hover:bg-orange-500 hover:text-white rounded-full px-8"
              onClick={() => document.getElementById("contato")?.scrollIntoView({ behavior: "smooth" })}
            >
              Faça Sua Doação
            </Button>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="sobre" className="py-16 md:py-24 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-bold mb-6 text-gray-900">
                Transforme a sua solidariedade em impacto real
              </h2>
              <p className="text-gray-700 mb-4 text-lg">
                O Marketplace Solidário é uma plataforma inovadora que conecta doadores generosos com vítimas de
                enchentes que precisam de ajuda emergencial. Nossa missão é facilitar a solidariedade e criar um
                impacto positivo imediato nas comunidades afetadas por desastres naturais.
              </p>
              <p className="text-gray-700 mb-6 text-lg">
                Através de uma interface simples e intuitiva, você pode rapidamente identificar quem precisa de ajuda
                e como você pode contribuir. Cada doação faz diferença e salva vidas.
              </p>
              <Button
                size="lg"
                className="bg-orange-500 hover:bg-orange-600 text-white rounded-full"
                onClick={() => document.getElementById("como-funciona")?.scrollIntoView({ behavior: "smooth" })}
              >
                Saiba Mais
              </Button>
            </div>
            <div>
              <img
                src="/section_one_image.webp"
                alt="Pessoas ajudando"
                className="rounded-lg shadow-lg w-full"
              />
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="como-funciona" className="py-16 md:py-24 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-16 text-gray-900">Como Funciona</h2>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: HomeIcon,
                title: "Encontre Quem Precisa",
                description:
                  "Navegue pela plataforma e encontre pessoas e comunidades que precisam de ajuda emergencial. Cada perfil contém informações detalhadas sobre as necessidades.",
              },
              {
                icon: Gift,
                title: "Escolha Como Ajudar",
                description:
                  "Você pode contribuir com doações financeiras, alimentos, roupas, medicamentos ou outras necessidades. Escolha a forma que melhor se adequa à sua capacidade.",
              },
              {
                icon: Heart,
                title: "Acompanhe o Impacto",
                description:
                  "Veja em tempo real como sua doação está ajudando. Receba atualizações sobre o progresso e o impacto de sua contribuição na vida das pessoas.",
              },
            ].map((item, index) => (
              <Card key={index} className="p-8 text-center hover:shadow-lg transition">
                <div className="flex justify-center mb-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-orange-400 to-orange-600 rounded-full flex items-center justify-center text-white">
                    <item.icon size={32} />
                  </div>
                </div>
                <h3 className="text-xl font-bold mb-4 text-gray-900">{item.title}</h3>
                <p className="text-gray-700">{item.description}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contato" className="py-16 md:py-24 bg-gradient-to-br from-orange-500 to-orange-600">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-4 text-white">Pronto para Fazer a Diferença?</h2>
          <p className="text-center text-white/95 mb-12 text-lg">
            Junte-se a milhares de pessoas que já estão ajudando. Sua contribuição pode salvar vidas e restaurar
            esperança em comunidades afetadas.
          </p>

          {/* Contact Form */}
          <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-2xl p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Name Field */}
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">Nome Completo *</label>
                <Input
                  type="text"
                  placeholder="Seu nome completo"
                  value={formData.name}
                  onChange={(e) => {
                    setFormData({ ...formData, name: e.target.value });
                    if (errors.name) setErrors({ ...errors, name: "" });
                  }}
                  className={errors.name ? "border-red-500" : ""}
                />
                {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
              </div>

              {/* Email Field */}
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">Email *</label>
                <Input
                  type="email"
                  placeholder="seu.email@exemplo.com"
                  value={formData.email}
                  onChange={(e) => {
                    setFormData({ ...formData, email: e.target.value });
                    if (errors.email) setErrors({ ...errors, email: "" });
                  }}
                  className={errors.email ? "border-red-500" : ""}
                />
                {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
              </div>

              {/* Phone Field */}
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">Telefone</label>
                <Input
                  type="tel"
                  placeholder="(11) 99999-9999"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                />
              </div>

              {/* Message Field */}
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">Mensagem *</label>
                <Textarea
                  placeholder="Conte-nos como podemos ajudar ou como você gostaria de contribuir..."
                  value={formData.message}
                  onChange={(e) => {
                    setFormData({ ...formData, message: e.target.value });
                    if (errors.message) setErrors({ ...errors, message: "" });
                  }}
                  rows={5}
                  className={errors.message ? "border-red-500" : ""}
                />
                {errors.message && <p className="text-red-500 text-sm mt-1">{errors.message}</p>}
              </div>

              {/* Terms Checkbox */}
              <div className="flex items-start gap-3">
                <Checkbox
                  id="terms"
                  checked={formData.terms}
                  onCheckedChange={(checked) => {
                    setFormData({ ...formData, terms: checked as boolean });
                    if (errors.terms) setErrors({ ...errors, terms: "" });
                  }}
                  className="mt-1"
                />
                <label htmlFor="terms" className="text-sm text-gray-700 cursor-pointer">
                  Concordo em receber atualizações sobre o projeto *
                </label>
              </div>
              {errors.terms && <p className="text-red-500 text-sm">{errors.terms}</p>}

              {/* Submit Button */}
              <Button
                type="submit"
                disabled={isSubmitting || submitContactMutation.isPending}
                className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 rounded-lg"
              >
                {isSubmitting || submitContactMutation.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Enviando...
                  </>
                ) : (
                  "Enviar Mensagem"
                )}
              </Button>
            </form>
          </div>

          {/* Alternative Buttons */}
          <div className="text-center mt-12">
            <p className="text-white/90 mb-6">Ou escolha uma opção rápida:</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/20 rounded-full">
                Preciso de Doação
              </Button>
              <Button size="lg" className="bg-white text-orange-600 hover:bg-gray-100 rounded-full">
                Faça Sua Doação
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <div className="mb-6 flex justify-center gap-6 flex-wrap">
            <a href="#inicio" className="hover:text-orange-500 transition">
              Início
            </a>
            <a href="#sobre" className="hover:text-orange-500 transition">
              Sobre
            </a>
            <a href="#como-funciona" className="hover:text-orange-500 transition">
              Como Funciona
            </a>
            <a href="#contato" className="hover:text-orange-500 transition">
              Contato
            </a>
          </div>

          <div className="border-t border-gray-700 pt-6">
            <p className="mb-2">
              &copy; 2025 Marketplace Solidário. Todos os direitos reservados. |{" "}
              <a
                href="https://github.com/gabrielachavier/marketplace-solidario"
                target="_blank"
                rel="noopener noreferrer"
                className="text-orange-500 hover:underline"
              >
                Veja no GitHub
              </a>
            </p>
            <p>Desenvolvido com ❤️ para fazer a diferença.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

