import { useState, useEffect } from 'react'
import axios from 'axios'
import type { UserNeed, UserGroup, Entity, WorkflowPhase, UserNeedCreate, UserNeedUpdate } from '../types'
import './UserNeedForm.css'

interface UserNeedFormProps {
  need: UserNeed | null
  userGroups: UserGroup[]
  entities: Entity[]
  workflowPhases: WorkflowPhase[]
  onSubmit: (data: UserNeedCreate | UserNeedUpdate) => void
  onCancel: () => void
}

function UserNeedForm({ need, userGroups, entities, workflowPhases, onSubmit, onCancel }: UserNeedFormProps) {
  const [formData, setFormData] = useState({
    id: need?.id || '',
    userGroupId: need?.userGroupId || '',
    title: need?.title || '',
    description: need?.description || '',
    entities: need?.entities || [] as string[],
    workflowPhase: need?.workflowPhase || '',
    sla: need?.sla || '',
    triggersStateChange: need?.triggersStateChange || false,
    fromState: need?.fromState || '',
    toState: need?.toState || '',
    optional: need?.optional || false,
    futureFeature: need?.futureFeature || false,
    constraints: need?.constraints?.join('\n') || ''
  })

  const [manualIdMode, setManualIdMode] = useState(false)

  // Auto-generate ID when user group changes (only for new needs)
  useEffect(() => {
    if (!need && formData.userGroupId && !manualIdMode) {
      fetchNextId(formData.userGroupId)
    }
  }, [formData.userGroupId, manualIdMode, need])

  const fetchNextId = async (userGroupId: string) => {
    try {
      const res = await axios.get(`/api/next-id/${userGroupId}`)
      setFormData(prev => ({ ...prev, id: res.data.nextId }))
    } catch (err) {
      console.error('Failed to fetch next ID:', err)
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const data: any = {
      userGroupId: formData.userGroupId,
      title: formData.title,
      description: formData.description,
      entities: formData.entities,
      workflowPhase: formData.workflowPhase
    }

    // Add optional fields if they have values
    if (formData.sla) data.sla = formData.sla
    if (formData.triggersStateChange) {
      data.triggersStateChange = true
      if (formData.fromState) data.fromState = formData.fromState
      if (formData.toState) data.toState = formData.toState
    }
    if (formData.optional) data.optional = true
    if (formData.futureFeature) data.futureFeature = true
    if (formData.constraints) {
      data.constraints = formData.constraints
        .split('\n')
        .map(c => c.trim())
        .filter(c => c.length > 0)
    }

    // Add ID for create operations
    if (!need) {
      data.id = formData.id
    }

    onSubmit(data)
  }

  const handleEntityToggle = (entityId: string) => {
    const entities = formData.entities.includes(entityId)
      ? formData.entities.filter(e => e !== entityId)
      : [...formData.entities, entityId]
    setFormData({ ...formData, entities })
  }

  return (
    <div className="user-need-form">
      <h3>{need ? 'Edit User Need' : 'Add User Need'}</h3>
      <form onSubmit={handleSubmit}>
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="userGroupId">User Group *</label>
            <select
              id="userGroupId"
              value={formData.userGroupId}
              onChange={(e) => setFormData({ ...formData, userGroupId: e.target.value })}
              required
              disabled={!!need}
            >
              <option value="">Select a user group</option>
              {userGroups.map((group) => (
                <option key={group.id} value={group.id}>
                  {group.name}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="id">ID *</label>
            {!need && (
              <div className="id-controls">
                <input
                  id="id"
                  type="text"
                  value={formData.id}
                  onChange={(e) => setFormData({ ...formData, id: e.target.value })}
                  disabled={!manualIdMode}
                  required
                  placeholder="Auto-generated from user group"
                  className={manualIdMode ? '' : 'auto-id'}
                />
                <label className="checkbox-label inline">
                  <input
                    type="checkbox"
                    checked={manualIdMode}
                    onChange={(e) => setManualIdMode(e.target.checked)}
                  />
                  <span>Manual ID</span>
                </label>
              </div>
            )}
            {need && (
              <input
                id="id"
                type="text"
                value={formData.id}
                disabled
                required
              />
            )}
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="title">Title *</label>
          <input
            id="title"
            type="text"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            required
            placeholder="Brief title for this user need"
          />
        </div>

        <div className="form-group">
          <label htmlFor="description">Description *</label>
          <textarea
            id="description"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            required
            rows={4}
            placeholder="Detailed description of the user need"
          />
        </div>

        <div className="form-group">
          <label>Entities * (select at least one)</label>
          <div className="checkbox-grid">
            {entities.map((entity) => (
              <label key={entity.id} className="checkbox-label">
                <input
                  type="checkbox"
                  checked={formData.entities.includes(entity.id)}
                  onChange={() => handleEntityToggle(entity.id)}
                />
                <span>{entity.name}</span>
              </label>
            ))}
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="workflowPhase">Workflow Phase *</label>
            <select
              id="workflowPhase"
              value={formData.workflowPhase}
              onChange={(e) => setFormData({ ...formData, workflowPhase: e.target.value })}
              required
            >
              <option value="">Select a workflow phase</option>
              {workflowPhases
                .sort((a, b) => a.order - b.order)
                .map((phase) => (
                  <option key={phase.id} value={phase.id}>
                    {phase.name}
                  </option>
                ))}
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="sla">SLA</label>
            <input
              id="sla"
              type="text"
              value={formData.sla}
              onChange={(e) => setFormData({ ...formData, sla: e.target.value })}
              placeholder="e.g., 2 minutes, 1 hour"
            />
          </div>
        </div>

        <div className="form-group">
          <label className="checkbox-label">
            <input
              type="checkbox"
              checked={formData.triggersStateChange}
              onChange={(e) => setFormData({ ...formData, triggersStateChange: e.target.checked })}
            />
            <span>Triggers State Change</span>
          </label>
        </div>

        {formData.triggersStateChange && (
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="fromState">From State</label>
              <input
                id="fromState"
                type="text"
                value={formData.fromState}
                onChange={(e) => setFormData({ ...formData, fromState: e.target.value })}
                placeholder="e.g., processing"
              />
            </div>

            <div className="form-group">
              <label htmlFor="toState">To State</label>
              <input
                id="toState"
                type="text"
                value={formData.toState}
                onChange={(e) => setFormData({ ...formData, toState: e.target.value })}
                placeholder="e.g., completed"
              />
            </div>
          </div>
        )}

        <div className="form-row">
          <div className="form-group">
            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={formData.optional}
                onChange={(e) => setFormData({ ...formData, optional: e.target.checked })}
              />
              <span>Optional Feature</span>
            </label>
          </div>

          <div className="form-group">
            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={formData.futureFeature}
                onChange={(e) => setFormData({ ...formData, futureFeature: e.target.checked })}
              />
              <span>Future Feature</span>
            </label>
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="constraints">Constraints (one per line)</label>
          <textarea
            id="constraints"
            value={formData.constraints}
            onChange={(e) => setFormData({ ...formData, constraints: e.target.value })}
            rows={3}
            placeholder="Enter constraints, one per line"
          />
        </div>

        <div className="form-actions">
          <button type="button" className="btn-cancel" onClick={onCancel}>
            Cancel
          </button>
          <button type="submit" className="btn-submit">
            {need ? 'Update' : 'Create'}
          </button>
        </div>
      </form>
    </div>
  )
}

export default UserNeedForm
