import { useState, useEffect, useRef } from "react";
import { 
  Check, 
  ShieldCheck, 
  Lock, 
  QrCode, 
  CreditCard, 
  Loader2, 
  Sparkles, 
  Copy, 
  CheckCircle2, 
  Flame,
  Clock,
  RotateCcw
} from "lucide-react";

export const SpecialCheckoutSection = () => {
  const [method, setMethod] = useState<"pix" | "card">("pix");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [cpf, setCpf] = useState("");

  // Card fields
  const [cardNumber, setCardNumber] = useState("");
  const [cardHolder, setCardHolder] = useState("");
  const [cardExpiry, setCardExpiry] = useState("");
  const [cardCvv, setCardCvv] = useState("");
  const [installments, setInstallments] = useState("3");

  // State
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pixData, setPixData] = useState<{ qrCode: string; qrCodeUrl?: string; orderId?: string; accessToken?: string } | null>(null);
  const [copied, setCopied] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  // Tracking flags
  const hasTrackedLead = useRef(false);
  const hasRecordedAbandonment = useRef(false);

  // Captura silenciosa de Lead e Contato no Admin (Checkout Iniciado)
  const captureContact = async () => {
    const cleanPhone = phone.replace(/\D/g, "");
    const cleanEmail = email.trim().toLowerCase();

    // Se temos email e telefone válidos (mínimo 10 dígitos)
    if (cleanEmail.includes("@") && cleanEmail.includes(".") && cleanPhone.length >= 10) {
      
      // Dispara evento Lead no Meta Pixel se ainda não disparou
      if (!hasTrackedLead.current) {
        hasTrackedLead.current = true;
        if (typeof (window as any).fbq === "function") {
          try {
            (window as any).fbq("track", "Lead", {
              content_name: "Edicao Especial - Pre-Checkout",
              currency: "BRL",
              value: 29.90
            });
          } catch (e) {}
        }
      }

      // Salva silenciosamente no Supabase para aparecer no Admin com a tag "Checkout Iniciado"
      if (!hasRecordedAbandonment.current) {
        hasRecordedAbandonment.current = true;
        try {
          const urlRef = new URLSearchParams(window.location.search).get("ref");
          await fetch("/api/abandoned-cart/", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              name: name.trim() || "Interessado Edição Especial",
              email: cleanEmail,
              phone: cleanPhone,
              ref: urlRef
            })
          });
        } catch (err) {
          // Silencioso em caso de erro de rede
        }
      }
    }
  };

  // Auto-captura com debounce enquanto o usuário digita (garante salvar mesmo sem onBlur se fechar a aba)
  useEffect(() => {
    const cleanPhone = phone.replace(/\D/g, "");
    const cleanEmail = email.trim().toLowerCase();
    if (cleanEmail.includes("@") && cleanEmail.includes(".") && cleanPhone.length >= 10 && !hasRecordedAbandonment.current) {
      const timer = setTimeout(() => {
        captureContact();
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [email, phone, name]);

  // Polling automático para verificar pagamento do PIX
  useEffect(() => {
    if (!pixData?.accessToken || paymentSuccess) return;

    const interval = setInterval(async () => {
      try {
        const res = await fetch(`/api/get-reader-profile/?token=${encodeURIComponent(pixData.accessToken!)}`);
        if (res.ok) {
          const profile = await res.json();
          if (profile && profile.status === "paid") {
            setPaymentSuccess(true);
            clearInterval(interval);

            localStorage.setItem("ush_token", pixData.accessToken!);
            localStorage.setItem("ush_name", name.trim() || profile.name || "Leitor");
            localStorage.setItem("ush_reader_status", "paid");

            if (typeof (window as any).fbq === "function") {
              try {
                (window as any).fbq("track", "Purchase", {
                  content_name: "O Ultimo Segredo da Humanidade - Edicao Especial",
                  currency: "BRL",
                  value: 29.90
                }, { eventID: `order_${pixData.orderId}` });
              } catch (e) {}
            }

            setTimeout(() => {
              window.location.href = `/reader/?token=${encodeURIComponent(pixData.accessToken!)}`;
            }, 1800);
          }
        }
      } catch (e) {}
    }, 3500);

    return () => clearInterval(interval);
  }, [pixData, paymentSuccess, name]);

  // Masks
  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let val = e.target.value.replace(/\D/g, "").slice(0, 11);
    if (val.length > 6) val = `(${val.slice(0, 2)}) ${val.slice(2, 7)}-${val.slice(7)}`;
    else if (val.length > 2) val = `(${val.slice(0, 2)}) ${val.slice(2)}`;
    else if (val.length > 0) val = `(${val}`;
    setPhone(val);
  };

  const handleCpfChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let val = e.target.value.replace(/\D/g, "").slice(0, 11);
    if (val.length > 9) val = `${val.slice(0, 3)}.${val.slice(3, 6)}.${val.slice(6, 9)}-${val.slice(9)}`;
    else if (val.length > 6) val = `${val.slice(0, 3)}.${val.slice(3, 6)}.${val.slice(6)}`;
    else if (val.length > 3) val = `${val.slice(0, 3)}.${val.slice(3)}`;
    setCpf(val);
  };

  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let val = e.target.value.replace(/\D/g, "").slice(0, 16);
    val = val.replace(/(.{4})/g, "$1 ").trim();
    setCardNumber(val);
  };

  const handleExpiryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let val = e.target.value.replace(/\D/g, "").slice(0, 4);
    if (val.length >= 2) val = `${val.slice(0, 2)}/${val.slice(2)}`;
    setCardExpiry(val);
  };

  const copyPixCode = () => {
    if (pixData?.qrCode) {
      navigator.clipboard.writeText(pixData.qrCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const cleanCpf = cpf.replace(/\D/g, "");
    if (cleanCpf.length !== 11) {
      setError("Por favor, digite um CPF válido com 11 dígitos.");
      return;
    }

    if (!name.trim()) {
      setError("Por favor, informe seu nome completo.");
      return;
    }
    if (!email.trim() || !email.includes("@")) {
      setError("Por favor, informe um e-mail válido para receber o acesso.");
      return;
    }

    const cleanPhone = phone.replace(/\D/g, "");

    // DISPARO DO INITIATECHECKOUT REAL (Ação 1)
    // Ocorre EXATAMENTE quando o usuário preencheu os dados completos e clicou para pagar
    if (typeof (window as any).fbq === "function") {
      try {
        (window as any).fbq("track", "InitiateCheckout", {
          content_name: "Edicao Especial - Finalizacao de Compra",
          currency: "BRL",
          value: 29.90
        });
      } catch (e) {}
    }

    setLoading(true);

    try {
      const urlRef = new URLSearchParams(window.location.search).get("ref");

      // Garante registro de checkout iniciado no Supabase
      fetch("/api/abandoned-cart/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim().toLowerCase(),
          phone: cleanPhone,
          ref: urlRef
        })
      }).catch(() => {});

      const bodyPayload: any = {
        name: name.trim(),
        email: email.trim().toLowerCase(),
        phone: cleanPhone,
        cpf: cleanCpf,
        payment_method: method === "card" ? "credit_card" : "pix",
        ref: urlRef
      };

      if (method === "card") {
        const cleanCard = cardNumber.replace(/\D/g, "");
        if (cleanCard.length < 13) {
          setError("Número de cartão inválido.");
          setLoading(false);
          return;
        }
        const expParts = cardExpiry.split("/");
        if (expParts.length !== 2) {
          setError("Validade inválida. Utilize MM/AA.");
          setLoading(false);
          return;
        }

        bodyPayload.card = {
          number: cleanCard,
          holder_name: cardHolder.trim().toUpperCase(),
          exp_month: parseInt(expParts[0], 10),
          exp_year: parseInt(expParts[1], 10),
          cvv: cardCvv.trim(),
          installments: parseInt(installments, 10),
          cpf: cleanCpf
        };
      }

      const res = await fetch("/api/create-order/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(bodyPayload)
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        setError(data.error || "Não foi possível processar a transação. Verifique os dados.");
        setLoading(false);
        return;
      }

      // Se for Cartão aprovado
      if (data.paid && data.accessToken) {
        setPaymentSuccess(true);
        localStorage.setItem("ush_token", data.accessToken);
        localStorage.setItem("ush_name", name.trim());
        localStorage.setItem("ush_reader_status", "paid");

        if (typeof (window as any).fbq === "function") {
          try {
            (window as any).fbq("track", "Purchase", {
              content_name: "O Ultimo Segredo da Humanidade - Edicao Especial",
              currency: "BRL",
              value: 29.90
            }, { eventID: `order_${data.orderId}` });
          } catch(e) {}
        }

        setTimeout(() => {
          window.location.href = `/reader/?token=${encodeURIComponent(data.accessToken)}`;
        }, 1500);
        return;
      }

      // Se for PIX
      if (data.pixQrCode) {
        setPixData({
          qrCode: data.pixQrCode,
          qrCodeUrl: data.pixQrCodeUrl,
          orderId: data.orderId,
          accessToken: data.accessToken
        });

        if (data.accessToken) {
          localStorage.setItem("ush_token", data.accessToken);
          localStorage.setItem("ush_name", name.trim());
        }

        setLoading(false);
      }
    } catch(err: any) {
      setError("Erro de conexão ao processar o pagamento. Verifique sua rede e tente novamente.");
      setLoading(false);
    }
  };

  return (
    <section id="checkout-section" className="relative py-24 px-4 sm:px-6 overflow-visible">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[750px] h-[550px] bg-gradient-to-r from-gold/15 via-emerald-500/10 to-sky-500/10 rounded-full blur-[160px] pointer-events-none" />

      <div className="max-w-5xl mx-auto relative z-10 space-y-12">

        {/* Cabeçalho */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-emerald-500/15 text-emerald-400 text-xs font-bold font-mono tracking-wider uppercase border border-emerald-500/30">
            <Sparkles className="w-3.5 h-3.5" /> ACESSO DEFINITIVO // OFERTA DE LANÇAMENTO
          </span>

          <h2 className="font-sans text-3xl sm:text-4xl md:text-5xl font-extrabold text-foreground leading-tight tracking-tight">
            Desbloqueie a obra completa agora mesmo.
          </h2>

          <p className="text-base sm:text-lg text-slate-300 font-light leading-relaxed">
            Sem mensalidades, sem assinaturas escondidas. Um pagamento único garante sua chave vitalícia para todo o universo de O Último Segredo.
          </p>

          {/* Barra de Escassez Real - Lote de Lançamento */}
          <div className="pt-2 max-w-xl mx-auto">
            <div className="p-4 rounded-2xl bg-[#0e172a]/95 border border-gold/40 shadow-xl space-y-2">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="flex items-center gap-1.5 text-gold font-bold">
                  <Flame className="w-4 h-4 text-amber-400 animate-pulse" />
                  LOTE 01 (R$ 29,90 + 4 DOSSIÊS)
                </span>
                <span className="text-amber-300 font-bold">84% PREENCHIDO</span>
              </div>
              <div className="w-full h-3 bg-slate-800 rounded-full overflow-hidden p-0.5 border border-slate-700">
                <div 
                  className="h-full bg-gradient-to-r from-amber-500 via-gold to-emerald-400 rounded-full transition-all duration-1000 shadow-[0_0_12px_rgba(201,169,98,0.6)]"
                  style={{ width: "84%" }}
                />
              </div>
              <p className="text-xs text-slate-300 leading-tight">
                Ao encerrar o lote promocional, o acesso passará para o valor oficial de <strong className="text-white">R$ 49,90</strong> e os 4 Dossiês Históricos serão vendidos separadamente.
              </p>
            </div>
          </div>
        </div>

        {/* Grade: Resumo do Pacote + Formulário de Pagamento Nativo */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Coluna Esquerda: Resumo de Entrega */}
          <div className="lg:col-span-5 p-6 sm:p-8 rounded-3xl bg-[#0b1222]/95 border border-gold/30 shadow-2xl space-y-6">
            <div className="flex items-center gap-4 pb-6 border-b border-white/10">
              <div className="relative shrink-0">
                <img
                  src="/capa_ush.jpg"
                  alt="Capa do Livro"
                  className="w-20 sm:w-24 h-auto rounded-xl shadow-[0_10px_25px_rgba(0,0,0,0.8)] border border-gold/40"
                  loading="lazy"
                />
              </div>
              <div className="space-y-1">
                <span className="text-[11px] font-mono font-bold text-gold uppercase tracking-wider block">
                  PACOTE DIGITAL COMPLETO
                </span>
                <h3 className="font-display font-bold text-xl sm:text-2xl text-white leading-tight">
                  O Último Segredo da Humanidade
                </h3>
                <p className="text-xs text-slate-400">Por Leonardo de Paula — Edição Oficial</p>
              </div>
            </div>

            <ul className="space-y-3.5 text-xs sm:text-sm text-slate-200">
              <li className="flex items-start gap-2.5">
                <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span><strong>Obra Completa: 21 Capítulos + Prólogo & Epílogo</strong> (23 partes integrais sem cortes).</span>
              </li>
              <li className="flex items-start gap-2.5">
                <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span><strong>E-Reader Nativo Vitalício</strong> para celular, tablet e computador com Modos Escuro, Sépia e Claro.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span><strong>4 Dossiês Históricos Secretos</strong> com mapas táticos, linhas do tempo e relatórios desclassificados.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span><strong>App PWA Oficial</strong> com leitura offline sem precisar baixar em lojas de aplicativos.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span><strong>Chave da Corrente</strong> com passe prioritário e vantagens garantidas no Livro II.</span>
              </li>
            </ul>

            <div className="p-4 rounded-2xl bg-black/60 border border-gold/30 space-y-1 text-center">
              <span className="text-xs text-slate-400 line-through block">De R$ 49,90</span>
              <div className="flex items-baseline justify-center gap-2">
                <span className="text-3xl sm:text-4xl font-black text-emerald-400 font-display">R$ 29,90</span>
                <span className="text-xs text-slate-300 font-light">à vista</span>
              </div>
              <span className="text-xs text-amber-300 font-medium block pt-0.5">
                ou em até <strong>3x de R$ 9,96</strong> no cartão de crédito
              </span>
            </div>

            {/* Selo Garantia Incondicional de 7 Dias */}
            <div className="p-4 rounded-2xl bg-emerald-950/40 border border-emerald-500/40 text-emerald-300 text-xs space-y-1.5 shadow-md">
              <div className="flex items-center gap-2 font-bold text-emerald-400 text-sm">
                <RotateCcw className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Garantia de Leitura: 7 Dias Incondicionais</span>
              </div>
              <p className="text-xs text-emerald-200/90 leading-relaxed font-normal">
                Se você abrir os primeiros capítulos e sentir que a história não é para você, devolvemos 100% do seu PIX com um único e-mail. Risco zero.
              </p>
            </div>

            <div className="flex items-center justify-center gap-4 text-xs text-slate-400 pt-1 border-t border-white/5">
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>Pagar.me Seguro</span>
              </div>
              <span>•</span>
              <div className="flex items-center gap-1.5">
                <Lock className="w-4 h-4 text-emerald-400" />
                <span>256-Bit SSL</span>
              </div>
            </div>
          </div>

          {/* Coluna Direita: Checkout Nativo */}
          <div className="lg:col-span-7 p-6 sm:p-8 rounded-3xl bg-[#0b1120] border border-cyan/30 shadow-[0_0_50px_rgba(0,0,0,0.7)] space-y-6">
            
            {paymentSuccess ? (
              /* ESTADO SUCESSO APROVADO */
              <div className="text-center space-y-6 py-8 animate-in fade-in zoom-in-95">
                <div className="w-16 h-16 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center mx-auto text-emerald-400 shadow-[0_0_30px_rgba(34,197,94,0.4)]">
                  <CheckCircle2 className="w-10 h-10" />
                </div>
                <div className="space-y-2">
                  <h3 className="font-display font-bold text-2xl sm:text-3xl text-white">Pagamento Confirmado!</h3>
                  <p className="text-sm text-slate-300 max-w-md mx-auto">
                    Seu acesso à obra completa está liberado. Redirecionando para o seu e-reader em instantes...
                  </p>
                </div>
                <div className="flex items-center justify-center gap-2 text-xs text-emerald-400 font-mono">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Carregando sua biblioteca digital...</span>
                </div>
              </div>
            ) : pixData ? (
              /* ESTADO PIX GERADO */
              <div className="text-center space-y-6 py-4 animate-in fade-in">
                <div className="w-14 h-14 rounded-full bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center mx-auto text-emerald-400">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <div className="space-y-1">
                  <h3 className="font-display font-bold text-2xl text-white">Código PIX Gerado!</h3>
                  <p className="text-xs sm:text-sm text-slate-300">
                    Abra o app do seu banco, copie o código abaixo ou escaneie o QR Code. Seu acesso é liberado no mesmo segundo do pagamento!
                  </p>
                </div>

                {pixData.qrCodeUrl && (
                  <div className="flex justify-center p-3 bg-white rounded-2xl w-fit mx-auto shadow-lg">
                    <img src={pixData.qrCodeUrl} alt="QR Code PIX" className="w-48 h-48" />
                  </div>
                )}

                <div className="space-y-2">
                  <label className="text-xs text-slate-400 font-mono block">Código Copia e Cola:</label>
                  <div className="flex items-center gap-2 max-w-md mx-auto">
                    <input
                      type="text"
                      readOnly
                      value={pixData.qrCode}
                      className="w-full text-xs font-mono p-3.5 bg-[#15213b] border border-slate-700 rounded-xl text-slate-300 select-all"
                    />
                    <button
                      type="button"
                      onClick={copyPixCode}
                      className="px-5 py-3.5 min-h-[48px] bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-xl text-xs sm:text-sm flex items-center gap-1.5 transition-colors shrink-0 cursor-pointer shadow-md"
                    >
                      {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                      <span>{copied ? "Copiado!" : "Copiar"}</span>
                    </button>
                  </div>
                </div>

                <div className="p-3.5 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-xs text-emerald-400 flex items-center justify-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin shrink-0" />
                  <span>Aguardando confirmação bancária em tempo real... Você será redirecionado automaticamente.</span>
                </div>

                <button
                  type="button"
                  onClick={() => setPixData(null)}
                  className="text-xs text-slate-400 hover:text-white underline pt-2"
                >
                  Voltar e alterar forma de pagamento
                </button>
              </div>
            ) : (
              /* FORMULÁRIO DE CHECKOUT */
              <form onSubmit={handleSubmit} className="space-y-6">
                
                {/* Seletor de Método */}
                <div className="grid grid-cols-2 gap-3.5">
                  <button
                    type="button"
                    onClick={() => setMethod("pix")}
                    className={`flex items-center justify-center gap-2.5 py-4 px-4 min-h-[58px] rounded-2xl border text-sm sm:text-base font-bold transition-all cursor-pointer ${
                      method === "pix"
                        ? "bg-emerald-500/20 border-emerald-400 text-emerald-300 shadow-[0_0_20px_rgba(52,211,153,0.25)] scale-[1.02]"
                        : "bg-[#131b2e] border-slate-800 text-slate-400 hover:text-white"
                    }`}
                  >
                    <QrCode className="w-5 h-5 text-emerald-400" />
                    <span>PIX Instantâneo</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setMethod("card")}
                    className={`flex items-center justify-center gap-2.5 py-4 px-4 min-h-[58px] rounded-2xl border text-sm sm:text-base font-bold transition-all cursor-pointer ${
                      method === "card"
                        ? "bg-sky-500/20 border-sky-400 text-sky-300 shadow-[0_0_20px_rgba(56,189,248,0.25)] scale-[1.02]"
                        : "bg-[#131b2e] border-slate-800 text-slate-400 hover:text-white"
                    }`}
                  >
                    <CreditCard className="w-5 h-5 text-sky-400" />
                    <span>Cartão de Crédito</span>
                  </button>
                </div>

                {/* Dados Pessoais para Recebimento */}
                <div className="space-y-4 pt-1">
                  <span className="text-xs font-mono text-slate-400 uppercase tracking-wider block">
                    Dados do Titular para Acesso
                  </span>

                  <div>
                    <label className="text-xs text-slate-300 block mb-1 font-medium">Nome Completo</label>
                    <input
                      type="text"
                      required
                      placeholder="Ex: Carlos Eduardo Silva"
                      value={name}
                      onBlur={captureContact}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full text-sm p-3.5 bg-[#131c31] border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-gold"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs text-slate-300 block mb-1 font-medium">Seu Melhor E-mail</label>
                      <input
                        type="email"
                        required
                        placeholder="onde você receberá a chave"
                        value={email}
                        onBlur={captureContact}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full text-sm p-3.5 bg-[#131c31] border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-gold"
                      />
                    </div>

                    <div>
                      <label className="text-xs text-slate-300 block mb-1 font-medium">WhatsApp / Celular</label>
                      <input
                        type="tel"
                        required
                        inputMode="numeric"
                        placeholder="(11) 99999-9999"
                        value={phone}
                        onBlur={captureContact}
                        onChange={handlePhoneChange}
                        className="w-full text-sm p-3.5 bg-[#131c31] border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-gold"
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="text-xs text-slate-300 font-medium">CPF do Titular</label>
                      <span className="text-[11px] text-slate-400 font-light">Exigência do Banco Central para PIX/Cartão seguro</span>
                    </div>
                    <input
                      type="text"
                      required
                      inputMode="numeric"
                      placeholder="000.000.000-00"
                      value={cpf}
                      onBlur={captureContact}
                      onChange={handleCpfChange}
                      className="w-full text-sm p-3.5 bg-[#131c31] border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-gold"
                    />
                  </div>
                </div>

                {/* Campos do Cartão (se selecionado) */}
                {method === "card" && (
                  <div className="space-y-4 pt-2 border-t border-white/10 animate-in fade-in">
                    <span className="text-xs font-mono text-sky-400 uppercase tracking-wider block">
                      Dados do Cartão de Crédito
                    </span>

                    <div>
                      <label className="text-xs text-slate-300 block mb-1 font-medium">Número do Cartão</label>
                      <input
                        type="text"
                        required
                        inputMode="numeric"
                        placeholder="0000 0000 0000 0000"
                        value={cardNumber}
                        onChange={handleCardNumberChange}
                        className="w-full text-sm p-3.5 bg-[#131c31] border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-sky-400"
                      />
                    </div>

                    <div>
                      <label className="text-xs text-slate-300 block mb-1 font-medium">Nome Impresso no Cartão</label>
                      <input
                        type="text"
                        required
                        placeholder="COMO ESTÁ NO CARTÃO"
                        value={cardHolder}
                        onChange={(e) => setCardHolder(e.target.value)}
                        className="w-full text-sm p-3.5 bg-[#131c31] border border-slate-700 rounded-xl text-white placeholder-slate-500 uppercase focus:outline-none focus:border-sky-400"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-xs text-slate-300 block mb-1 font-medium">Validade (MM/AA)</label>
                        <input
                          type="text"
                          required
                          inputMode="numeric"
                          placeholder="MM/AA"
                          value={cardExpiry}
                          onChange={handleExpiryChange}
                          className="w-full text-sm p-3.5 bg-[#131c31] border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-sky-400"
                        />
                      </div>

                      <div>
                        <label className="text-xs text-slate-300 block mb-1 font-medium">CVV (3 ou 4 dígitos)</label>
                        <input
                          type="text"
                          required
                          inputMode="numeric"
                          placeholder="123"
                          maxLength={4}
                          value={cardCvv}
                          onChange={(e) => setCardCvv(e.target.value.replace(/\D/g, ""))}
                          className="w-full text-sm p-3.5 bg-[#131c31] border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-sky-400"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-xs text-slate-300 block mb-1 font-medium">Opção de Parcelamento</label>
                      <select
                        value={installments}
                        onChange={(e) => setInstallments(e.target.value)}
                        className="w-full text-sm p-3.5 bg-[#131c31] border border-slate-700 rounded-xl text-white focus:outline-none focus:border-sky-400"
                      >
                        <option value="1">1x de R$ 29,90 sem juros</option>
                        <option value="2">2x de R$ 14,95 sem juros</option>
                        <option value="3">3x de R$ 9,96 sem juros (Recomendado)</option>
                      </select>
                    </div>
                  </div>
                )}

                {/* Mensagem de Erro */}
                {error && (
                  <div className="p-3.5 bg-red-500/15 border border-red-500/40 rounded-xl text-xs sm:text-sm text-red-300">
                    {error}
                  </div>
                )}

                {/* Botão de Envio */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full min-h-[64px] sm:min-h-[72px] py-5 sm:py-6 px-6 bg-gradient-to-r from-emerald-500 via-teal-400 to-emerald-500 hover:from-emerald-400 hover:to-emerald-400 text-slate-950 font-black tracking-wider rounded-2xl shadow-[0_0_40px_rgba(52,211,153,0.45)] hover:shadow-[0_0_55px_rgba(52,211,153,0.65)] active:scale-[0.99] transition-all duration-300 text-base sm:text-lg uppercase flex items-center justify-center gap-3 cursor-pointer disabled:opacity-50"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-6 h-6 animate-spin" />
                      <span>Processando Acesso Imediato...</span>
                    </>
                  ) : method === "pix" ? (
                    <>
                      <QrCode className="w-6 h-6" />
                      <span>GERAR CÓDIGO PIX (R$ 29,90)</span>
                    </>
                  ) : (
                    <>
                      <Lock className="w-6 h-6" />
                      <span>PAGAR R$ 29,90 COM CARTÃO</span>
                    </>
                  )}
                </button>

                <div className="flex items-center justify-center gap-2 text-xs text-slate-400 pt-1">
                  <Clock className="w-4 h-4 text-emerald-400" />
                  <span>Liberação automática no mesmo segundo pelo Pagar.me</span>
                </div>
              </form>
            )}

          </div>

        </div>

      </div>
    </section>
  );
};
