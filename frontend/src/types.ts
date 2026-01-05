export interface UserSuperGroup {
  id: string
  name: string
  prefix: string
}

export interface UserGroup {
  id: string
  name: string
  description?: string
  superGroup?: string
}

export interface Entity {
  id: string
  name: string
  description?: string
}

export interface WorkflowPhase {
  id: string
  name: string
  order: number
}

export interface UserNeed {
  id: string
  userGroupId: string
  title: string
  description: string
  entities: string[]
  workflowPhase: string
  refined?: boolean
  sla?: string
  triggersStateChange?: boolean
  fromState?: string
  toState?: string
  optional?: boolean
  futureFeature?: boolean
  constraints?: string[]
}

export interface UserNeedCreate {
  id: string
  userGroupId: string
  title: string
  description: string
  entities: string[]
  workflowPhase: string
  refined?: boolean
  sla?: string
  triggersStateChange?: boolean
  fromState?: string
  toState?: string
  optional?: boolean
  futureFeature?: boolean
  constraints?: string[]
}

export interface UserNeedUpdate {
  userGroupId?: string
  title?: string
  description?: string
  entities?: string[]
  workflowPhase?: string
  refined?: boolean
  sla?: string
  triggersStateChange?: boolean
  fromState?: string
  toState?: string
  optional?: boolean
  futureFeature?: boolean
  constraints?: string[]
}

export interface Statistics {
  totalNeeds: number
  byUserGroup: Record<string, number>
  byWorkflowPhase: Record<string, number>
  byEntity: Record<string, number>
}

export type RefinedFilter = 'all' | 'refined' | 'needsRefinement'

export interface Filters {
  userGroupId: string
  entity: string
  workflowPhase: string
  superGroup: string
  refined: RefinedFilter
}
