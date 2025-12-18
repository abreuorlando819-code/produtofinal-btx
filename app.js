const ACCESS_CODE = "BTX/0007";
const LS_OK = "btx_ok_v2";
const LS_ACTIVE_DOC = "btx_active_doc_v2";

const $ = (q) => document.querySelector(q);

const state = { active: "receita" };

// ---- UTIL ----
function normCode(s){
  // remove espaços e normaliza
  return String(s || "")
    .trim()
    .toUpperCase()
    .replace(/\s+/g, "");
}

function todayBR(){
  const d = new Date();
  const dd = String(d.getDate()).padStart(2,"0");
  const mm = String(d.getMonth()+1).padStart(2,"0");
  const yy = d.getFullYear();
  return `${dd}/${mm}/${yy}`;
}

function showLogin(){
  $("#login").classList.remove("hidden");
  $("#app").classList.add("hidden");
}
function showApp(){
  $("#login").classList.add("hidden");
  $("#app").classList.remove("hidden");
}

// ---- LOGIN (funções globais para o onclick) ----
window.BTX_login = function(){
  const code = normCode($("#codigo").value);
  if(code !== normCode(ACCESS_CODE)){
    alert("Código inválido. Use BTX/0007");
    return;
  }
  localStorage.setItem(LS_OK, "1");
  showApp();
  render();
};

window.BTX_sair = function(){
  localStorage.removeItem(LS_OK);
  // opcional: limpar doc ativo
  // localStorage.removeItem(LS_ACTIVE_DOC);
  location.reload();
};

// ---- DOCS ----
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
        <h2>${title}</h2>
        <div class="meta">${metaRight}</div>
      </div>
    </div>
    <div class="doc-body">${bodyHtml}</div>
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
        <button class="pill" type="button" data-med="Dipirona 500 mg — 1 cp VO 6/6h se dor/febre.">Dipirona</button>
        <button class="pill" type="button" data-med="Paracetamol 750 mg — 1 cp VO 8/8h se dor/febre.">Paracetamol</button>
        <button class="pill" type="button" data-med="Ibuprofeno 600 mg — 1 cp VO 8/8h por 3 dias, após refeição.">Ibuprofeno</button>
        <button class="pill" type="button" data-med="Amoxicilina 500 mg — 1 cápsula VO 8/8h por 7 dias.">Amoxicilina</button>
      </div>
    </div>

    <div class="field">
      <span class="k">Prescrição (campo livre)</span>
      <textarea class="v" id="rx_texto" placeholder="Escreva aqui ou use os atalhos."></textarea>
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
      <div class="field"><span class="k">Paciente</span><input class="v" id="ld_paciente" /></div>
      <div class="field"><span class="k">Identificação</span><input class="v" id="ld_id" /></div>
    </div>
    <div class="field"><span class="k">Descrição / Achados</span><textarea class="v" id="ld_texto"></textarea></div>
    <div class="field"><span class="k">Conclusão</span><textarea class="v" id="ld_conc"></textarea></div>
  `;
  return shell({title:"Laudo", metaRight:"Documento clínico", bodyHtml: body});
}

function docAtestado(){
  const body = `
    <div class="grid">
      <div class="field"><span class="k">Paciente</span><input class="v" id="at_paciente" /></div>
      <div class="field"><span class="k">CID (opcional)</span><input class="v" id="at_cid" /></div>
    </div>
    <div class="field"><span class="k">Texto do atestado</span><textarea class="v" id="at_texto"></textarea></div>
    <div class="grid">
      <div class="field"><span class="k">Período (dias)</span><input class="v" id="at_dias" inputmode="numeric" /></div>
      <div class="field"><span class="k">Data de início (opcional)</span><input class="v" id="at_ini" placeholder="${todayBR()}" /></div>
    </div>
  `;
  return shell({title:"Atestado", metaRight:"Uso profissional", bodyHtml: body});
}

function docRecibo(){
  const body = `
    <div class="grid">
      <div class="field"><span class="k">Recebido de</span><input class="v" id="rc_de" /></div>
      <div class="field"><span class="k">Valor (R$)</span><input class="v" id="rc_valor" inputmode="decimal" /></div>
    </div>
    <div class="field"><span class="k">Referente a</span><input class="v" id="rc_ref" /></div>
    <div class="field"><span class="k">Observações</span><textarea class="v" id="rc_obs"></textarea></div>
  `;
  return shell({title:"Recibo", metaRight:"Comprovante", bodyHtml: body});
}

function docFicha(){
  const body = `
    <div class="grid">
      <div class="field"><span class="k">Nome completo</span><input class="v" id="fc_nome" /></div>
      <div class="field"><span class="k">Data de nascimento</span><input class="v" id="fc_nasc" placeholder="dd/mm/aaaa" /></div>
      <div class="field"><span class="k">CPF (opcional)</span><input class="v" id="fc_cpf" /></div>
      <div class="field"><span class="k">Telefone</span><input class="v" id="fc_tel" /></div>
      <div class="field"><span class="k">Endereço</span><input class="v" id="fc_end" /></div>
      <div class="field"><span class="k">Responsável (se aplicável)</span><input class="v" id="fc_resp" /></div>
    </div>

    <div class="field"><span class="k">Queixa principal</span><textarea class="v" id="fc_qp"></textarea></div>
    <div class="field"><span class="k">História da doença atual</span><textarea class="v" id="fc_hda"></textarea></div>

    <div class="grid">
      <div class="field"><span class="k">Antecedentes pessoais</span><textarea class="v" id="fc_ap"></textarea></div>
      <div class="field"><span class="k">Medicações em uso</span><textarea class="v" id="fc_med"></textarea></div>
    </div>

    <div class="grid">
      <div class="field"><span class="k">Hábitos</span><textarea class="v" id="fc_hab"></textarea></div>
      <div class="field"><span class="k">História familiar</span><textarea class="v" id="fc_hf"></textarea></div>
    </div>

    <div class="field"><span class="k">Exame físico / Sinais vitais</span><textarea class="v" id="fc_ef"></textarea></div>

    <div class="grid">
      <div class="field"><span class="k">Hipóteses diagnósticas</span><textarea class="v" id="fc_hd"></textarea></div>
      <div class="field"><span class="k">Conduta / Plano</span><textarea class="v" id="fc_plan"></textarea></div>
    </div>

    <div class="field"><span class="k">Observações finais</span><textarea class="v" id="fc_obs"></textarea></div>
  `;
  return shell({title:"Ficha Clínica", metaRight:"Registro clínico", bodyHtml: body});
}

function render(){
  const root = $("#pdfRoot");
  if(!root) return;

  let html = "";
  switch(state.active){
    case "receita": html = docReceita(); break;
    case "laudo": html = docLaudo(); break;
    case "atestado": html = docAtestado(); break;
    case "recibo": html = docRecibo(); break;
    case "ficha": html = docFicha(); break;
    default: html = docReceita();
  }
  root.innerHTML = html;

  // bind menu clicks
  document.querySelectorAll(".menu-btn").forEach(btn=>{
    btn.onclick = () => {
      state.active = btn.getAttribute("data-doc");
      localStorage.setItem(LS_ACTIVE_DOC, state.active);
      render();
    };
  });

  // bind pills
  if(state.active === "receita"){
    root.querySelectorAll(".pill").forEach(p=>{
      p.onclick = () => {
        const t = p.getAttribute("data-med") || "";
        const ta = $("#rx_texto");
        ta.value = (ta.value ? ta.value.trimEnd()+"\n" : "") + t;
      };
    });
  }
}

function fileNameForDoc(){
  return ({
    receita: "BTX-Receita.pdf",
    laudo: "BTX-Laudo.pdf",
    atestado: "BTX-Atestado.pdf",
    recibo: "BTX-Recibo.pdf",
    ficha: "BTX-Ficha-Clinica.pdf",
  })[state.active] || "BTX-Documento.pdf";
}

/* ========= CORREÇÃO DO PDF =========
   html2pdf/html2canvas não “enxerga” texto digitado em input/textarea.
   Solução: clonar o documento e substituir inputs/textarea por DIVs com o valor.
*/
function buildSnapshotForPdf(original){
  const clone = original.cloneNode(true);

  // inputs
  const inputsOrig = original.querySelectorAll("input");
  const inputsClone = clone.querySelectorAll("input");
  inputsOrig.forEach((inp, i)=>{
    const val = inp.value || "";
    const rep = document.createElement("div");
    rep.style.padding = "10px";
    rep.style.border = "1px solid rgba(0,0,0,.14)";
    rep.style.borderRadius = "14px";
    rep.style.minHeight = "20px";
    rep.textContent = val;
    inputsClone[i].replaceWith(rep);
  });

  // textareas
  const taOrig = original.querySelectorAll("textarea");
  const taClone = clone.querySelectorAll("textarea");
  taOrig.forEach((ta, i)=>{
    const val = ta.value || "";
    const rep = document.createElement("div");
    rep.style.padding = "10px";
    rep.style.border = "1px solid rgba(0,0,0,.14)";
    rep.style.borderRadius = "14px";
    rep.style.minHeight = "80px";
    rep.style.whiteSpace = "pre-wrap";
    rep.textContent = val;
    taClone[i].replaceWith(rep);
  });

  // botões dos atalhos (não precisa aparecer no PDF)
  clone.querySelectorAll(".presc-bar, .pill").forEach(el=>el.remove());

  return clone;
}

window.BTX_gerarPDF = function(){
  if(typeof html2pdf === "undefined"){
    alert("Biblioteca do PDF não carregou. Se estiver offline na 1ª vez, abra com internet 1 vez ou use a versão com html2pdf local.");
    return;
  }

  const original = $("#pdfRoot");
  const snapshot = buildSnapshotForPdf(original);

  // coloca o snapshot fora da tela só pra renderizar
  snapshot.style.position = "fixed";
  snapshot.style.left = "-99999px";
  snapshot.style.top = "0";
  snapshot.style.width = original.offsetWidth + "px";
  document.body.appendChild(snapshot);

  const opt = {
    margin: [12, 12, 12, 12],
    filename: fileNameForDoc(),
    image: { type: "jpeg", quality: 0.98 },
    html2canvas: { scale: 2, backgroundColor: "#ffffff", useCORS: true },
    jsPDF: { unit: "mm", format: "a4", orientation: "portrait" }
  };

  html2pdf().set(opt).from(snapshot).save().then(()=>{
    snapshot.remove();
  }).catch(()=>{
    snapshot.remove();
    alert("Falha ao gerar PDF. Tente novamente.");
  });
};

// ---- INIT ----
(function init(){
  // login state
  if(localStorage.getItem(LS_OK) === "1") showApp(); else showLogin();

  // doc state
  state.active = localStorage.getItem(LS_ACTIVE_DOC) || "receita";

  // enter key no login
  const codeInput = $("#codigo");
  if(codeInput){
    codeInput.addEventListener("keydown", (e)=>{ if(e.key==="Enter") window.BTX_login(); });
  }

  // render
  render();
})();
