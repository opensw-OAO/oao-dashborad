#!/bin/bash

/usr/local/bin/uvicorn app.main:app --host 0.0.0.0 --port 8000 --proxy-headers