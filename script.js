// Cole aqui o link do Google Apps Script (veja as instruções). Vazio = salva só neste aparelho.
var SHEET_URL="";
var KEY="chk-injetoras",$=function(i){return document.getElementById(i)},isOk=false;
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
  var r={data:new Date().toLocaleDateString("pt-BR"),horario:$("hora").value,injetora:+sel.value,turno:$("turno").value,funcao:$("func").value,matricula:$("mat").value.trim(),nome:$("nome").value.trim(),obs:$("obs").value.trim()};
  var a=load();a.push(r);save(a);
  if(SHEET_URL){try{fetch(SHEET_URL,{method:"POST",mode:"no-cors",headers:{"Content-Type":"text/plain"},body:JSON.stringify(r)})}catch(e){}}
  isOk=false;$("ok").className="okbox";$("ok").firstChild.textContent="";$("obs").value="";$("hora").value=agora();check();
  $("msg").textContent="Registrado: injetora "+r.injetora+", "+r.turno+", "+r.horario+".";
};
function show(n){$("v1").className=n==1?"":"hide";$("v2").className=n==2?"":"hide";$("n1").className=n==1?"on":"";$("n2").className=n==2?"on":"";if(n==2)panel()}
$("n1").onclick=function(){show(1)};$("n2").onclick=function(){show(2)};
function panel(){
  var hoje=new Date().toLocaleDateString("pt-BR"),m={},L={"Líder/Operador":"L","Inspetor":"I","Processo":"P"};
  load().forEach(function(r){if(r.data===hoje)m[r.injetora+"|"+r.turno+"|"+L[r.funcao]]=1});
  var h="";
  for(var i=1;i<=21;i++){h+="<tr><td>"+i+"</td>";
    ["1º turno","2º turno","3º turno"].forEach(function(t){h+="<td>"+["L","I","P"].map(function(f){return '<span class="tag'+(m[i+"|"+t+"|"+f]?" on":"")+'">'+f+"</span>"}).join("")+"</td>"});
    h+="</tr>"}
  $("tb").innerHTML=h;
}
$("csv").onclick=function(){
  var l=["data;horario;injetora;turno;funcao;matricula;nome;obs"].concat(load().map(function(r){return[r.data,r.horario,r.injetora,r.turno,r.funcao,r.matricula,r.nome,r.obs].join(";")}));
  var u=URL.createObjectURL(new Blob(["\ufeff"+l.join("\n")],{type:"text/csv"})),x=document.createElement("a");x.href=u;x.download="registros.csv";x.click();
};
