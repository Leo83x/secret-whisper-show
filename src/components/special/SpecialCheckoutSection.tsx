import { useState } from "react";
import { Check, ShieldCheck, Lock, QrCode, CreditCard, Loader2, ArrowRight, Sparkles, Copy, CheckCircle2 } from "lucide-react";

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

    setLoading(true);

    try {
      const urlRef = new URLSearchParams(window.location.search).get("ref");
      const bodyPayload: any = {
        name: name.trim(),
        email: email.trim().toLowerCase(),
        phone: phone.replace(/\D/g, ""),
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

        window.location.href = `/reader/?token=${encodeURIComponent(data.accessToken)}`;
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

        if (typeof (window as any).fbq === "function") {
          try {
            (window as any).fbq("track", "InitiateCheckout", {
              content_name: "O Ultimo Segredo da Humanidade - Edicao Especial PIX",
              currency: "BRL",
              value: 29.90
            }, { eventID: `checkout_${data.orderId}` });
          } catch(e) {}
        }

        setLoading(false);
      }
    } catch(err: any) {
      setError("Erro de conexão ao processar o pagamento. Verifique sua rede e tente novamente.");
      setLoading(false);
    }
  };

  return (
    <section id="checkout-section" className="relative py-28 px-4 sm:px-6 overflow-visible">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[750px] h-[550px] bg-gradient-to-r from-gold/15 via-emerald-500/10 to-sky-500/10 rounded-full blur-[160px] pointer-events-none" />

      <div className="max-w-5xl mx-auto relative z-10 space-y-16">

        {/* Cabeçalho */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-emerald-500/15 text-emerald-400 text-xs font-bold font-mono tracking-wider uppercase border border-emerald-500/30">
            <Sparkles className="w-3.5 h-3.5" /> ACESSO DEFINITIVO // OFERTA DE LANÇAMENTO
          </span>

          <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold text-foreground leading-tight">
            Desbloqueie a obra completa agora mesmo.
          </h2>

          <p className="text-base sm:text-lg text-slate-300 font-light leading-relaxed">
            Sem mensalidades, sem assinaturas escondidas. Um pagamento único garante sua chave vitalícia para todo o universo de O Último Segredo.
          </p>
        </div>

        {/* Grade: Resumo do Pacote + Formulário de Pagamento Nativo */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Coluna Esquerda: Resumo de Entrega */}
          <div className="lg:col-span-5 p-6 sm:p-8 rounded-3xl bg-[#0b1222]/90 border border-gold/30 shadow-2xl space-y-6">
            <div className="space-y-2 pb-6 border-b border-white/10">
              <span className="text-xs font-mono font-bold text-gold uppercase tracking-widest block">
                PACOTE DIGITAL COMPLETO
              </span>
              <h3 className="font-display font-bold text-2xl text-white">
                O Último Segredo da Humanidade
              </h3>
              <p className="text-xs text-slate-400">Por Leonardo de Paula — Edição Oficial</p>
            </div>

            <ul className="space-y-3.5 text-xs sm:text-sm text-slate-200">
              <li className="flex items-start gap-2.5">
                <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span><strong>22 Capítulos Completos + Epílogo</strong> (texto integral sem cortes).</span>
              </li>
              <li className="flex items-start gap-2.5">
                <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span><strong>E-Reader Nativo Vitalício</strong> para celular, tablet e computador.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span><strong>4 Dossiês Históricos Secretos</strong> com mapas e relatórios.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span><strong>App PWA Oficial</strong> com leitura offline sem precisar baixar em lojas.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span><strong>Chave da Corrente</strong> com passe prioritário no Livro II.</span>
              </li>
            </ul>

            <div className="p-4 rounded-2xl bg-black/50 border border-gold/25 space-y-1 text-center">
              <span className="text-xs text-slate-400 line-through block">De R$ 49,90</span>
              <div className="flex items-baseline justify-center gap-2">
                <span className="text-3xl sm:text-4xl font-black text-emerald-400 font-display">R$ 29,90</span>
                <span className="text-xs text-slate-300 font-light">à vista</span>
              </div>
              <span className="text-xs text-amber-300 font-medium block pt-0.5">
                ou em até <strong>3x de R$ 9,96</strong> no cartão de crédito
              </span>
            </div>

            <div className="flex items-center justify-center gap-4 text-xs text-slate-400 pt-2 border-t border-white/5">
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
            
            {pixData ? (
              /* ESTADO PIX GERADO */
              <div className="text-center space-y-6 py-4 animate-in fade-in">
                <div className="w-14 h-14 rounded-full bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center mx-auto text-emerald-400">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <div className="space-y-1">
                  <h3 className="font-display font-bold text-2xl text-white">Código PIX Gerado!</h3>
                  <p className="text-xs sm:text-sm text-slate-300">
                    Abra o app do seu banco, copie o código abaixo ou escaneie o QR Code para liberar seu acesso imediatamente.
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
                      className="w-full text-xs font-mono p-3 bg-[#15213b] border border-slate-700 rounded-xl text-slate-300 select-all"
                    />
                    <button
                      type="button"
                      onClick={copyPixCode}
                      className="px-4 py-3 bg-gold hover:bg-gold/80 text-slate-950 font-bold rounded-xl text-xs uppercase flex items-center gap-1.5 shrink-0 transition-all cursor-pointer"
                    >
                      <Copy className="w-4 h-4" />
                      <span>{copied ? "Copiado!" : "Copiar"}</span>
                    </button>
                  </div>
                </div>

                <div className="pt-4 border-t border-white/10 space-y-3">
                  <a
                    href={`/reader/?token=${encodeURIComponent(pixData.accessToken || "")}`}
                    className="inline-flex items-center justify-center gap-2 w-full py-4 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold uppercase text-sm tracking-wider shadow-lg transition-all"
                  >
                    <span>JÁ FIZ O PAGAMENTO // ENTRAR NO LIVRO</span>
                    <ArrowRight className="w-4 h-4" />
                  </a>
                  <p className="text-[11px] text-slate-400">
                    O acesso também foi vinculado ao seu e-mail ({email}).
                  </p>
                </div>
              </div>
            ) : (
              /* FORMULÁRIO DE CHECKOUT */
              <form onSubmit={handleSubmit} className="space-y-5">
                {error && (
                  <div className="p-3.5 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
                    <span>⚠️</span>
                    <span>{error}</span>
                  </div>
                )}

                {/* Seleção do Método: PIX ou Cartão */}
                <div className="flex gap-3 p-1.5 rounded-2xl bg-[#15213b] border border-slate-700">
                  <button
                    type="button"
                    onClick={() => setMethod("pix")}
                    className={`flex-1 py-3 px-4 rounded-xl font-bold text-xs uppercase flex items-center justify-center gap-2 transition-all cursor-pointer ${
                      method === "pix"
                        ? "bg-emerald-500 text-slate-950 shadow-md font-extrabold"
                        : "text-slate-400 hover:text-white"
                    }`}
                  >
                    <QrCode className="w-4 h-4" />
                    <span>⚡ PIX (Imediato)</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setMethod("card")}
                    className={`flex-1 py-3 px-4 rounded-xl font-bold text-xs uppercase flex items-center justify-center gap-2 transition-all cursor-pointer ${
                      method === "card"
                        ? "bg-sky-500 text-slate-950 shadow-md font-extrabold"
                        : "text-slate-400 hover:text-white"
                    }`}
                  >
                    <CreditCard className="w-4 h-4" />
                    <span>💳 Cartão (até 3x R$ 9,96)</span>
                  </button>
                </div>

                {/* Dados Pessoais do Comprador */}
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                      Nome Completo
                    </label>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Seu nome"
                      className="w-full px-4 py-3 bg-[#15213b] border border-slate-700 focus:border-gold rounded-xl text-white text-sm focus:outline-none transition-all placeholder:text-slate-500"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                        Seu Melhor E-mail
                      </label>
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Para envio do acesso"
                        className="w-full px-4 py-3 bg-[#15213b] border border-slate-700 focus:border-gold rounded-xl text-white text-sm focus:outline-none transition-all placeholder:text-slate-500"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                        WhatsApp / Celular
                      </label>
                      <input
                        type="tel"
                        inputMode="numeric"
                        value={phone}
                        onChange={handlePhoneChange}
                        placeholder="(00) 00000-0000"
                        className="w-full px-4 py-3 bg-[#15213b] border border-slate-700 focus:border-gold rounded-xl text-white text-sm focus:outline-none transition-all placeholder:text-slate-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                      CPF do Titular <span className="text-[10px] text-cyan normal-case font-normal">(Exigência do Banco Central para emissão segura)</span>
                    </label>
                    <input
                      type="tel"
                      inputMode="numeric"
                      required
                      value={cpf}
                      onChange={handleCpfChange}
                      placeholder="000.000.000-00"
                      className="w-full px-4 py-3 bg-[#15213b] border border-slate-700 focus:border-gold rounded-xl text-white text-sm focus:outline-none transition-all placeholder:text-slate-500"
                    />
                  </div>
                </div>

                {/* Campos Específicos de Cartão */}
                {method === "card" && (
                  <div className="space-y-4 pt-3 border-t border-slate-800">
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                        Número do Cartão
                      </label>
                      <input
                        type="tel"
                        inputMode="numeric"
                        required
                        value={cardNumber}
                        onChange={handleCardNumberChange}
                        placeholder="0000 0000 0000 0000"
                        className="w-full px-4 py-3 bg-[#15213b] border border-slate-700 focus:border-sky-400 rounded-xl text-white text-sm focus:outline-none transition-all placeholder:text-slate-500"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                        Nome Impresso no Cartão
                      </label>
                      <input
                        type="text"
                        required
                        value={cardHolder}
                        onChange={(e) => setCardHolder(e.target.value.toUpperCase())}
                        placeholder="COMO ESTÁ NO CARTÃO"
                        className="w-full px-4 py-3 bg-[#15213b] border border-slate-700 focus:border-sky-400 rounded-xl text-white text-sm focus:outline-none transition-all placeholder:text-slate-500 uppercase"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                          Validade
                        </label>
                        <input
                          type="tel"
                          inputMode="numeric"
                          required
                          value={cardExpiry}
                          onChange={handleExpiryChange}
                          placeholder="MM/AA"
                          className="w-full px-4 py-3 bg-[#15213b] border border-slate-700 focus:border-sky-400 rounded-xl text-white text-sm focus:outline-none transition-all placeholder:text-slate-500 text-center"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                          CVV
                        </label>
                        <input
                          type="tel"
                          inputMode="numeric"
                          required
                          maxLength={4}
                          value={cardCvv}
                          onChange={(e) => setCardCvv(e.target.value.replace(/\D/g, ""))}
                          placeholder="123"
                          className="w-full px-4 py-3 bg-[#15213b] border border-slate-700 focus:border-sky-400 rounded-xl text-white text-sm focus:outline-none transition-all placeholder:text-slate-500 text-center"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                        Parcelamento
                      </label>
                      <select
                        value={installments}
                        onChange={(e) => setInstallments(e.target.value)}
                        className="w-full px-4 py-3 bg-[#15213b] border border-slate-700 focus:border-sky-400 rounded-xl text-white text-sm focus:outline-none transition-all cursor-pointer"
                      >
                        <option value="1">1x de R$ 29,90 (à vista)</option>
                        <option value="2">2x de R$ 14,95</option>
                        <option value="3">3x de R$ 9,96 (sem juros)</option>
                      </select>
                    </div>
                  </div>
                )}

                {/* Botão de Pagamento */}
                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={loading}
                    className={`relative overflow-hidden w-full py-4.5 px-6 rounded-2xl font-black text-sm sm:text-base tracking-wider uppercase text-slate-950 shadow-xl transition-all duration-300 flex items-center justify-center gap-2 group cursor-pointer disabled:opacity-75 disabled:cursor-not-allowed ${
                      method === "pix"
                        ? "bg-gradient-to-r from-emerald-400 via-teal-300 to-emerald-400 hover:brightness-110 shadow-emerald-500/25"
                        : "bg-gradient-to-r from-[#c9a962] via-[#e5c985] to-[#c9a962] hover:brightness-110 shadow-gold/25"
                    }`}
                  >
                    <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/40 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out pointer-events-none" />
                    {loading ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin text-slate-950" />
                        <span>PROCESSANDO COM SEGURANÇA...</span>
                      </>
                    ) : (
                      <>
                        <span>
                          {method === "pix"
                            ? "GERAR CÓDIGO PIX (R$ 29,90)"
                            : `PAGAR COM CARTÃO (${installments}x DE R$ ${(29.9 / parseInt(installments)).toFixed(2).replace(".", ",")})`}
                        </span>
                        <ArrowRight className="w-5 h-5 text-slate-950 group-hover:translate-x-1.5 transition-transform" />
                      </>
                    )}
                  </button>
                </div>
              </form>
            )}

          </div>

        </div>

      </div>
    </section>
  );
};
