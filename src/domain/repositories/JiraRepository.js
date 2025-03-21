import { fetchTicketDetails } from "../../infrastructure/services/jira/jiraService.js";
import axios from "axios";

export class JiraRepository {
    static async getJiraTicket(ticketId) {
        return await fetchTicketDetails(ticketId);
    }

    static async getSprintData(sprintId) {
        const url = `${process.env.JIRA_AGILE_BASE_URL}/sprint/${sprintId}`;
        const auth = { username: process.env.JIRA_USER.trim(), password: process.env.JIRA_TOKEN.trim() };

        try {
            const response = await axios.get(url, { auth });
            if (response.status === 404) {
                throw new Error(`Sprint with ID ${sprintId} not found.`);
            }
            return response.data; // Certifique-se de que 'aggregateprogress' está incluído
        } catch (error) {
            throw new Error(`Failed to fetch sprint data: ${error.response?.data?.errorMessages || error.message}`);
        }
    }

    static async getSprintIssues(sprintId) {
        const url = `${process.env.JIRA_AGILE_BASE_URL}/sprint/${sprintId}/issue`;
        const auth = { username: process.env.JIRA_USER.trim(), password: process.env.JIRA_TOKEN.trim() };

        try {
            const response = await axios.get(url, { auth });
            if (response.status === 404) {
                throw new Error(`Issues for Sprint ID ${sprintId} not found.`);
            }
            return response.data.issues;
        } catch (error) {
            throw new Error(`Failed to fetch sprint issues: ${error.response?.data?.errorMessages || error.message}`);
        }
    }

    static async getSprintsForBoard(boardId) {
        const url = `${process.env.JIRA_AGILE_BASE_URL}/board/${boardId}/sprint`;
        const auth = { username: process.env.JIRA_USER.trim(), password: process.env.JIRA_TOKEN.trim() };

        try {
            const response = await axios.get(url, { auth });
            return response.data.values;
        } catch (error) {
            throw new Error(`Failed to fetch sprints for board: ${error.response?.data?.errorMessages || error.message}`);
        }
    }

    static async getBoardDetails(boardId) {
        const url = `${process.env.JIRA_AGILE_BASE_URL}/board/${boardId}`;
        const auth = { username: process.env.JIRA_USER.trim(), password: process.env.JIRA_TOKEN.trim() };

        try {
            const response = await axios.get(url, { auth });
            return response.data; // Retorna os detalhes do board, incluindo o nome
        } catch (error) {
            throw new Error(`Failed to fetch board details for ID ${boardId}: ${error.response?.data?.errorMessages || error.message}`);
        }
    }

    static async getTasksBySprint(sprintName) {
        const url = `${process.env.JIRA_BASE_URL}/rest/api/3/search`;
        const auth = { username: process.env.JIRA_USER.trim(), password: process.env.JIRA_TOKEN.trim() };

        try {
            const jql = `sprint = "${sprintName}" AND statusCategory != Done ORDER BY priority DESC`;
            const response = await axios.get(url, {
                auth,
                params: { jql, fields: "key,summary,description" },
            });

            return response.data.issues.map(issue => ({
                key: issue.key,
                summary: issue.fields.summary,
                description: issue.fields.description?.content
                    ?.map(block => block.content?.map(text => text.text).join(" "))
                    .join("\n") || "Sem descrição.",
            }));
        } catch (error) {
            throw new Error(`Failed to fetch tasks for sprint "${sprintName}": ${error.message}`);
        }
    }
}