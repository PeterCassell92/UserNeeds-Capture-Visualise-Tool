import { useState, useEffect } from 'react'
import UserNeedsList from './components/UserNeedsList'
import UserNeedFormModal from './components/UserNeedFormModal'
import Filters from './components/Filters'
import Statistics from './components/Statistics'
import NetworkGraph from './components/NetworkGraph'
import { Header } from './components/Header'
import { FirstTimeSetup } from './components/FirstTimeSetup'
import { useAppDispatch, useAppSelector } from './store/hooks'
import { fetchDemoMode } from './store/settingsSlice'
import { setFilters } from './store/filtersSlice'
import {
  loadReferenceData,
  loadUserNeeds,
  createUserNeed,
  updateUserNeed,
  deleteUserNeed,
  createUserGroup
} from './store/userNeedsSlice'
import { apiService } from './services/apiService'
import type { UserNeed, UserGroup, UserNeedCreate, UserNeedUpdate } from './types'
import './App.css'

type ViewType = 'table' | 'cards' | 'graph'
type CardSize = 'normal' | 'large'

function App() {
  const dispatch = useAppDispatch()

  // Redux state
  const demoMode = useAppSelector((state) => state.settings.demoMode)
  const filters = useAppSelector((state) => state.filters)
  const { userNeeds, userGroups, entities, workflowPhases, statistics, loading, error } = useAppSelector((state) => state.userNeeds)

  // Local UI state only
  const [editingNeed, setEditingNeed] = useState<UserNeed | null>(null)
  const [showForm, setShowForm] = useState(false)
  const [showFirstTimeSetup, setShowFirstTimeSetup] = useState(false)
  const [view, setView] = useState<ViewType>('cards')
  const [cardSize, setCardSize] = useState<CardSize>('normal')

  // Fetch demo mode state from backend on initialization
  useEffect(() => {
    const initializeApp = async () => {
      await dispatch(fetchDemoMode())
      checkSetup()
    }
    initializeApp()
  }, [dispatch])

  // Load user needs when filters change
  useEffect(() => {
    if (!loading && userGroups.length > 0) {
      dispatch(loadUserNeeds())
    }
  }, [filters, dispatch])

  // Note: Escape key handling is now done in the Modal component

  const checkSetup = async () => {
    try {
      const response = await apiService.checkSetup()

      // Only trigger first-time setup if not in demo mode and needs setup
      if (!demoMode && response.needsSetup) {
        setShowFirstTimeSetup(true)
      } else {
        dispatch(loadReferenceData())
        dispatch(loadUserNeeds())
      }
    } catch (err) {
      // If check fails, continue with normal loading
      dispatch(loadReferenceData())
      dispatch(loadUserNeeds())
    }
  }

  const handleCreateNeed = async (needData: UserNeedCreate) => {
    try {
      await dispatch(createUserNeed(needData))
      setShowForm(false)
      setEditingNeed(null)
    } catch (err: any) {
      alert('Failed to create user need: ' + (err.message || 'Unknown error'))
    }
  }

  const handleUpdateNeed = async (needId: string, needData: UserNeedUpdate) => {
    try {
      await dispatch(updateUserNeed({ id: needId, data: needData }))
      setEditingNeed(null)
      setShowForm(false)
    } catch (err: any) {
      alert('Failed to update user need: ' + (err.message || 'Unknown error'))
    }
  }

  const handleDeleteNeed = async (needId: string) => {
    if (!confirm('Are you sure you want to delete this user need?')) return

    try {
      await dispatch(deleteUserNeed(needId))
    } catch (err) {
      alert('Failed to delete user need: ' + (err as Error).message)
    }
  }

  const handleToggleRefined = async (needId: string, refined: boolean) => {
    try {
      await dispatch(updateUserNeed({ id: needId, data: { refined } }))
    } catch (err: any) {
      alert('Failed to update refined status: ' + (err.message || 'Unknown error'))
    }
  }

  const handleCreateUserGroup = async (userGroup: UserGroup) => {
    try {
      await dispatch(createUserGroup(userGroup))
      setShowFirstTimeSetup(false)
      await dispatch(loadReferenceData())
      await dispatch(loadUserNeeds())
    } catch (err: any) {
      alert('Failed to create user group: ' + (err.message || 'Unknown error'))
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

  const handleFilterChange = (newFilters: typeof filters) => {
    dispatch(setFilters(newFilters))
  }

  // Render first-time setup modal
  if (showFirstTimeSetup) {
    return (
      <div className="app">
        <Header />
        <FirstTimeSetup onCreateUserGroup={handleCreateUserGroup} />
      </div>
    )
  }

  if (loading) {
    return (
      <div className="app">
        <Header />
        <div className="loading">Loading...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="app">
        <Header />
        <div className="error">{error}</div>
      </div>
    )
  }

  return (
    <div className="app">
      <Header />

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
                dispatch(setFilters({
                  userGroupId,
                  entity: '',
                  workflowPhase: '',
                  superGroup: '',
                  refined: 'all'
                }))
              }}
              onSuperGroupClick={(superGroup) => {
                dispatch(setFilters({
                  userGroupId: '',
                  entity: '',
                  workflowPhase: '',
                  superGroup,
                  refined: 'all'
                }))
              }}
              onEntityClick={(entityId) => {
                dispatch(setFilters({
                  userGroupId: '',
                  entity: entityId,
                  workflowPhase: '',
                  superGroup: '',
                  refined: 'all'
                }))
              }}
              onWorkflowPhaseClick={(workflowPhaseId) => {
                dispatch(setFilters({
                  userGroupId: '',
                  entity: '',
                  workflowPhase: workflowPhaseId,
                  superGroup: '',
                  refined: 'all'
                }))
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
