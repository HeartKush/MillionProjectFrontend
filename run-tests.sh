#!/bin/bash
echo "Ejecutando tests..."
npm test 2>&1 | head -100

