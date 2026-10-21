import React, { useState, useEffect } from "react";
import { X, Sparkles, User, Mail, Phone, ArrowRight, Lock, CheckCircle2, Loader2, BookOpen } from "lucide-react";

interface RegistrationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const RegistrationModal: React.FC<RegistrationModalProps> = ({ isOpen, onClose }) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fecha no ESC
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  // Bloqueia scroll do body quando modal está aberto
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  // Formatação de telefone / WhatsApp
  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, "");
    if (value.length > 11) value = value.slice(0, 11);
    
    if (value.length > 6) {
      value = `(${value.slice(0, 2)}) ${value.slice(2, 7)}-${value.slice(7)}`;
    } else if (value.length > 2) {
      value = `(${value.slice(0, 2)}) ${value.slice(2)}`;
    } else if (value.length > 0) {
      value = `(${value}`;
    }
    setPhone(value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const cleanEmail = email.trim();
    const cleanName = name.trim();

    if (!cleanName) {
      setError("Por favor, digite seu nome.");
      return;
    }
    if (!cleanEmail || !cleanEmail.includes("@")) {
      setError("Por favor, informe um e-mail válido.");
      return;
    }

    setLoading(true);

    try {
      const urlRef = new URLSearchParams(window.location.search).get("ref");
      const res = await fetch("/api/register/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: cleanName,
          email: cleanEmail,
          phone: phone.trim(),
          ref: urlRef
        })
      });

      const data = await res.json();

      if (res.ok && data.success && data.reader) {
        const reader = data.reader;

        // Dispara evento Lead no Meta Pixel do navegador
        if (typeof (window as any).fbq === "function") {
          try {
            (window as any).fbq("track", "Lead", {
              content_name: "Degustacao E-reader Landing Page",
              currency: "BRL",
              value: 0.0
            }, { eventID: "lead_" + reader.access_token });
          } catch (err) {
            console.warn("fbq lead track error:", err);
          }
        }

        // Salva dados no localStorage do leitor
        localStorage.setItem("ush_token", reader.access_token);
        localStorage.setItem("ush_name", reader.name);
        localStorage.setItem("ush_reader_status", reader.status || "free");
        sessionStorage.setItem("ush_just_registered", "1");

        // Redireciona com pequeno delay para garantir o disparo completo de rede
        setTimeout(() => {
          window.location.href = `/reader/?token=${encodeURIComponent(reader.access_token)}`;
        }, 300);
      } else {
        setError(data.error || "Não foi possível liberar o acesso. Tente novamente.");
        setLoading(false);
      }
    } catch (err: any) {
      setError("Erro de conexão ao criar sua identidade. Verifique sua rede e tente novamente.");
      setLoading(false);
    }
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div 
        className="relative w-full max-w-lg bg-[#0b1120] border border-gold/40 rounded-3xl p-6 sm:p-8 shadow-[0_0_60px_rgba(0,0,0,0.85)] text-slate-100 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Glow de fundo */}
        <div className="absolute -top-24 -right-24 w-56 h-56 bg-gold/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-56 h-56 bg-sky-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Botão Fechar */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white hover:bg-white/10 rounded-full transition-all z-10 cursor-pointer"
          aria-label="Fechar modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Top Badge */}
        <div className="text-center mb-3">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/15 text-emerald-400 text-xs font-bold border border-emerald-500/30 uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" /> Degustação 100% Gratuita Liberada
          </span>
        </div>

        {/* Cabeçalho */}
        <div className="text-center mb-6">
          <h3 className="text-2xl sm:text-3xl font-bold font-display tracking-tight text-white mb-2">
            Inicie Sua Leitura Agora
          </h3>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-light">
            Crie sua identidade de leitor para acessar os primeiros capítulos no e-reader nativo. Sem cartão de crédito e sem cobranças surpresa.
          </p>
        </div>

        {/* Formulário */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="p-3 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
              <span>⚠️</span>
              <span>{error}</span>
            </div>
          )}

          {/* Campo Nome */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5 uppercase tracking-wider">
              Seu Nome Completo
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <User className="w-4 h-4" />
              </div>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Como podemos te chamar?"
                required
                disabled={loading}
                className="w-full pl-10 pr-4 py-3 bg-[#15213b]/80 border border-slate-700/80 focus:border-gold rounded-xl text-white placeholder-slate-500 text-sm focus:outline-none focus:ring-1 focus:ring-gold transition-all"
              />
            </div>
          </div>

          {/* Campo E-mail */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5 uppercase tracking-wider">
              Seu Melhor E-mail
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <Mail className="w-4 h-4" />
              </div>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="exemplo@email.com"
                required
                disabled={loading}
                className="w-full pl-10 pr-4 py-3 bg-[#15213b]/80 border border-slate-700/80 focus:border-gold rounded-xl text-white placeholder-slate-500 text-sm focus:outline-none focus:ring-1 focus:ring-gold transition-all"
              />
            </div>
          </div>

          {/* Campo WhatsApp */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider">
                WhatsApp / Celular
              </label>
              <span className="text-[11px] text-slate-400">(Opcional)</span>
            </div>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <Phone className="w-4 h-4" />
              </div>
              <input
                type="tel"
                value={phone}
                onChange={handlePhoneChange}
                placeholder="(00) 00000-0000"
                disabled={loading}
                className="w-full pl-10 pr-4 py-3 bg-[#15213b]/80 border border-slate-700/80 focus:border-gold rounded-xl text-white placeholder-slate-500 text-sm focus:outline-none focus:ring-1 focus:ring-gold transition-all"
              />
            </div>
          </div>

          {/* Botão de Envio CTA */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={loading}
              className="relative overflow-hidden w-full py-4 px-6 rounded-xl font-extrabold text-sm sm:text-base tracking-wider uppercase text-slate-950 bg-gradient-to-r from-[#c9a962] via-[#e5c985] to-[#c9a962] hover:from-[#dfb76c] hover:to-[#dfb76c] shadow-[0_0_30px_rgba(201,169,98,0.4)] hover:shadow-[0_0_40px_rgba(201,169,98,0.6)] transition-all duration-300 flex items-center justify-center gap-2 group cursor-pointer disabled:opacity-75 disabled:cursor-not-allowed"
            >
              <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/40 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out pointer-events-none" />
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin text-slate-950" />
                  <span>LIBERANDO SEU ACESSO...</span>
                </>
              ) : (
                <>
                  <BookOpen className="w-5 h-5 text-slate-950" />
                  <span>ACESSAR A DEGUSTAÇÃO AGORA</span>
                  <ArrowRight className="w-5 h-5 text-slate-950 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </div>
        </form>

        {/* Rodapé e Selos de Confiança */}
        <div className="mt-5 pt-4 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-2 text-[11px] text-slate-400">
          <div className="flex items-center gap-1.5">
            <Lock className="w-3.5 h-3.5 text-emerald-400" />
            <span>Dados 100% protegidos</span>
          </div>
          <div className="flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            <span>Você só paga se amar a história</span>
          </div>
        </div>
      </div>
    </div>
  );
};
