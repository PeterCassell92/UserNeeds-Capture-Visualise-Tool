import { useState } from 'react';
import Modal from './Modal';
import type { UserGroup } from '../types';
import './FirstTimeSetup.css';

interface FirstTimeSetupProps {
  onCreateUserGroup: (userGroup: UserGroup) => Promise<void>;
}

export function FirstTimeSetup({ onCreateUserGroup }: FirstTimeSetupProps) {
  const [name, setName] = useState('');
  const [superGroup, setSuperGroup] = useState<string>('aykua');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Generate ID from name (convert to snake_case)
  const generateId = (name: string): string => {
    return name
      .toLowerCase()
      .trim()
      .replace(/\s+/g, '_')
      .replace(/[^a-z0-9_]/g, '');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) {
      alert('Please enter a user group name');
      return;
    }

    const id = generateId(name);
    if (!id) {
      alert('Please enter a valid user group name');
      return;
    }

    setIsSubmitting(true);

    try {
      await onCreateUserGroup({
        id,
        name: name.trim(),
        superGroup,
      });
    } catch (err) {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal isOpen={true} onClose={() => {}} title="Welcome! Let's Get Started">
      <div className="first-time-setup">
        <p className="setup-intro">
          To begin using the User Needs Visualiser, let's create your first user group.
        </p>

        <form onSubmit={handleSubmit} className="setup-form">
          <div className="form-group">
            <label htmlFor="name">
              User Group Name <span className="required">*</span>
            </label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g., Admin, Customer, Developer"
              required
              autoFocus
            />
            {name && (
              <div className="field-hint">
                ID will be: <code>{generateId(name) || '(invalid)'}</code>
              </div>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="superGroup">
              Super Group <span className="required">*</span>
            </label>
            <select
              id="superGroup"
              value={superGroup}
              onChange={(e) => setSuperGroup(e.target.value)}
              required
            >
              <option value="aykua">Aykua (Internal Staff - Prefix: AYK)</option>
              <option value="clinic">Clinic (External Partners - Prefix: CLI)</option>
              <option value="medical_services_user">Medical Services User (End Users - Prefix: PAT)</option>
            </select>
            <div className="field-hint">
              Super groups organize user groups and determine ID prefixes for user needs.
            </div>
          </div>

          <div className="setup-actions">
            <button
              type="submit"
              className="btn-primary"
              disabled={isSubmitting || !name.trim()}
            >
              {isSubmitting ? 'Creating...' : 'Create User Group'}
            </button>
          </div>
        </form>

        <div className="setup-tip">
          <strong>Tip:</strong> You can try Demo Mode (from the menu in the header) to explore the app with sample data first.
        </div>
      </div>
    </Modal>
  );
}
