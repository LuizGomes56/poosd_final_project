#!/bin/bash
docker build -f backend/docker . -t poosdproject/backendapp
docker build -f frontend/docker . -t poosdproject/frontendapp