import { useState, useEffect } from 'react'
import axios from 'axios'
import UserNeedsList from './components/UserNeedsList'
import UserNeedFormModal from './components/UserNeedFormModal'
import Filters from './components/Filters'
import Statistics from './components/Statistics'
import NetworkGraph from './components/NetworkGraph'
import { Header } from './components/Header'
import { FirstTimeSetup } from './components/FirstTimeSetup'
import { useAppDispatch, useAppSelector } from './store/hooks'
import { fetchDemoMode, setDemoModeAsync } from './store/settingsSlice'
import type { UserNeed, UserGroup, Entity, WorkflowPhase, Statistics as StatsType, Filters as FiltersType, UserNeedCreate, UserNeedUpdate } from './types'
import './App.css'

const API_BASE = '/api'

type ViewType = 'table' | 'cards' | 'graph'
type CardSize = 'normal' | 'large'

function App() {
  const dispatch = useAppDispatch()
  const demoMode = useAppSelector((state) => state.settings.demoMode)
  const [userNeeds, setUserNeeds] = useState<UserNeed[]>([])
  const [userGroups, setUserGroups] = useState<UserGroup[]>([])
  const [entities, setEntities] = useState<Entity[]>([])
  const [workflowPhases, setWorkflowPhases] = useState<WorkflowPhase[]>([])
  const [statistics, setStatistics] = useState<StatsType | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [editingNeed, setEditingNeed] = useState<UserNeed | null>(null)
  const [showForm, setShowForm] = useState(false)
  const [showFirstTimeSetup, setShowFirstTimeSetup] = useState(false)
  const [view, setView] = useState<ViewType>('cards')
  const [cardSize, setCardSize] = useState<CardSize>('normal')

  // Filters
  const [filters, setFilters] = useState<FiltersType>({
    userGroupId: '',
    entity: '',
    workflowPhase: '',
    superGroup: '',
    refined: 'all'
  })

  // Fetch demo mode state from backend on initialization
  useEffect(() => {
    const initializeApp = async () => {
      await dispatch(fetchDemoMode())
      checkSetup()
    }
    initializeApp()
  }, [dispatch])

  // Load data when filters change
  useEffect(() => {
    if (!loading) {
      loadUserNeeds()
    }
  }, [filters])

  // Note: Escape key handling is now done in the Modal component

  const checkSetup = async () => {
    try {
      const response = await axios.get<{ hasData: boolean; needsSetup: boolean }>(`${API_BASE}/check-setup`)

      // Only trigger first-time setup if not in demo mode and needs setup
      if (!demoMode && response.data.needsSetup) {
        setShowFirstTimeSetup(true)
        setLoading(false)
      } else {
        await loadData()
      }
    } catch (err) {
      // If check fails, continue with normal loading
      await loadData()
    }
  }

  const loadData = async () => {
    try {
      setLoading(true)
      const [groupsRes, entitiesRes, phasesRes, statsRes] = await Promise.all([
        axios.get<UserGroup[]>(`${API_BASE}/user-groups`),
        axios.get<Entity[]>(`${API_BASE}/entities`),
        axios.get<WorkflowPhase[]>(`${API_BASE}/workflow-phases`),
        axios.get<StatsType>(`${API_BASE}/statistics`)
      ])

      setUserGroups(groupsRes.data)
      setEntities(entitiesRes.data)
      setWorkflowPhases(phasesRes.data)
      setStatistics(statsRes.data)

      await loadUserNeeds()
    } catch (err) {
      setError('Failed to load data: ' + (err as Error).message)
    } finally {
      setLoading(false)
    }
  }

  const loadUserNeeds = async () => {
    try {
      const params: Record<string, string> = {}
      if (filters.userGroupId) params.userGroupId = filters.userGroupId
      if (filters.entity) params.entity = filters.entity
      if (filters.workflowPhase) params.workflowPhase = filters.workflowPhase
      if (filters.superGroup) params.superGroup = filters.superGroup
      if (filters.refined !== 'all') params.refined = filters.refined

      const res = await axios.get<UserNeed[]>(`${API_BASE}/user-needs`, { params })
      setUserNeeds(res.data)

      // Refresh statistics
      const statsRes = await axios.get<StatsType>(`${API_BASE}/statistics`)
      setStatistics(statsRes.data)
    } catch (err) {
      setError('Failed to load user needs: ' + (err as Error).message)
    }
  }

  const handleCreateNeed = async (needData: UserNeedCreate) => {
    try {
      await axios.post(`${API_BASE}/user-needs`, needData)
      await loadUserNeeds()
      setShowForm(false)
      setEditingNeed(null)
    } catch (err: any) {
      alert('Failed to create user need: ' + (err.response?.data?.detail || err.message))
    }
  }

  const handleUpdateNeed = async (needId: string, needData: UserNeedUpdate) => {
    try {
      await axios.put(`${API_BASE}/user-needs/${needId}`, needData)
      await loadUserNeeds()
      setEditingNeed(null)
      setShowForm(false)
    } catch (err: any) {
      alert('Failed to update user need: ' + (err.response?.data?.detail || err.message))
    }
  }

  const handleDeleteNeed = async (needId: string) => {
    if (!confirm('Are you sure you want to delete this user need?')) return

    try {
      await axios.delete(`${API_BASE}/user-needs/${needId}`)
      await loadUserNeeds()
    } catch (err) {
      alert('Failed to delete user need: ' + (err as Error).message)
    }
  }

  const handleToggleRefined = async (needId: string, refined: boolean) => {
    try {
      await axios.put(`${API_BASE}/user-needs/${needId}`, { refined })
      await loadUserNeeds()
    } catch (err: any) {
      alert('Failed to update refined status: ' + (err.response?.data?.detail || err.message))
    }
  }

  const handleCreateUserGroup = async (userGroup: UserGroup) => {
    try {
      await axios.post(`${API_BASE}/user-groups`, userGroup, { params: { demo_mode: demoMode } })
      setShowFirstTimeSetup(false)
      await loadData()
    } catch (err: any) {
      alert('Failed to create user group: ' + (err.response?.data?.detail || err.message))
      throw err
    }
  }

  const handleEdit = (need: UserNeed) => {
    setEditingNeed(need)
    setShowForm(true)
  }

  const handleCancelEdit = () => {
    setEditingNeed(null)
    setShowForm(false)
  }

  const handleFormSubmit = async (data: UserNeedCreate | UserNeedUpdate) => {
    if (editingNeed) {
      // Update existing need
      await handleUpdateNeed(editingNeed.id, data as UserNeedUpdate)
    } else {
      // Create new need
      await handleCreateNeed(data as UserNeedCreate)
    }
  }

  const handleFilterChange = (newFilters: FiltersType) => {
    setFilters(newFilters)
  }

  const handleDemoModeToggle = async (enabled: boolean) => {
    // Update demo mode on backend
    await dispatch(setDemoModeAsync(enabled))
    // Reload all data with new demo mode setting
    await loadData()
  }

  // Render first-time setup modal
  if (showFirstTimeSetup) {
    return (
      <div className="app">
        <Header demoMode={demoMode} onDemoModeToggle={handleDemoModeToggle} />
        <FirstTimeSetup onCreateUserGroup={handleCreateUserGroup} />
      </div>
    )
  }

  if (loading) {
    return (
      <div className="app">
        <Header demoMode={demoMode} onDemoModeToggle={handleDemoModeToggle} />
        <div className="loading">Loading...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="app">
        <Header demoMode={demoMode} onDemoModeToggle={handleDemoModeToggle} />
        <div className="error">{error}</div>
      </div>
    )
  }

  return (
    <div className="app">
      <Header demoMode={demoMode} onDemoModeToggle={handleDemoModeToggle} />

      <div className="app-container">
        <aside className="sidebar">
          <div className="view-switcher">
            <h3>View</h3>
            <div className="view-buttons">
              <button
                className={view === 'table' ? 'active' : ''}
                onClick={() => setView('table')}
              >
                Table
              </button>
              <button
                className={view === 'cards' ? 'active' : ''}
                onClick={() => setView('cards')}
              >
                Cards
              </button>
              <button
                className={view === 'graph' ? 'active' : ''}
                onClick={() => setView('graph')}
              >
                Graph
              </button>
            </div>

            {view === 'cards' && (
              <div className="card-size-toggle">
                <label>Card Size:</label>
                <div className="card-size-buttons">
                  <button
                    className={cardSize === 'normal' ? 'active' : ''}
                    onClick={() => setCardSize('normal')}
                  >
                    Normal
                  </button>
                  <button
                    className={cardSize === 'large' ? 'active' : ''}
                    onClick={() => setCardSize('large')}
                  >
                    Large
                  </button>
                </div>
              </div>
            )}
          </div>

          <Filters
            filters={filters}
            userGroups={userGroups}
            entities={entities}
            workflowPhases={workflowPhases}
            onFilterChange={handleFilterChange}
          />

          {statistics && (
            <Statistics
              statistics={statistics}
              userGroups={userGroups}
              onUserGroupClick={(userGroupId) => {
                setFilters({
                  userGroupId,
                  entity: '',
                  workflowPhase: '',
                  superGroup: '',
                  refined: 'all'
                })
              }}
              onSuperGroupClick={(superGroup) => {
                setFilters({
                  userGroupId: '',
                  entity: '',
                  workflowPhase: '',
                  superGroup,
                  refined: 'all'
                })
              }}
              onEntityClick={(entityId) => {
                setFilters({
                  userGroupId: '',
                  entity: entityId,
                  workflowPhase: '',
                  superGroup: '',
                  refined: 'all'
                })
              }}
              onWorkflowPhaseClick={(workflowPhaseId) => {
                setFilters({
                  userGroupId: '',
                  entity: '',
                  workflowPhase: workflowPhaseId,
                  superGroup: '',
                  refined: 'all'
                })
              }}
            />
          )}
        </aside>

        <main className="main-content">
          <div className="actions-bar">
            <button
              className="btn-primary"
              onClick={() => {
                if (showForm) {
                  // Cancel - close form and clear editing state
                  setShowForm(false)
                  setEditingNeed(null)
                } else {
                  // Add new - clear editing state and open form
                  setEditingNeed(null)
                  setShowForm(true)
                }
              }}
            >
              {showForm ? 'Cancel' : '+ Add User Need'}
            </button>
            <span className="results-count">
              {userNeeds.length} user need{userNeeds.length !== 1 ? 's' : ''}
            </span>
          </div>

          {view === 'graph' ? (
            <NetworkGraph
              userNeeds={userNeeds}
              userGroups={userGroups}
              entities={entities}
              workflowPhases={workflowPhases}
            />
          ) : (
            <UserNeedsList
              userNeeds={userNeeds}
              userGroups={userGroups}
              entities={entities}
              workflowPhases={workflowPhases}
              view={view}
              cardSize={cardSize}
              onEdit={handleEdit}
              onDelete={handleDeleteNeed}
              onToggleRefined={handleToggleRefined}
            />
          )}
        </main>
      </div>

      <UserNeedFormModal
        isOpen={showForm}
        onClose={handleCancelEdit}
        need={editingNeed}
        userGroups={userGroups}
        entities={entities}
        workflowPhases={workflowPhases}
        onSubmit={handleFormSubmit}
      />
    </div>
  )
}

export default App
