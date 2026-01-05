# Private Data Folder

This folder is designed to store multiple data.json files for different applications or projects you're working on with the User Needs Visualiser.

## Purpose

The User Needs Visualiser uses a single `data.json` file at the root of the project to store your active user needs data. The `private_data_folder` allows you to:

- Store backup copies of your data.json files
- Maintain separate user needs datasets for different applications
- Switch between different projects without losing your work
- Keep historical versions of your user needs analysis

## Recommended Structure

We recommend organizing your data files in subdirectories, each representing a different application or project:

```
private_data_folder/
├── README.md (this file)
├── my-ecommerce-app/
│   └── data.json
├── property-management-system/
│   └── data.json
├── healthcare-portal/
│   └── data.json
└── backups/
    ├── data-2026-01-05.json
    └── data-2025-12-20.json
```

## How to Use

### Switching Between Projects

To switch to a different project:

1. Copy your current root `data.json` to a backup location (optional but recommended):
   ```bash
   cp data.json private_data_folder/backups/data-$(date +%Y-%m-%d).json
   ```

2. Copy the desired project's data file to the root:
   ```bash
   cp private_data_folder/my-ecommerce-app/data.json data.json
   ```

3. Refresh your browser - the application will load the new data

### Creating a New Project

1. Create a new directory for your project:
   ```bash
   mkdir -p private_data_folder/my-new-project
   ```

2. Copy the template to start fresh:
   ```bash
   cp data.template.json private_data_folder/my-new-project/data.json
   ```

3. Or copy an existing project as a starting point:
   ```bash
   cp private_data_folder/my-ecommerce-app/data.json private_data_folder/my-new-project/data.json
   ```

### Backup Strategy

Consider creating periodic backups:

```bash
# Manual backup
cp data.json private_data_folder/backups/data-$(date +%Y-%m-%d-%H%M).json

# Or create a simple backup script
echo "cp data.json private_data_folder/backups/data-\$(date +%Y-%m-%d-%H%M).json" > backup.sh
chmod +x backup.sh
```

## Git Ignore

All contents of this folder (except this README.md) are ignored by git to protect your private data. This means:

- ✅ Your user needs data remains private
- ✅ You can work on multiple projects locally
- ✅ No risk of accidentally committing sensitive information
- ✅ This README is version controlled for guidance

## Important Notes

- **Keep filenames as `data.json`** within subdirectories to make switching easier
- The application always reads from the root `data.json` file
- Make sure to copy files, not move them, to preserve your backups
- Consider using descriptive folder names that match your project names
- The root `data.demomode.json` file is managed separately by the application's demo mode feature

## Example Workflow

Here's a typical workflow for managing multiple projects:

```bash
# Start a new project for "HealthTracker"
mkdir -p private_data_folder/health-tracker
cp data.template.json private_data_folder/health-tracker/data.json

# Work on HealthTracker
cp private_data_folder/health-tracker/data.json data.json
# ... make changes in the UI ...

# Save progress
cp data.json private_data_folder/health-tracker/data.json

# Switch to another project
cp private_data_folder/my-ecommerce-app/data.json data.json
# ... work on e-commerce ...

# Switch back to HealthTracker
cp private_data_folder/health-tracker/data.json data.json
```

## Tips

- Use clear, descriptive folder names
- Document your projects with a small README in each subdirectory
- Create backups before major changes
- Consider using version control for individual project folders if you need history tracking
- You can use symbolic links if you prefer: `ln -s private_data_folder/my-project/data.json data.json`
