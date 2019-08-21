#!/bin/sh
#
# Copyright IBM Corp All Rights Reserved
#
# SPDX-License-Identifier: Apache-2.0
#
# Exit on first error, print all commands.
set +ev

if [ "$#" -gt 0 ]; then
    docker stop fabricvscodelocalfabric-peer0.org1.example.com-$1-$2
    docker rm fabricvscodelocalfabric-peer0.org1.example.com-$1-$2
else
  exit 1
fi
exit 0
