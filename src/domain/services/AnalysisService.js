import { DomainError } from '../../infrastructure/errors/ErrorHandler.js';

export class AnalysisService {
  constructor(fileService, aiAgent) {
    this.fileService = fileService;
    this.aiAgent = aiAgent;
  }

  async analyzeCode(filePath) {
    try {
      const content = await this.fileService.readFile(filePath);
      const fileType = filePath.split('.').pop() || 'unknown';
      
      const prompt = this.generateAnalysisPrompt(filePath, fileType, content);
      return await this.aiAgent.analyze(prompt);
    } catch (error) {
      throw new DomainError('Error analyzing code', { 
        filePath, 
        error: error.message 
      });
    }
  }

  generateAnalysisPrompt(filePath, fileType, content) {
    return {
      type: 'code_analysis',
      file: {
        path: filePath,
        type: fileType,
        content: content
      },
      instructions: [
        'Explain the main purpose and functionality',
        'Identify potential code smells',
        'Suggest improvements',
        'Analyze security implications',
        'Review performance considerations'
      ]
    };
  }

  async analyzePullRequest(pr) {
    try {
      const analysis = {
        summary: await this._analyzeContent(pr.title + '\n' + pr.description),
        scope: this._analyzePRScope(pr),
        security: this._analyzeSecurityImpact(pr),
        recommendations: []
      };

      // Add recommendations based on analysis
      if (pr.description.length < 50) {
        analysis.recommendations.push('Consider adding a more detailed description');
      }

      return analysis;
    } catch (error) {
      throw new DomainError('Error analyzing pull request', {
        prId: pr.id,
        error: error.message
      });
    }
  }

  // Changed from private to regular method with underscore prefix
  async _analyzeContent(content) {
    const prompt = {
      type: 'pr_analysis',
      content,
      instructions: [
        'Summarize the main changes',
        'Identify potential risks',
        'Suggest review focus areas'
      ]
    };
    return await this.aiAgent.analyze(prompt);
  }

  // Changed from private to regular method with underscore prefix
  _analyzePRScope(pr) {
    return {
      changedFiles: pr.source?.changes?.length || 0,
      additions: pr.source?.changes?.reduce((acc, c) => acc + (c.lines_added || 0), 0) || 0,
      deletions: pr.source?.changes?.reduce((acc, c) => acc + (c.lines_removed || 0), 0) || 0
    };
  }

  // Changed from private to regular method with underscore prefix
  _analyzeSecurityImpact(pr) {
    const securityPatterns = [
      /security/i,
      /auth/i,
      /password/i,
      /credential/i,
      /token/i
    ];

    const hasSecurityChanges = pr.source?.changes?.some(change => 
      securityPatterns.some(pattern => pattern.test(change.path))
    );

    return {
      hasSecurityImpact: hasSecurityChanges,
      riskLevel: hasSecurityChanges ? 'high' : 'normal'
    };
  }
}
