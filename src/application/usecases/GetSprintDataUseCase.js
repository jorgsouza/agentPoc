import { JiraRepository } from "../../domain/repositories/JiraRepository.js";

export class GetSprintDataUseCase {
  static async execute(boardIds, sprintName) {
    try {
      // Suporte para múltiplos boardIds
      const boardIdList = boardIds.split(",").map(id => id.trim());
      let sprints = [];

      // Buscar sprints de todos os boards
      for (const boardId of boardIdList) {
        const boardSprints = await JiraRepository.getSprintsForBoard(boardId);
        sprints = sprints.concat(boardSprints);
      }

      if (!sprints || sprints.length === 0) {
        throw new Error("No sprints found for the boards.");
      }

      // Encontrar a sprint pelo nome
      const sprint = sprints.find(s => s.name.trim().toLowerCase() === sprintName.trim().toLowerCase());
      if (!sprint) {
        throw new Error(`Sprint "${sprintName}" not found for the boards.`);
      }

      // Buscar dados da sprint e issues
      const sprintData = await JiraRepository.getSprintData(sprint.id);
      const sprintIssues = await JiraRepository.getSprintIssues(sprint.id);

      if (!sprintData || !sprintIssues) {
        throw new Error("Sprint data or issues could not be retrieved.");
      }

      const completedIssues = sprintIssues.filter(issue => issue.fields.status.name === "Done");
      const pendingIssues = sprintIssues.filter(issue => issue.fields.status.name !== "Done");
      const bugs = sprintIssues.filter(issue => issue.fields.issuetype.name === "Bug");

      // Buscar story points (caso o campo seja diferente no Jira)
      const possibleStoryPointFields = Object.keys(sprintIssues[0]?.fields || {}).filter(
        key => key.toLowerCase().includes("story") || key.toLowerCase().includes("point")
      );
      const storyPointsField = possibleStoryPointFields.length > 0 ? possibleStoryPointFields[0] : "customfield_10004";

      // Inicializar métricas
      const userTaskCounts = {};
      const userStoryPoints = {};
      let totalStoryPoints = 0;
      let completedStoryPoints = 0;
      let totalCycleTime = 0;
      let totalTimeSpent = 0;
      let tasksWithoutEstimates = 0;

      sprintIssues.forEach(issue => {
        const assignee = issue.fields.assignee?.displayName || "Unassigned";
        const storyPoints = issue.fields[storyPointsField] || 0;
        const timeSpent = issue.fields.aggregatetimespent || 0; // Tempo total gasto na issue

        userTaskCounts[assignee] = (userTaskCounts[assignee] || 0) + 1;
        userStoryPoints[assignee] = (userStoryPoints[assignee] || 0) + storyPoints;
        totalStoryPoints += storyPoints;
        totalTimeSpent += timeSpent;

        if (!storyPoints || storyPoints === 0) {
          tasksWithoutEstimates += 1;
        }

        if (issue.fields.status.name === "Done") {
          completedStoryPoints += storyPoints;

          // Calcular cycle time
          const createdDate = new Date(issue.fields.created);
          const completedDate = new Date(issue.fields.resolutiondate || issue.fields.updated);
          totalCycleTime += (completedDate - createdDate) / (1000 * 60 * 60 * 24); // Convertendo para dias
        }
      });

      const totalIssues = sprintIssues.length;
      const completedIssuesCount = completedIssues.length;

      // 🔹 Progress (baseado no progresso agregado do Jira)
      const progress = sprintData.aggregateprogress?.progress || 0;
      const totalProgress = sprintData.aggregateprogress?.total || 0;

      // 🔹 Average Cycle Time
      const averageCycleTime = completedIssuesCount > 0 ? totalCycleTime / completedIssuesCount : 0;

      // 🔹 Scope Change
      const initialScope = sprintData.issuesAtStart || sprintIssues.length;
      const addedIssues = sprintData.added || 0;
      const removedIssues = sprintData.removed || 0;
      const scopeChange = initialScope > 0 ? ((addedIssues - removedIssues) / initialScope) * 100 : 0;

      // 🔹 Bugs Reportados e Resolvidos
      const resolvedBugs = bugs.filter(bug => bug.fields.status.name === "Done").length;

      // 🔹 Bug Ratio
      const bugRatio = totalIssues > 0 ? (bugs.length / totalIssues) * 100 : 0;

      // 🔹 Velocity - Várias formas de cálculo
      let velocity = completedStoryPoints; // 🔹 Método 1: Baseado em story points

      if (velocity === 0 && completedIssuesCount > 0) {
        velocity = completedIssuesCount; // 🔹 Método 2: Baseado em número de tarefas concluídas
      }

      if (velocity === 0 && totalTimeSpent > 0) {
        velocity = totalTimeSpent / (1000 * 60 * 60); // 🔹 Método 3: Baseado no tempo gasto (horas)
      }

      // 🔹 Commitment Reliability
      const committedStoryPoints = sprintData.committedStoryPoints || totalStoryPoints;
      const commitmentReliability = committedStoryPoints > 0 ? (completedStoryPoints / committedStoryPoints) * 100 : 0;

      // 🔹 Tasks Without Estimates
      const tasksWithoutEstimatesCount = tasksWithoutEstimates;

      return {
        id: sprintData.id,
        name: sprintData.name,
        startDate: sprintData.startDate,
        endDate: sprintData.endDate,
        progress, // Atualizado
        totalProgress, // Atualizado
        averageCycleTime, // Atualizado
        scopeChange, // Atualizado
        completedIssues: completedIssuesCount,
        pendingIssues: pendingIssues.length,
        reportedBugs: bugs.length,
        resolvedBugs,
        userTaskCounts,
        userStoryPoints,
        totalStoryPoints,
        completedStoryPoints,
        velocity, // Atualizado com múltiplas abordagens
        commitmentReliability, // Atualizado
        bugRatio, // Atualizado
        tasksWithoutEstimates: tasksWithoutEstimatesCount, // Atualizado
      };
    } catch (error) {
      console.error("❌ Error fetching sprint data:", error.message);
      throw new Error(`Error in GetSprintDataUseCase: ${error.message}`);
    }
  }
}
