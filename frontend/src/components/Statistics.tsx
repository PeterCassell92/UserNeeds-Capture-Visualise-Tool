import { useState, useMemo } from 'react'
import type { Statistics as StatsType, UserGroup } from '../types'
import './Statistics.css'

type GroupByMode = 'userGroup' | 'superGroup'

interface StatisticsProps {
  statistics: StatsType
  userGroups: UserGroup[]
  onUserGroupClick?: (userGroupId: string) => void
  onSuperGroupClick?: (superGroup: string) => void
  onEntityClick?: (entityId: string) => void
  onWorkflowPhaseClick?: (workflowPhaseId: string) => void
}

function Statistics({ statistics, userGroups, onUserGroupClick, onSuperGroupClick, onEntityClick, onWorkflowPhaseClick }: StatisticsProps) {
  const [showExtended, setShowExtended] = useState(false)
  const [groupByMode, setGroupByMode] = useState<GroupByMode>('userGroup')

  // Aggregate by super group
  const bySuperGroup = useMemo(() => {
    const result: Record<string, number> = {}

    Object.entries(statistics.byUserGroup).forEach(([userGroupId, count]) => {
      const userGroup = userGroups.find(ug => ug.id === userGroupId)
      const superGroup = userGroup?.superGroup || 'Unknown'

      result[superGroup] = (result[superGroup] || 0) + count
    })

    return result
  }, [statistics.byUserGroup, userGroups])

  // Format super group label for display
  const formatSuperGroupLabel = (sg: string) => {
    if (sg === 'Unknown') return sg
    return sg
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ')
  }

  return (
    <div className="statistics">
      <h3>Statistics</h3>
      <div className="stat-item">
        <span className="stat-label">Total Needs:</span>
        <span className="stat-value">{statistics.totalNeeds}</span>
      </div>

      <div className="stat-section">
        <div className="stat-section-header">
          <div className="toggle-group-btn">
            <button
              className={groupByMode === 'userGroup' ? 'active' : ''}
              onClick={() => setGroupByMode('userGroup')}
              aria-pressed={groupByMode === 'userGroup'}
            >
              User Group
            </button>
            <button
              className={groupByMode === 'superGroup' ? 'active' : ''}
              onClick={() => setGroupByMode('superGroup')}
              aria-pressed={groupByMode === 'superGroup'}
            >
              Super Group
            </button>
          </div>
        </div>

        {groupByMode === 'userGroup' ? (
          // User Group view
          Object.entries(statistics.byUserGroup)
            .sort((a, b) => b[1] - a[1])
            .map(([group, count]) => (
              <div
                key={group}
                className="stat-bar stat-bar-clickable"
                onClick={() => onUserGroupClick?.(group)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault()
                    onUserGroupClick?.(group)
                  }
                }}
              >
                <span className="stat-bar-label">{group}</span>
                <div className="stat-bar-container">
                  <div
                    className="stat-bar-fill"
                    style={{
                      width: `${(count / statistics.totalNeeds) * 100}%`
                    }}
                  />
                  <span className="stat-bar-value">{count}</span>
                </div>
              </div>
            ))
        ) : (
          // Super Group view
          Object.entries(bySuperGroup)
            .sort((a, b) => b[1] - a[1])
            .map(([superGroup, count]) => (
              <div
                key={superGroup}
                className="stat-bar stat-bar-clickable"
                onClick={() => onSuperGroupClick?.(superGroup)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault()
                    onSuperGroupClick?.(superGroup)
                  }
                }}
              >
                <span className="stat-bar-label">{formatSuperGroupLabel(superGroup)}</span>
                <div className="stat-bar-container">
                  <div
                    className="stat-bar-fill"
                    style={{
                      width: `${(count / statistics.totalNeeds) * 100}%`
                    }}
                  />
                  <span className="stat-bar-value">{count}</span>
                </div>
              </div>
            ))
        )}
      </div>

      <button
        className="toggle-extended-btn"
        onClick={() => setShowExtended(!showExtended)}
        aria-expanded={showExtended}
      >
        <span>Show {showExtended ? 'Less' : 'More'} Details</span>
        <span className={`toggle-icon ${showExtended ? 'expanded' : ''}`}>▼</span>
      </button>

      {showExtended && (
        <>
          <div className="stat-section">
            <h4>By Workflow Phase</h4>
            {Object.entries(statistics.byWorkflowPhase)
              .sort((a, b) => b[1] - a[1])
              .map(([phase, count]) => (
                <div
                  key={phase}
                  className="stat-bar stat-bar-clickable"
                  onClick={() => onWorkflowPhaseClick?.(phase)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault()
                      onWorkflowPhaseClick?.(phase)
                    }
                  }}
                >
                  <span className="stat-bar-label">{phase}</span>
                  <div className="stat-bar-container">
                    <div
                      className="stat-bar-fill"
                      style={{
                        width: `${(count / statistics.totalNeeds) * 100}%`
                      }}
                    />
                    <span className="stat-bar-value">{count}</span>
                  </div>
                </div>
              ))}
          </div>

          <div className="stat-section">
            <h4>Top Entities</h4>
            {Object.entries(statistics.byEntity)
              .sort((a, b) => b[1] - a[1])
              .slice(0, 10)
              .map(([entity, count]) => (
                <div
                  key={entity}
                  className="stat-bar stat-bar-clickable"
                  onClick={() => onEntityClick?.(entity)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault()
                      onEntityClick?.(entity)
                    }
                  }}
                >
                  <span className="stat-bar-label">{entity}</span>
                  <div className="stat-bar-container">
                    <div
                      className="stat-bar-fill"
                      style={{
                        width: `${(count / statistics.totalNeeds) * 100}%`
                      }}
                    />
                    <span className="stat-bar-value">{count}</span>
                  </div>
                </div>
              ))}
          </div>
        </>
      )}
    </div>
  )
}

export default Statistics
