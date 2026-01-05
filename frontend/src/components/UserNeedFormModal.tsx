import Modal from './Modal'
import UserNeedForm from './UserNeedForm'
import type { UserNeed, UserGroup, Entity, WorkflowPhase, UserNeedCreate, UserNeedUpdate } from '../types'

interface UserNeedFormModalProps {
  isOpen: boolean
  onClose: () => void
  need: UserNeed | null
  userGroups: UserGroup[]
  entities: Entity[]
  workflowPhases: WorkflowPhase[]
  onSubmit: (data: UserNeedCreate | UserNeedUpdate) => void
}

function UserNeedFormModal({
  isOpen,
  onClose,
  need,
  userGroups,
  entities,
  workflowPhases,
  onSubmit
}: UserNeedFormModalProps) {
  const title = need ? 'Edit User Need' : 'Add User Need'

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title}>
      <UserNeedForm
        need={need}
        userGroups={userGroups}
        entities={entities}
        workflowPhases={workflowPhases}
        onSubmit={onSubmit}
        onCancel={onClose}
      />
    </Modal>
  )
}

export default UserNeedFormModal
