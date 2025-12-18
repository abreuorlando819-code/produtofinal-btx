/* ========= BTX DOCS SAÚDE 1.0 (PWA) =========
   - Login por código: BTX/0007
   - Um PDF por vez (documento atual)
   - Layout clínico oficial (BTX)
   - Receita: guiada + livre
   - Ficha clínica completa
================================================ */

const ACCESS_CODE = "BTX/0007";
const LS_OK = "btx_ok_v1";
const LS_ACTIVE_DOC = "btx_active_doc_v1";

const $ = (q) => document.querySelector(q);

const state = {
  active: "receita",
};

boot();

function boot(){
  // bind login
  $("#btnEntrar").addEventListener("click", onLogin);
  $("#codigo").addEventListener("keydown", (e)=>{ if(e.key==="Enter") onLogin(); });

  // bind menu
  document.querySelectorAll(".menu-btn").forEach(btn=>{
    btn.addEventListener("click", ()=>{
      const doc = btn.getAttribute("data-doc");
      setActiveDoc(doc);
    });
  });

  // sair
  $("#btnSair").addEventListener("click", ()=>{
    localStorage.removeItem(LS_OK);
    location.reload();
  });

  // pdf
  $("#btnGerarPdf").addEventListener("click", gerarPDF);

  // restore login state
  if(localStorage.getItem(LS_OK)==="1"){
    showApp();
  } else {
    showLogin();
  }

  // restore active doc
  const saved = localStorage.getItem(LS_ACTIVE_DOC);
  if(saved) state.active = saved;

  render();
}

function showLogin(){
  $("#login").classList.remove("hidden");
  $("#app").classList.add("hidden");
}

function showApp(){
  $("#login").classList.add("hidden");
  $("#app").classList.remove("hidden");
}

function onLogin(){
  const code = ($("#codigo").value || "").trim();
  if(code !== ACCESS_CODE){
    alert("Código inválido.");
    return;
  }
  localStorage.setItem(LS_OK, "1");
  showApp();
  render();
}

function setActiveDoc(doc){
  state.active = doc;
  localStorage.setItem(LS_ACTIVE_DOC, doc);
  render();
}

function todayBR(){
  const d = new Date();
  const dd = String(d.getDate()).padStart(2,"0");
  const mm = String(d.getMonth()+1).padStart(2,"0");
  const yy = d.getFullYear();
  return `${dd}/${mm}/${yy}`;
}

function esc(s){
  return String(s ?? "").replace(/[&<>"']/g, (m)=>({
    "&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"
  }[m]));
}

/* --------- Templates --------- */

function shell({title, metaRight, bodyHtml}){
  return `
    <div class="doc-header">
      <div class="doc-brand">
        <div>
          <div class="doc-btx">BTX</div>
          <div class="doc-name">Docs Saúde</div>
        </div>
      </div>
      <div class="doc-title">
        <h2>${esc(title)}</h2>
        <div class="meta">${esc(metaRight)}</div>
      </div>
    </div>
    <div class="doc-body">
      ${bodyHtml}
    </div>
    <div class="doc-footer">
      <div class="sig">
        <div class="line"></div>
        <div class="cap">Assinatura do profissional</div>
      </div>
      <div class="footer-right">
        Data: <strong>${todayBR()}</strong><br/>
        Documento gerado no BTX Docs Saúde
      </div>
    </div>
  `;
}

function docReceita(){
  const body = `
    <div class="grid">
      <div class="field">
        <span class="k">Paciente</span>
        <input class="v" id="rx_paciente" placeholder="Nome completo" />
      </div>
      <div class="field">
        <span class="k">Documento / Prontuário</span>
        <input class="v" id="rx_doc" placeholder="Opcional" />
      </div>
    </div>

    <div class="field">
      <span class="k">Prescrição (atalhos)</span>
      <div class="presc-bar">
        <button class="pill" type="button" data-med="Dipirona 500 mg — 1 comprimido VO a cada 6/6h se dor/ febre.">Dipirona</button>
        <button class="pill" type="button" data-med="Paracetamol 750 mg — 1 comprimido VO a cada 8/8h se dor/ febre.">Paracetamol</button>
        <button class="pill" type="button" data-med="Ibuprofeno 600 mg — 1 comprimido VO a cada 8/8h por 3 dias, após refeição.">Ibuprofeno</button>
        <button class="pill" type="button" data-med="Nimesulida 100 mg — 1 comprimido VO a cada 12/12h por 3 dias, após refeição.">Nimesulida</button>
        <button class="pill" type="button" data-med="Amoxicilina 500 mg — 1 cápsula VO a cada 8/8h por 7 dias.">Amoxicilina</button>
        <button class="pill" type="button" data-med="Amoxicilina + Clavulanato 875/125 mg — 1 comprimido VO a cada 12/12h por 7 dias.">Amox+Clav</button>
      </div>
    </div>

    <div class="field">
      <span class="k">Prescrição (campo livre)</span>
      <textarea class="v" id="rx_texto" placeholder="Escreva a prescrição completa aqui. Você também pode clicar nos atalhos acima."></textarea>
    </div>

    <div class="field">
      <span class="k">Observações</span>
      <textarea class="v" id="rx_obs" placeholder="Orientações, retorno, alertas, etc."></textarea>
    </div>
  `;
  return shell({title:"Receituário", metaRight:"Uso profissional", bodyHtml: body});
}

function docLaudo(){
  const body = `
    <div class="grid">
      <div class="field">
        <span class="k">Paciente</span>
        <input class="v" id="ld_paciente" placeholder="Nome completo" />
      </div>
      <div class="field">
        <span class="k">Identificação</span>
        <input class="v" id="ld_id" placeholder="CPF/Prontuário (opcional)" />
      </div>
    </div>

    <div class="field">
      <span class="k">Solicitante / Encaminhamento</span>
      <input class="v" id="ld_solic" placeholder="Opcional" />
    </div>

    <div class="field">
      <span class="k">Descrição / Achados</span>
      <textarea class="v" id="ld_texto" placeholder="Descreva o laudo de forma objetiva e completa."></textarea>
    </div>

    <div class="field">
      <span class="k">Conclusão</span>
      <textarea class="v" id="ld_conc" placeholder="Conclusão do laudo."></textarea>
    </div>
  `;
  return shell({title:"Laudo", metaRight:"Documento clínico", bodyHtml: body});
}

function docAtestado(){
  const body = `
    <div class="grid">
      <div class="field">
        <span class="k">Paciente</span>
        <input class="v" id="at_paciente" placeholder="Nome completo" />
      </div>
      <div class="field">
        <span class="k">CID (opcional)</span>
        <input class="v" id="at_cid" placeholder="Ex.: J06.9" />
      </div>
    </div>

    <div class="field">
      <span class="k">Texto do atestado</span>
      <textarea class="v" id="at_texto" placeholder="Atesto para os devidos fins que..."></textarea>
    </div>

    <div class="grid">
      <div class="field">
        <span class="k">Período (dias)</span>
        <input class="v" id="at_dias" inputmode="numeric" placeholder="Ex.: 2" />
      </div>
      <div class="field">
        <span class="k">Data de início (opcional)</span>
        <input class="v" id="at_ini" placeholder="Ex.: ${todayBR()}" />
      </div>
    </div>
  `;
  return shell({title:"Atestado", metaRight:"Uso profissional", bodyHtml: body});
}

function docRecibo(){
  const body = `
    <div class="grid">
      <div class="field">
        <span class="k">Recebido de</span>
        <input class="v" id="rc_de" placeholder="Nome do paciente/cliente" />
      </div>
      <div class="field">
        <span class="k">Valor (R$)</span>
        <input class="v" id="rc_valor" inputmode="decimal" placeholder="Ex.: 150,00" />
      </div>
    </div>

    <div class="field">
      <span class="k">Referente a</span>
      <input class="v" id="rc_ref" placeholder="Ex.: Consulta / Procedimento / Avaliação" />
    </div>

    <div class="field">
      <span class="k">Observações</span>
      <textarea class="v" id="rc_obs" placeholder="Detalhes adicionais (opcional)."></textarea>
    </div>
  `;
  return shell({title:"Recibo", metaRight:"Comprovante", bodyHtml: body});
}

function docFicha(){
  const body = `
    <div class="grid">
      <div class="field">
        <span class="k">Nome completo</span>
        <input class="v" id="fc_nome" placeholder="Paciente" />
      </div>
      <div class="field">
        <span class="k">Data de nascimento</span>
        <input class="v" id="fc_nasc" placeholder="dd/mm/aaaa" />
      </div>

      <div class="field">
        <span class="k">CPF (opcional)</span>
        <input class="v" id="fc_cpf" placeholder="Somente números" />
      </div>
      <div class="field">
        <span class="k">Telefone</span>
        <input class="v" id="fc_tel" placeholder="(xx) xxxxx-xxxx" />
      </div>

      <div class="field">
        <span class="k">Endereço</span>
        <input class="v" id="fc_end" placeholder="Rua, número, bairro, cidade" />
      </div>
      <div class="field">
        <span class="k">Responsável (se aplicável)</span>
        <input class="v" id="fc_resp" placeholder="Nome / contato" />
      </div>
    </div>

    <div class="field">
      <span class="k">Queixa principal</span>
      <textarea class="v" id="fc_qp" placeholder="Relato principal do paciente."></textarea>
    </div>

    <div class="field">
      <span class="k">História da doença atual</span>
      <textarea class="v" id="fc_hda" placeholder="Início, evolução, fatores, sintomas associados."></textarea>
    </div>

    <div class="grid">
      <div class="field">
        <span class="k">Antecedentes pessoais</span>
        <textarea class="v" id="fc_ap" placeholder="Comorbidades, cirurgias, alergias."></textarea>
      </div>
      <div class="field">
        <span class="k">Medicações em uso</span>
        <textarea class="v" id="fc_med" placeholder="Nome, dose, frequência."></textarea>
      </div>
    </div>

    <div class="grid">
      <div class="field">
        <span class="k">Hábitos</span>
        <textarea class="v" id="fc_hab" placeholder="Tabagismo, etilismo, atividade física, etc."></textarea>
      </div>
      <div class="field">
        <span class="k">História familiar</span>
        <textarea class="v" id="fc_hf" placeholder="Doenças na família, risco cardiovascular, etc."></textarea>
      </div>
    </div>

    <div class="field">
      <span class="k">Exame físico / Sinais vitais</span>
      <textarea class="v" id="fc_ef" placeholder="PA, FC, FR, SatO2, temperatura, geral e segmentar."></textarea>
    </div>

    <div class="grid">
      <div class="field">
        <span class="k">Hipóteses diagnósticas</span>
        <textarea class="v" id="fc_hd" placeholder="Hipóteses e justificativa."></textarea>
      </div>
      <div class="field">
        <span class="k">Conduta / Plano</span>
        <textarea class="v" id="fc_plan" placeholder="Solicitações, condutas, medicações, retorno."></textarea>
      </div>
    </div>

    <div class="field">
      <span class="k">Observações finais</span>
      <textarea class="v" id="fc_obs" placeholder="Qualquer observação relevante."></textarea>
    </div>
  `;
  return shell({title:"Ficha Clínica", metaRight:"Registro clínico", bodyHtml: body});
}

/* --------- Render / Actions --------- */

function render(){
  const root = $("#pdfRoot");
  if(!root) return;

  const doc = state.active;
  let html = "";
  switch(doc){
    case "receita": html = docReceita(); break;
    case "laudo": html = docLaudo(); break;
    case "atestado": html = docAtestado(); break;
    case "recibo": html = docRecibo(); break;
    case "ficha": html = docFicha(); break;
    default: html = docReceita();
  }
  root.innerHTML = html;

  // bind prescription pills
  if(doc==="receita"){
    root.querySelectorAll(".pill").forEach(p=>{
      p.addEventListener("click", ()=>{
        const t = p.getAttribute("data-med");
        const ta = $("#rx_texto");
        ta.value = (ta.value ? ta.value.trimEnd()+"\n" : "") + t;
      });
    });
  }
}

function fileNameForDoc(){
  const map = {
    receita: "BTX-Receita.pdf",
    laudo: "BTX-Laudo.pdf",
    atestado: "BTX-Atestado.pdf",
    recibo: "BTX-Recibo.pdf",
    ficha: "BTX-Ficha-Clinica.pdf",
  };
  return map[state.active] || "BTX-Documento.pdf";
}

function gerarPDF(){
  const el = $("#pdfRoot");
  if(!el) return;

  const opt = {
    margin: [12, 12, 12, 12],
    filename: fileNameForDoc(),
    image: { type: "jpeg", quality: 0.98 },
    html2canvas: { scale: 2, useCORS: true, backgroundColor: "#ffffff" },
    jsPDF: { unit: "mm", format: "a4", orientation: "portrait" }
  };

  // Gera 1 PDF por vez: o documento atual
  html2pdf().set(opt).from(el).save();
}
