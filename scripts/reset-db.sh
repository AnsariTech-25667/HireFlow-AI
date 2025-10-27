#!/bin/bash

# Safety prompt
read -p "Are you sure you want to reset the database? This will drop all data. (y/N): " confirm
if [[ $confirm != "y" && $confirm != "Y" ]]; then
  echo "Aborted."
  exit 1
fi

# Placeholder: Drop and recreate database using environment variables
# Example (MongoDB):
# mongo "$DB_URI" --eval "db.dropDatabase()"
# mongo "$DB_URI" --eval "db.createCollection('users')"

# Add your actual reset logic here

echo "Reset complete"
