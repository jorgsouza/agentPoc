import axios from "axios";
import dotenv from "dotenv";
import { makeApiRequest } from "../../apiUtils.js";
import dayjs from "dayjs"; // Biblioteca para manipulação de datas

dotenv.config(); // Carrega variáveis do .env

const JIRA_BASE_URL = process.env.JIRA_BASE_URL;
const JIRA_USER = process.env.JIRA_USER;
const JIRA_TOKEN = process.env.JIRA_TOKEN;

/**
 * Verifica se as credenciais do Jira estão configuradas corretamente.
 * @returns {boolean} true se as credenciais estiverem presentes, false caso contrário.
 */
function validarCredenciais() {
  if (!JIRA_USER || !JIRA_TOKEN) {
    console.error("❌ Credenciais do Jira não configuradas. Verifique seu arquivo .env.");
    return false;
  }
  return true;
}

/**
 * Busca detalhes de um ticket no Jira usando autenticação via API Token.
 * @param {string} ticketId
 * @returns {Promise<{ title: string, description: string } | null>}
 */
export async function fetchTicketDetails(ticketId) {
  if (!validarCredenciais()) return null;

  const url = `${JIRA_BASE_URL}/rest/api/3/issue/${ticketId}`;
  const auth = { username: JIRA_USER, password: JIRA_TOKEN };

  try {
    const ticket = await makeApiRequest(url, auth);
    const title = ticket.fields.summary;
    const description = ticket.fields.description?.content
      ?.map(block => block.content?.map(text => text.text).join(" "))
      .join("\n") || "Sem descrição."; // Fallback to "Sem descrição." if undefined

    return { title, description };
  } catch (error) {
    console.error("❌ Erro ao buscar o ticket:", error.message);
    return null;
  }
}

/**
 * Busca todas as tasks abertas atribuídas a um email específico.
 * @param {string} email - Email do colaborador.
 * @returns {Promise<Array<{ key: string, summary: string, description: string, startDate: string, endDate: string, daysOpen: number }>>}
 */
export async function buscarTasksPorEmail(email) {
  if (!validarCredenciais()) return [];

  const url = `${JIRA_BASE_URL}/rest/api/3/search`;
  const auth = { username: JIRA_USER, password: JIRA_TOKEN };

  try {
    const jql = `assignee = "${email}" AND statusCategory != Done ORDER BY priority DESC`;
    const response = await makeApiRequest(url, auth, {
      params: { jql, fields: "key,summary,description,created,resolutiondate" }, // Ensure "resolutiondate" is included
    });

    return response.issues.map((issue) => {
      const { startDate, daysOpen } = calcularTempoAberto(issue.fields.created);
      const endDate = issue.fields.resolutiondate
        ? dayjs(issue.fields.resolutiondate).format("DD/MM/YYYY")
        : "Em aberto"; // Fallback to "Em aberto" if unresolved
      return {
        key: issue.key,
        summary: issue.fields.summary,
        description: issue.fields.description?.content
          ?.map((block) => block.content?.map((text) => text.text).join(" "))
          .join("\n") || "Sem descrição.",
        startDate,
        endDate,
        daysOpen,
      };
    });
  } catch (error) {
    console.error("❌ Erro ao buscar tasks por email:", error.message);
    return [];
  }
}

/**
 * Formata a data e calcula o tempo em dias.
 * @param {string} createdDate - Data de criação no formato ISO.
 * @returns {{ startDate: string, daysOpen: number }}
 */
function calcularTempoAberto(createdDate) {
  const startDate = dayjs(createdDate).format("DD/MM/YYYY");
  const daysOpen = dayjs().diff(dayjs(createdDate), "day");
  return { startDate, daysOpen };
}

/**
 * Busca todas as tasks abertas em um sprint específico.
 * @param {string} sprintName - Nome do sprint.
 * @returns {Promise<Array<{ key: string, summary: string, description: string, assignee: string, startDate: string, endDate: string, daysOpen: number }>>}
 */
export async function buscarTasksPorSprint(sprintName) {
  if (!validarCredenciais()) return [];

  const url = `${JIRA_BASE_URL}/rest/api/3/search`;
  const auth = { username: JIRA_USER, password: JIRA_TOKEN };

  try {
    const jql = `sprint = "${sprintName}" AND statusCategory != Done ORDER BY priority DESC`;
    const response = await makeApiRequest(url, auth, {
      params: { jql, fields: "key,summary,description,assignee,created,resolutiondate" }, // Ensure "resolutiondate" is included
    });

    return response.issues.map((issue) => {
      const { startDate, daysOpen } = calcularTempoAberto(issue.fields.created);
      const endDate = issue.fields.resolutiondate
        ? dayjs(issue.fields.resolutiondate).format("DD/MM/YYYY")
        : "Em aberto"; // Fallback to "Em aberto" if unresolved
      return {
        key: issue.key,
        summary: issue.fields.summary,
        description: issue.fields.description?.content
          ?.map((block) => block.content?.map((text) => text.text).join(" "))
          .join("\n") || "Sem descrição.",
        assignee: issue.fields.assignee?.displayName || "Unassigned",
        startDate,
        endDate,
        daysOpen,
      };
    });
  } catch (error) {
    console.error("❌ Erro ao buscar tasks por sprint:", error.message);
    return [];
  }
}
