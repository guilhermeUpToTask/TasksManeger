#! /usr/bin/env bash

set -e
set -x

# Let the DB start
python app/backend_pre_start.py

# Run migrations
alembic upgrade head

# Create initial data in DB
# python app/initial_data.py
# later on we will create initial data, and utilize to run automized tests