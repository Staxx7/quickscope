// Workflow Manager for maintaining context across all steps
export interface WorkflowState {
  companyId: string
  companyName: string
  companyEmail?: string
  currentStep: 'dashboard' | 'data-extraction' | 'call-transcripts' | 'financial-analysis' | 'report-generation' | 'audit-deck'
  completedSteps: string[]
  data: {
    financialData?: any
    transcriptData?: any
    transcriptAnalysis?: any
    financialAnalysis?: any
    generatedReports?: any
    auditDeck?: any
  }
  timestamps: {
    started: string
    lastUpdated: string
    [key: string]: string
  }
}

export class WorkflowManager {
  private static readonly STORAGE_KEY = 'qb_workflow_state'
  private static readonly TRANSCRIPT_STORAGE_KEY = 'qb_transcript_data'

  // Initialize or get current workflow state
  static getWorkflowState(companyId?: string): WorkflowState | null {
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY)
      if (!stored) return null
      
      const states = JSON.parse(stored)
      if (companyId) {
        return states[companyId] || null
      }
      
      // Return the most recent workflow
      const sorted = Object.values(states as Record<string, WorkflowState>)
        .sort((a, b) => new Date(b.timestamps.lastUpdated).getTime() - new Date(a.timestamps.lastUpdated).getTime())
      
      return sorted[0] || null
    } catch (error) {
      console.error('Error reading workflow state:', error)
      return null
    }
  }

  // Save workflow state
  static saveWorkflowState(state: WorkflowState): void {
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY)
      const states = stored ? JSON.parse(stored) : {}
      
      states[state.companyId] = {
        ...state,
        timestamps: {
          ...state.timestamps,
          lastUpdated: new Date().toISOString()
        }
      }
      
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(states))
    } catch (error) {
      console.error('Error saving workflow state:', error)
    }
  }

  // Start new workflow
  static startWorkflow(companyId: string, companyName: string, companyEmail?: string): WorkflowState {
    const newState: WorkflowState = {
      companyId,
      companyName,
      companyEmail,
      currentStep: 'dashboard',
      completedSteps: [],
      data: {},
      timestamps: {
        started: new Date().toISOString(),
        lastUpdated: new Date().toISOString()
      }
    }
    
    this.saveWorkflowState(newState)
    return newState
  }

  // Update workflow step
  static updateStep(companyId: string, step: WorkflowState['currentStep'], data?: any): void {
    const state = this.getWorkflowState(companyId)
    if (!state) return
    
    // Mark previous step as completed
    if (state.currentStep && !state.completedSteps.includes(state.currentStep)) {
      state.completedSteps.push(state.currentStep)
    }
    
    state.currentStep = step
    state.timestamps[step] = new Date().toISOString()
    
    // Update data based on step
    if (data) {
      switch (step) {
        case 'data-extraction':
          state.data.financialData = data
          break
        case 'call-transcripts':
          state.data.transcriptData = data
          break
        case 'financial-analysis':
          state.data.financialAnalysis = data
          break
        case 'report-generation':
          state.data.generatedReports = data
          break
        case 'audit-deck':
          state.data.auditDeck = data
          break
      }
    }
    
    this.saveWorkflowState(state)
  }

  // Save transcript data separately (for persistence)
  static saveTranscriptData(companyId: string, transcriptData: any): void {
    try {
      const stored = localStorage.getItem(this.TRANSCRIPT_STORAGE_KEY)
      const transcripts = stored ? JSON.parse(stored) : {}
      
      if (!transcripts[companyId]) {
        transcripts[companyId] = []
      }
      
      transcripts[companyId].push({
        ...transcriptData,
        timestamp: new Date().toISOString()
      })
      
      localStorage.setItem(this.TRANSCRIPT_STORAGE_KEY, JSON.stringify(transcripts))
      
      // Also update workflow state
      const state = this.getWorkflowState(companyId)
      if (state) {
        state.data.transcriptData = transcripts[companyId]
        this.updateStep(companyId, 'call-transcripts', transcripts[companyId])
      }
    } catch (error) {
      console.error('Error saving transcript data:', error)
    }
  }

  // Get transcript data
  static getTranscriptData(companyId: string): any[] {
    try {
      const stored = localStorage.getItem(this.TRANSCRIPT_STORAGE_KEY)
      if (!stored) return []
      
      const transcripts = JSON.parse(stored)
      return transcripts[companyId] || []
    } catch (error) {
      console.error('Error reading transcript data:', error)
      return []
    }
  }

  // Navigate to next step with context
  static navigateToStep(
    router: any,
    step: WorkflowState['currentStep'],
    companyId: string,
    companyName: string,
    additionalParams?: Record<string, string>
  ): void {
    const params = new URLSearchParams({
      company_id: companyId,
      company_name: companyName,
      account: companyId, // For backwards compatibility
      company: companyName, // For backwards compatibility
      ...additionalParams
    })
    
    const routes: Record<WorkflowState['currentStep'], string> = {
      'dashboard': '/admin/dashboard',
      'data-extraction': '/admin/dashboard/data-extraction',
      'call-transcripts': '/admin/dashboard/call-transcripts',
      'financial-analysis': '/admin/dashboard/advanced-analysis',
      'report-generation': '/admin/dashboard/report-generation',
      'audit-deck': '/admin/dashboard/audit-deck'
    }
    
    const url = `${routes[step]}?${params.toString()}`
    console.log('WorkflowManager navigating to:', url)
    
    // Try multiple navigation methods
    try {
      // Update workflow state first
      this.updateStep(companyId, step)
      
      // Store in session storage as backup
      sessionStorage.setItem('selectedCompany', JSON.stringify({
        id: companyId,
        company_id: companyId,
        name: companyName,
        company_name: companyName
      }))
      
      // Navigate using router
      if (router && router.push) {
        router.push(url)
      } else {
        // Fallback to window.location
        window.location.href = url
      }
    } catch (error) {
      console.error('Navigation error, using window.location:', error)
      window.location.href = url
    }
  }

  // Get workflow progress
  static getWorkflowProgress(companyId: string): {
    currentStep: string
    completedSteps: string[]
    progress: number
    nextStep: string | null
  } {
    const state = this.getWorkflowState(companyId)
    if (!state) {
      return {
        currentStep: 'dashboard',
        completedSteps: [],
        progress: 0,
        nextStep: 'data-extraction'
      }
    }
    
    const allSteps = ['dashboard', 'data-extraction', 'call-transcripts', 'financial-analysis', 'report-generation', 'audit-deck']
    const currentIndex = allSteps.indexOf(state.currentStep)
    const progress = Math.round((state.completedSteps.length / allSteps.length) * 100)
    const nextStep = currentIndex < allSteps.length - 1 ? allSteps[currentIndex + 1] : null
    
    return {
      currentStep: state.currentStep,
      completedSteps: state.completedSteps,
      progress,
      nextStep
    }
  }

  // Clear workflow for a company
  static clearWorkflow(companyId: string): void {
    try {
      // Clear workflow state
      const stored = localStorage.getItem(this.STORAGE_KEY)
      if (stored) {
        const states = JSON.parse(stored)
        delete states[companyId]
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(states))
      }
      
      // Clear transcript data
      const transcriptStored = localStorage.getItem(this.TRANSCRIPT_STORAGE_KEY)
      if (transcriptStored) {
        const transcripts = JSON.parse(transcriptStored)
        delete transcripts[companyId]
        localStorage.setItem(this.TRANSCRIPT_STORAGE_KEY, JSON.stringify(transcripts))
      }
    } catch (error) {
      console.error('Error clearing workflow:', error)
    }
  }
}