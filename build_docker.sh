#!/bin/bash
docker image rm poosdproject/backendapp
docker build -f backend/docker . -t poosdproject/backendapp
docker image rm poosdproject/frontendapp
docker build -f frontend/docker . -t poosdproject/frontendapp