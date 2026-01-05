import type { Filters as FiltersType, UserGroup, Entity, WorkflowPhase, RefinedFilter } from '../types'
import './Filters.css'

interface FiltersProps {
  filters: FiltersType
  userGroups: UserGroup[]
  entities: Entity[]
  workflowPhases: WorkflowPhase[]
  onFilterChange: (filters: FiltersType) => void
}

function Filters({ filters, userGroups, entities, workflowPhases, onFilterChange }: FiltersProps) {
  const handleChange = (key: keyof FiltersType, value: string) => {
    onFilterChange({
      ...filters,
      [key]: value
    })
  }

  const handleReset = () => {
    onFilterChange({
      userGroupId: '',
      entity: '',
      workflowPhase: '',
      superGroup: '',
      refined: 'all'
    })
  }

  // Get unique super groups from user groups
  const superGroups = Array.from(new Set(
    userGroups
      .map(ug => ug.superGroup)
      .filter((sg): sg is string => sg !== null && sg !== undefined)
  )).sort()

  // Format super group label for display
  const formatSuperGroupLabel = (sg: string) => {
    // Convert snake_case to Title Case
    return sg
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ')
  }

  const hasActiveFilters = filters.userGroupId || filters.entity || filters.workflowPhase || filters.superGroup || filters.refined !== 'all'

  return (
    <div className="filters">
      <div className="filters-header">
        <h3>Filters</h3>
        {hasActiveFilters && (
          <button className="btn-reset" onClick={handleReset}>
            Reset
          </button>
        )}
      </div>

      <div className="filter-group">
        <label htmlFor="superGroup">Super Group</label>
        <select
          id="superGroup"
          value={filters.superGroup}
          onChange={(e) => handleChange('superGroup', e.target.value)}
        >
          <option value="">All</option>
          {superGroups.map((sg) => (
            <option key={sg} value={sg}>
              {formatSuperGroupLabel(sg)}
            </option>
          ))}
        </select>
      </div>

      <div className="filter-group">
        <label htmlFor="userGroup">User Group</label>
        <select
          id="userGroup"
          value={filters.userGroupId}
          onChange={(e) => handleChange('userGroupId', e.target.value)}
        >
          <option value="">All</option>
          {userGroups.map((group) => (
            <option key={group.id} value={group.id}>
              {group.name}
            </option>
          ))}
        </select>
      </div>

      <div className="filter-group">
        <label htmlFor="entity">Entity</label>
        <select
          id="entity"
          value={filters.entity}
          onChange={(e) => handleChange('entity', e.target.value)}
        >
          <option value="">All</option>
          {entities.map((entity) => (
            <option key={entity.id} value={entity.id}>
              {entity.name}
            </option>
          ))}
        </select>
      </div>

      <div className="filter-group">
        <label htmlFor="workflowPhase">Workflow Phase</label>
        <select
          id="workflowPhase"
          value={filters.workflowPhase}
          onChange={(e) => handleChange('workflowPhase', e.target.value)}
        >
          <option value="">All</option>
          {workflowPhases
            .sort((a, b) => a.order - b.order)
            .map((phase) => (
              <option key={phase.id} value={phase.id}>
                {phase.name}
              </option>
            ))}
        </select>
      </div>

      <div className="filter-group">
        <label>Refinement Status</label>
        <div className="toggle-refined-btn">
          <button
            className={filters.refined === 'all' ? 'active' : ''}
            onClick={() => handleChange('refined', 'all')}
            aria-pressed={filters.refined === 'all'}
          >
            All
          </button>
          <button
            className={filters.refined === 'refined' ? 'active' : ''}
            onClick={() => handleChange('refined', 'refined')}
            aria-pressed={filters.refined === 'refined'}
          >
            Refined
          </button>
          <button
            className={filters.refined === 'needsRefinement' ? 'active' : ''}
            onClick={() => handleChange('refined', 'needsRefinement')}
            aria-pressed={filters.refined === 'needsRefinement'}
          >
            Need Refinement
          </button>
        </div>
      </div>
    </div>
  )
}

export default Filters
