import { useState, useEffect } from 'react';
import axios from 'axios';
import Modal from './Modal';
import type { UserGroup, UserSuperGroup } from '../types';
import './FirstTimeSetup.css';

interface FirstTimeSetupProps {
  onCreateUserGroup: (userGroup: UserGroup) => Promise<void>;
}

export function FirstTimeSetup({ onCreateUserGroup }: FirstTimeSetupProps) {
  const [name, setName] = useState('');
  const [superGroup, setSuperGroup] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Super group creation fields
  const [superGroupName, setSuperGroupName] = useState('');
  const [superGroupPrefix, setSuperGroupPrefix] = useState('');
  const [superGroups, setSuperGroups] = useState<UserSuperGroup[]>([]);
  const [isLoadingSuperGroups, setIsLoadingSuperGroups] = useState(true);

  // Load super groups on mount
  useEffect(() => {
    loadSuperGroups();
  }, []);

  const loadSuperGroups = async () => {
    try {
      setIsLoadingSuperGroups(true);
      const response = await axios.get<UserSuperGroup[]>('/api/user-super-groups');
      setSuperGroups(response.data);
    } catch (error) {
      console.error('Failed to load super groups:', error);
    } finally {
      setIsLoadingSuperGroups(false);
    }
  };

  // Generate ID from name (convert to snake_case)
  const generateId = (name: string): string => {
    return name
      .toLowerCase()
      .trim()
      .replace(/\s+/g, '_')
      .replace(/[^a-z0-9_]/g, '');
  };

  const handleAddSuperGroup = async () => {
    // Validate super group name (no spaces)
    if (!superGroupName.trim()) {
      alert('Please enter a super group name');
      return;
    }
    if (superGroupName.includes(' ')) {
      alert('Super group name cannot contain spaces');
      return;
    }

    // Validate prefix (exactly 3 uppercase letters)
    if (superGroupPrefix.length !== 3) {
      alert('Prefix must be exactly 3 letters');
      return;
    }
    if (!/^[A-Z]{3}$/.test(superGroupPrefix)) {
      alert('Prefix must be exactly 3 uppercase letters');
      return;
    }

    try {
      const newSuperGroup: UserSuperGroup = {
        id: superGroupName.toLowerCase(),
        name: superGroupName,
        prefix: superGroupPrefix,
      };

      await axios.post<UserSuperGroup>('/api/user-super-groups', newSuperGroup);

      // Reload super groups and select the new one
      await loadSuperGroups();
      setSuperGroup(newSuperGroup.id);

      // Clear form
      setSuperGroupName('');
      setSuperGroupPrefix('');

      alert(`Super group "${newSuperGroup.name}" created successfully!`);
    } catch (error: any) {
      console.error('Failed to create super group:', error);
      alert(error.response?.data?.detail || 'Failed to create super group');
    }
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

    if (!superGroup) {
      alert('Please select a super group');
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
            <label>
              Create New Super Group
            </label>
            <div className="super-group-creator">
              <input
                type="text"
                value={superGroupName}
                onChange={(e) => setSuperGroupName(e.target.value.replace(/\s/g, ''))}
                placeholder="Super group name (no spaces)"
                className="super-group-name-input"
              />
              <input
                type="text"
                value={superGroupPrefix}
                onChange={(e) => setSuperGroupPrefix(e.target.value.toUpperCase().slice(0, 3))}
                placeholder="3-letter prefix"
                maxLength={3}
                className="super-group-prefix-input"
              />
              <button
                type="button"
                onClick={handleAddSuperGroup}
                className="btn-add-super-group"
                disabled={!superGroupName || superGroupPrefix.length !== 3}
              >
                Add
              </button>
            </div>
            <div className="field-hint">
              Super group name cannot contain spaces. Prefix must be exactly 3 uppercase letters.
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="superGroup">
              Select Super Group <span className="required">*</span>
            </label>
            {isLoadingSuperGroups ? (
              <div className="loading">Loading super groups...</div>
            ) : superGroups.length === 0 ? (
              <div className="field-hint">Please create a super group first</div>
            ) : (
              <>
                <select
                  id="superGroup"
                  value={superGroup}
                  onChange={(e) => setSuperGroup(e.target.value)}
                  required
                >
                  <option value="">Select a super group...</option>
                  {superGroups.map((sg) => (
                    <option key={sg.id} value={sg.id}>
                      {sg.name} (Prefix: {sg.prefix})
                    </option>
                  ))}
                </select>
                <div className="field-hint">
                  Super groups organize user groups and determine ID prefixes for user needs.
                </div>
              </>
            )}
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
