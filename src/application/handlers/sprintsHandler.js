import { JiraRepository } from "../../domain/repositories/JiraRepository.js";
import { GetSprintDataUseCase } from "../usecases/GetSprintDataUseCase.js";

export async function handleSprintsCommand(rl) {
  console.log("🔍 Fetching boards...");
  try {
    const boardIds = process.env.JIRA_BOARD_ID.split(",").map(id => id.trim());
    const boards = [];

    // Buscar detalhes de cada board
    for (const boardId of boardIds) {
      try {
        const boardDetails = await JiraRepository.getBoardDetails(boardId);
        boards.push({ id: boardId, name: boardDetails.name });
      } catch (error) {
        console.error(`⚠️ Could not fetch details for board ID ${boardId}: ${error.message}`);
      }
    }

    // Listar os boards disponíveis com seus nomes
    console.log("\n📋 Available Boards:");
    console.log("--------------------");
    boards.forEach((board, index) => {
      console.log(`${index + 1}. ${board.name} (ID: ${board.id})`);
    });

    rl.question("\nEnter the number of the board to view its sprints: ", async (choice) => {
      const boardIndex = parseInt(choice) - 1;
      if (isNaN(boardIndex) || boardIndex < 0 || boardIndex >= boards.length) {
        console.log("❌ Invalid choice. Please try again.");
        rl.prompt();
        return;
      }

      const selectedBoard = boards[boardIndex];
      console.log(`\n🔍 Fetching sprints for Board: ${selectedBoard.name} (ID: ${selectedBoard.id})...`);

      try {
        const sprints = await JiraRepository.getSprintsForBoard(selectedBoard.id);

        // Filtrar sprints com datas válidas e ordenar por data de início (mais recente primeiro)
        const validSprints = sprints.filter(sprint => {
          const startDate = new Date(sprint.startDate);
          return !isNaN(startDate);
        }).sort((a, b) => new Date(b.startDate) - new Date(a.startDate));

        // Selecionar as 5 sprints mais recentes
        const topSprints = validSprints.slice(0, 5);

        if (topSprints.length === 0) {
          console.log("❌ No valid sprints found for this board.");
          rl.prompt();
          return;
        }

        console.log("\n📋 Top 5 Sprints:");
        console.log("------------------");
        topSprints.forEach((sprint, index) => {
          console.log(`${index + 1}. ${sprint.name} (State: ${sprint.state}, Start: ${new Date(sprint.startDate).toLocaleDateString()}, End: ${new Date(sprint.endDate).toLocaleDateString()})`);
        });

        rl.question("\nEnter the number of the sprint to view details: ", async (sprintChoice) => {
          const sprintIndex = parseInt(sprintChoice) - 1;
          if (isNaN(sprintIndex) || sprintIndex < 0 || sprintIndex >= topSprints.length) {
            console.log("❌ Invalid choice. Please try again.");
            rl.prompt();
            return;
          }

          const selectedSprint = topSprints[sprintIndex];
          console.log(`\n🔍 Fetching details for sprint "${selectedSprint.name}"...`);
          try {
            const sprintData = await GetSprintDataUseCase.execute(selectedBoard.id, selectedSprint.name);
            console.log("\n📋 Sprint Data:");
            console.log("----------------");
            console.log(`🆔 ID: ${sprintData.id}`);
            console.log(`📛 Name: ${sprintData.name}`);
            console.log(`📅 Start Date: ${new Date(sprintData.startDate).toLocaleString()}`);
            console.log(`📅 End Date: ${new Date(sprintData.endDate).toLocaleString()}`);
            
            console.log("\n📊 Sprint Metrics:");
            console.log("------------------");
            console.log(`🐞 Reported Bugs: ${sprintData.reportedBugs}`);
            console.log(`⏳ Pending Issues: ${sprintData.pendingIssues}`);
            console.log(`📈 Total Story Points Delivered: ${sprintData.totalStoryPoints}`);
            console.log(`📊 Bug Ratio: ${sprintData.bugRatio.toFixed(2)}%`);
            console.log(`📊 Tasks Without Estimates: ${sprintData.tasksWithoutEstimates}`);
            console.log("\n👥 User Task Breakdown:");
            console.log("-------------------------");
            Object.entries(sprintData.userTaskCounts).forEach(([user, taskCount]) => {
              const storyPoints = sprintData.userStoryPoints[user] || 0;
              console.log(`- ${user}: ${taskCount} tasks, ${storyPoints} story points`);
            });
          } catch (error) {
            console.error(`❌ Error: ${error.message}`);
          }
          rl.prompt();
        });
      } catch (error) {
        console.error(`❌ Error fetching sprints for board: ${error.message}`);
        rl.prompt();
      }
    });
  } catch (error) {
    console.error(`❌ Error fetching boards: ${error.message}`);
    rl.prompt();
  }
}
