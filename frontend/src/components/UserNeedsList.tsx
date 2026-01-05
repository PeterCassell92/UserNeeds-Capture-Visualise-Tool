import { useState } from 'react'
import type { UserNeed, UserGroup, Entity, WorkflowPhase } from '../types'
import './UserNeedsList.css'

interface UserNeedsListProps {
  userNeeds: UserNeed[]
  userGroups: UserGroup[]
  entities: Entity[]
  workflowPhases: WorkflowPhase[]
  view: 'table' | 'cards'
  cardSize?: 'normal' | 'large'
  onEdit: (need: UserNeed) => void
  onDelete: (needId: string) => void
  onToggleRefined: (needId: string, refined: boolean) => void
}

function UserNeedsList({ userNeeds, userGroups, entities, workflowPhases, view, cardSize = 'normal', onEdit, onDelete, onToggleRefined }: UserNeedsListProps) {
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set())
  const [showAllDetails, setShowAllDetails] = useState(false)

  const getUserGroupName = (id: string) => {
    return userGroups.find(g => g.id === id)?.name || id
  }

  const getWorkflowPhaseName = (id: string) => {
    return workflowPhases.find(p => p.id === id)?.name || id
  }

  const getEntityNames = (entityIds: string[]) => {
    return entityIds.map(id => entities.find(e => e.id === id)?.name || id).join(', ')
  }

  const toggleRow = (needId: string) => {
    const newExpanded = new Set(expandedRows)
    if (newExpanded.has(needId)) {
      newExpanded.delete(needId)
    } else {
      newExpanded.add(needId)
    }
    setExpandedRows(newExpanded)
  }

  const isRowExpanded = (needId: string) => {
    return showAllDetails || expandedRows.has(needId)
  }

  if (userNeeds.length === 0) {
    return (
      <div className="empty-state">
        <p>No user needs found. Try adjusting your filters or add a new user need.</p>
      </div>
    )
  }

  if (view === 'table') {
    return (
      <div className="table-container">
        <div className="table-controls">
          <label className="toggle-all-checkbox">
            <input
              type="checkbox"
              checked={showAllDetails}
              onChange={(e) => setShowAllDetails(e.target.checked)}
            />
            <span>Toggle Full Info</span>
          </label>
        </div>
        <table className="user-needs-table">
          <thead>
            <tr>
              <th style={{ width: '30px' }}></th>
              <th style={{ width: '80px' }}>Refined</th>
              <th>ID</th>
              <th>Title</th>
              <th>User Group</th>
              <th>Entities</th>
              <th>Workflow Phase</th>
              <th>SLA</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {userNeeds.map((need) => (
              <>
                <tr key={need.id} className={`${isRowExpanded(need.id) ? 'row-expanded' : ''} ${need.refined ? 'refined' : ''}`}>
                  <td className="cell-expand">
                    <button
                      className="btn-expand"
                      onClick={() => toggleRow(need.id)}
                      title={isRowExpanded(need.id) ? 'Collapse' : 'Expand'}
                    >
                      {isRowExpanded(need.id) ? '▼' : '▶'}
                    </button>
                  </td>
                  <td className="cell-refined">
                    <input
                      type="checkbox"
                      checked={need.refined || false}
                      onChange={(e) => onToggleRefined(need.id, e.target.checked)}
                      title="Mark as refined"
                    />
                  </td>
                  <td className="cell-id">{need.id}</td>
                  <td className="cell-title">
                    <div className="title-content">
                      {need.title}
                      <div className="badges">
                        {need.optional && <span className="badge badge-optional">Optional</span>}
                        {need.futureFeature && <span className="badge badge-future">Future</span>}
                        {need.triggersStateChange && <span className="badge badge-state">State Change</span>}
                      </div>
                    </div>
                  </td>
                  <td>{getUserGroupName(need.userGroupId)}</td>
                  <td className="cell-entities">{getEntityNames(need.entities)}</td>
                  <td>{getWorkflowPhaseName(need.workflowPhase)}</td>
                  <td className="cell-sla">{need.sla || '-'}</td>
                  <td className="cell-actions">
                    <button
                      className="btn-action btn-edit"
                      onClick={() => onEdit(need)}
                      title="Edit"
                    >
                      Edit
                    </button>
                    <button
                      className="btn-action btn-delete"
                      onClick={() => onDelete(need.id)}
                      title="Delete"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
                {isRowExpanded(need.id) && (
                  <tr key={`${need.id}-details`} className="row-details">
                    <td></td>
                    <td colSpan={8}>
                      <div className="expanded-content">
                        <div className="expanded-section">
                          <h4>Description</h4>
                          <p>{need.description}</p>
                        </div>

                        {need.triggersStateChange && (
                          <div className="expanded-section">
                            <h4>State Transition</h4>
                            <p>
                              {need.fromState || 'Any'} → {need.toState || 'Unknown'}
                            </p>
                          </div>
                        )}

                        {need.constraints && need.constraints.length > 0 && (
                          <div className="expanded-section">
                            <h4>Constraints</h4>
                            <ul className="constraints-list">
                              {need.constraints.map((constraint, idx) => (
                                <li key={idx}>{constraint}</li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    </td>
                  </tr>
                )}
              </>
            ))}
          </tbody>
        </table>
      </div>
    )
  }

  // Cards view
  return (
    <div className={`cards-container ${cardSize === 'large' ? 'cards-large' : ''}`}>
      {userNeeds.map((need) => (
        <div key={need.id} className={`user-need-card ${need.refined ? 'refined' : ''}`}>
          <div className="card-header">
            <span className="card-id">{need.id}</span>
            <div className="card-actions">
              <button
                className="btn-action btn-edit"
                onClick={() => onEdit(need)}
                title="Edit"
              >
                Edit
              </button>
              <button
                className="btn-action btn-delete"
                onClick={() => onDelete(need.id)}
                title="Delete"
              >
                Delete
              </button>
            </div>
          </div>

          <h4 className="card-title">{need.title}</h4>

          <div className="card-badges">
            {need.optional && <span className="badge badge-optional">Optional</span>}
            {need.futureFeature && <span className="badge badge-future">Future</span>}
            {need.triggersStateChange && <span className="badge badge-state">State Change</span>}
          </div>

          <p className="card-description">{need.description}</p>

          <div className="card-details">
            <div className="detail-item">
              <span className="detail-label">User Group:</span>
              <span className="detail-value">{getUserGroupName(need.userGroupId)}</span>
            </div>

            <div className="detail-item">
              <span className="detail-label">Workflow Phase:</span>
              <span className="detail-value">{getWorkflowPhaseName(need.workflowPhase)}</span>
            </div>

            <div className="detail-item">
              <span className="detail-label">Entities:</span>
              <span className="detail-value">{getEntityNames(need.entities)}</span>
            </div>

            {need.sla && (
              <div className="detail-item">
                <span className="detail-label">SLA:</span>
                <span className="detail-value">{need.sla}</span>
              </div>
            )}

            {need.triggersStateChange && (
              <div className="detail-item">
                <span className="detail-label">State Transition:</span>
                <span className="detail-value">
                  {need.fromState || '?'} → {need.toState || '?'}
                </span>
              </div>
            )}

            {need.constraints && need.constraints.length > 0 && (
              <div className="detail-item detail-constraints">
                <span className="detail-label">Constraints:</span>
                <ul className="constraints-list">
                  {need.constraints.map((constraint, idx) => (
                    <li key={idx}>{constraint}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          <label className="card-refined-checkbox" title="Mark as refined">
            <input
              type="checkbox"
              checked={need.refined || false}
              onChange={(e) => onToggleRefined(need.id, e.target.checked)}
            />
            <span>Refined</span>
          </label>
        </div>
      ))}
    </div>
  )
}

export default UserNeedsList
