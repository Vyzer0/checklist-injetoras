var SHEET_URL="https://script.google.com/macros/s/AKfycbyoEVcsxkF5FmZPry_LFpemC4fmqkawokJxg0CyZZX2G1mV3MRQpR0DZXuAVsj-PlKs/exechttps://script.google.com/macros/s/AKfycbyoEVcsxkF5FmZPry_LFpemC4fmqkawokJxg0CyZZX2G1mV3MRQpR0DZXuAVsj-PlKs/exec";
var KEY="chk-injetoras",$=function(i){return document.getElementById(i)},isOk=false;
var TURNOS=["1º turno","2º turno","3º turno"],VERIFS=["1ª verificação","2ª verificação"];
function load(){try{return JSON.parse(localStorage.getItem(KEY))||[]}catch(e){return[]}}
function save(a){try{localStorage.setItem(KEY,JSON.stringify(a))}catch(e){}}
var sel=$("inj");for(var i=1;i<=21;i++){var o=document.createElement("option");o.value=i;o.textContent="Injetora "+i;sel.appendChild(o)}
var q=new URLSearchParams(location.search).get("inj");if(q&&q>=1&&q<=21)sel.value=q;
$("sub").textContent=SHEET_URL?"Os registros vão para a planilha":"Protótipo · os dados ficam só neste aparelho";
function agora(){var d=new Date();return ("0"+d.getHours()).slice(-2)+":"+("0"+d.getMinutes()).slice(-2)}
$("hora").value=agora();
function check(){$("send").disabled=!(isOk&&$("mat").value.trim()&&$("hora").value)}
$("ok").onclick=function(){isOk=!isOk;this.className="okbox"+(isOk?" on":"");this.firstChild.textContent=isOk?"✓":"";check()};
["mat","hora"].forEach(function(i){$(i).addEventListener("input",check)});
$("send").onclick=function(){
  var r={data:new Date().toLocaleDateString("pt-BR"),horario:$("hora").value,injetora:+sel.value,turno:$("turno").value,funcao:$("func").value,matricula:$("mat").value.trim(),nome:$("nome").value.trim(),verificacao:$("verif").value,obs:$("obs").value.trim()};
  var a=load();a.push(r);save(a);
  var resumo="injetora "+r.injetora+", "+r.turno+", "+r.verificacao+", "+r.horario;
  isOk=false;$("ok").className="okbox";$("ok").firstChild.textContent="";$("obs").value="";$("hora").value=agora();check();
  if(!SHEET_URL){$("msg").textContent="Salvo neste aparelho: "+resumo+".";return}
  $("msg").textContent="Enviando…";
  fetch(SHEET_URL,{method:"POST",headers:{"Content-Type":"text/plain;charset=utf-8"},body:JSON.stringify(r)})
    .then(function(x){return x.text()})
    .then(function(t){$("msg").textContent=t.trim()==="ok"?"Registrado na planilha: "+resumo+".":"O script respondeu algo inesperado: "+t.slice(0,80)})
    .catch(function(e){$("msg").textContent="Salvo no aparelho, mas não consegui confirmar o envio à planilha. Confira o link e a implantação."});
};
function show(n){$("v1").className=n==1?"":"hide";$("v2").className=n==2?"":"hide";$("n1").className=n==1?"on":"";$("n2").className=n==2?"on":"";if(n==2)panel()}
$("n1").onclick=function(){show(1)};$("n2").onclick=function(){show(2)};
function panel(){
  var hoje=new Date().toLocaleDateString("pt-BR"),c={};
  load().forEach(function(r){if(r.data===hoje){var k=r.injetora+"|"+r.turno+"|"+r.verificacao;c[k]=c[k]||{};c[k][r.funcao]=1}});
  var h="";
  for(var i=1;i<=21;i++){h+="<tr><td>"+i+"</td>";
    TURNOS.forEach(function(t){h+="<td>"+VERIFS.map(function(v){var n=Object.keys(c[i+"|"+t+"|"+v]||{}).length;return '<span class="tag'+(n==4?" on":"")+'">'+v.charAt(0)+"ª "+n+"/4</span>"}).join("<br>")+"</td>"});
    h+="</tr>"}
  $("tb").innerHTML=h;
}
$("csv").onclick=function(){
  var l=["data;horario;injetora;turno;funcao;matricula;nome;verificacao;obs"].concat(load().map(function(r){return[r.data,r.horario,r.injetora,r.turno,r.funcao,r.matricula,r.nome,r.verificacao,r.obs].join(";")}));
  var u=URL.createObjectURL(new Blob(["\ufeff"+l.join("\n")],{type:"text/csv"})),x=document.createElement("a");x.href=u;x.download="registros.csv";x.click();
};
