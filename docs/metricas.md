Para obter os dados apresentados no **print** utilizando a API do Jira, você pode utilizar os seguintes **campos e endpoints**:

---

## **1️⃣ Progress (Progresso)**
**🔍 API:**  
```plaintext
GET /rest/api/3/search?jql=Sprint={sprintId}
```
📌 **Campos relevantes:**
- `"fields.aggregatetimespent"` → Tempo total gasto.
- `"fields.aggregatetimeoriginalestimate"` → Tempo estimado original.

📌 **Cálculo:**  
\[
\text{Progresso} = \left( \frac{\text{Tarefas Concluídas}}{\text{Total de Tarefas na Sprint}} \right) \times 100
\]

---

## **2️⃣ Average Cycle Time (Tempo Médio de Ciclo)**
**🔍 API:**  
```plaintext
GET /rest/api/3/search?jql=Sprint={sprintId} AND status=Done ORDER BY resolutionDate
```
📌 **Campos relevantes:**
- `"fields.created"` → Data de criação da issue.
- `"fields.resolutiondate"` → Data de resolução.

📌 **Cálculo:**  
\[
\text{Cycle Time} = \text{Média}(\text{resolutiondate} - \text{created})
\]

---

## **3️⃣ Scope Change (Mudança de Escopo)**
**🔍 API:**  
```plaintext
GET /rest/greenhopper/1.0/rapid/charts/scopechangeburndownchart?rapidViewId={boardId}&sprintId={sprintId}
```
📌 **Campos relevantes:**
- `"added"` → Tarefas adicionadas após o início da sprint.
- `"removed"` → Tarefas removidas.

📌 **Cálculo:**  
\[
\text{Scope Change} = \left( \frac{\text{added} - \text{removed}}{\text{Total Inicial}} \right) \times 100
\]

---

## **4️⃣ Reported Bugs (Bugs Reportados) & Resolved Bugs (Bugs Resolvidos)**
**🔍 API:**  
```plaintext
GET /rest/api/3/search?jql=Sprint={sprintId} AND issuetype=Bug
```
📌 **Campos relevantes:**
- `"fields.issuetype.name"` → Verifica se é um Bug.
- `"fields.status.name"` → Verifica se está **"Done"**.

📌 **Cálculo:**  
- **Bugs Reportados** = Total de **issues** do tipo **Bug**.  
- **Bugs Resolvidos** = Total de **Bugs com status "Done"**.

---

## **5️⃣ Completed Issues (Issues Concluídas) & Pending Issues (Pendentes)**
**🔍 API:**  
```plaintext
GET /rest/api/3/search?jql=Sprint={sprintId}
```
📌 **Campos relevantes:**
- `"fields.status.name"` → Verifica status (Done, In Progress, To Do).
- `"fields.resolution"` → Se for `null`, a issue ainda não foi resolvida.

📌 **Cálculo:**  
- **Completed Issues** = Total de tarefas com status **"Done"**.  
- **Pending Issues** = Total de tarefas **não concluídas**.

---

## **6️⃣ Total Story Points Delivered**
**🔍 API:**  
```plaintext
GET /rest/api/3/search?jql=Sprint={sprintId} AND status=Done
```
📌 **Campos relevantes:**
- `"fields.customfield_{storyPoints}"` → Campo customizado para **story points**.
- `"fields.status.name"` → Filtra apenas as issues com status **"Done"**.

📌 **Cálculo:**  
\[
\text{Total Story Points Delivered} = \sum_{\text{issues Done}} \text{story points}
\]

---

## **7️⃣ Sprint Metrics**
### **📊 Velocity (Velocidade)**
**🔍 API:**  
```plaintext
GET /rest/api/3/search?jql=Sprint={sprintId} AND status=Done
```
📌 **Campos relevantes:**
- `"fields.customfield_{storyPoints}"` → Soma dos story points concluídos.

📌 **Cálculo:**  
\[
\text{Velocity} = \sum_{\text{issues Done}} \text{story points}
\]

---

### **📊 Commitment Reliability (Confiabilidade de Comprometimento)**
**🔍 API:**  
```plaintext
GET /rest/agile/1.0/sprint/{sprintId}
```
📌 **Campos relevantes:**
- `"fields.customfield_{storyPoints}"` → Story Points comprometidos no início.

📌 **Cálculo:**  
\[
\text{Commitment Reliability} = \left( \frac{\text{Story Points Entregues}}{\text{Story Points Comprometidos}} \right) \times 100
\]

---

### **📊 Bug Ratio (Taxa de Bugs)**
**🔍 API:**  
```plaintext
GET /rest/api/3/search?jql=Sprint={sprintId}
```
📌 **Campos relevantes:**
- `"fields.issuetype.name"` → Verifica se é um Bug.

📌 **Cálculo:**  
\[
\text{Bug Ratio} = \left( \frac{\text{Total Bugs}}{\text{Total de Issues}} \right) \times 100
\]

---

### **📊 Tasks Without Estimates (Tarefas Sem Estimativas)**
**🔍 API:**  
```plaintext
GET /rest/api/3/search?jql=Sprint={sprintId} AND "Story Points" IS EMPTY
```
📌 **Campos relevantes:**
- `"fields.customfield_{storyPoints}"` → Verifica se há `null` ou está vazio.

📌 **Cálculo:**  
\[
\text{Tasks Without Estimates} = \text{Contagem de issues sem story points}
\]

---

## **📌 Resumo das APIs**
| **Métrica** | **API Jira** | **Campos Relevantes** |
|------------|-------------|----------------------|
| **Progress** | `/rest/api/3/search?jql=Sprint={sprintId}` | `aggregatetimespent`, `aggregatetimeoriginalestimate` |
| **Average Cycle Time** | `/rest/api/3/search?jql=Sprint={sprintId} AND status=Done` | `created`, `resolutiondate` |
| **Scope Change** | `/rest/greenhopper/1.0/rapid/charts/scopechangeburndownchart` | `added`, `removed` |
| **Reported Bugs & Resolved Bugs** | `/rest/api/3/search?jql=Sprint={sprintId} AND issuetype=Bug` | `issuetype.name`, `status.name` |
| **Completed & Pending Issues** | `/rest/api/3/search?jql=Sprint={sprintId}` | `status.name`, `resolution` |
| **Total Story Points Delivered** | `/rest/api/3/search?jql=Sprint={sprintId} AND status=Done` | `customfield_{storyPoints}` |
| **Velocity** | `/rest/api/3/search?jql=Sprint={sprintId} AND status=Done` | `customfield_{storyPoints}` |
| **Commitment Reliability** | `/rest/agile/1.0/sprint/{sprintId}` | `customfield_{storyPoints}` |
| **Bug Ratio** | `/rest/api/3/search?jql=Sprint={sprintId}` | `issuetype.name` |
| **Tasks Without Estimates** | `/rest/api/3/search?jql=Sprint={sprintId} AND "Story Points" IS EMPTY` | `customfield_{storyPoints}` |

---

### **🔍 Conclusão**
Com essas APIs do Jira, você consegue **extrair e calcular todas as métricas** mostradas no seu print. Se precisar de ajuda para montar um script em **Node.js, Python ou outra linguagem**, me avise! 🚀