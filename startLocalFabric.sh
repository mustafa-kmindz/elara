#!/bin/bash
#
# SPDX-License-Identifier: Apache-2.0
# This code is based on code written by the Hyperledger Fabric community. 
#
# Exit on first error

set -e

# don't rewrite paths for Windows Git Bash users
export MSYS_NO_PATHCONV=1

CHANNEL_NAME=mychannel
CHAINCODE_ID=customerloyalty
V=1.0.0

starttime=$(date +%s)

if [ ! -d ~/.hfc-key-store/ ]; then
	mkdir ~/.hfc-key-store/
fi

# launch network; create channel and join peer to channel
cd local_fabric
./start.sh

# Now launch the CLI container in order to install, instantiate chaincode

echo "Installing.."
docker exec -e "CORE_PEER_LOCALMSPID=Org1MSP" -e "CORE_PEER_MSPCONFIGPATH=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/org1.example.com/users/Admin@org1.example.com/msp" cli peer chaincode install -n $CHAINCODE_ID -v $V -p /opt/gopath/src/github.com/ -l node
echo "Installed../n"

echo "Instantiating..."
docker exec -e "CORE_PEER_LOCALMSPID=Org1MSP" -e "CORE_PEER_MSPCONFIGPATH=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/org1.example.com/users/Admin@org1.example.com/msp" cli peer chaincode instantiate -o fabricvscodelocalfabric_orderer.example.com:17050 -C $CHANNEL_NAME -n $CHAINCODE_ID -v $V -c '{"Function":"instantiate","Args":[]}' -l node
echo "Instantiated"

#echo "Invoking..."
#docker exec -e "CORE_PEER_LOCALMSPID=Org1MSP" -e "CORE_PEER_MSPCONFIGPATH=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/org1.example.com/users/Admin@org1.example.com/msp" cli peer chaincode invoke -o orderer.example.com:7050 -C $CHANNEL_NAME -n $CHAINCODE_ID -c '{"function":"initLedger","Args":[""]}'
#echo "Invoked"

printf "\nTotal execution time : $(($(date +%s) - starttime)) secs ...\n\n"
printf "\nGo to web-app, run 'node enrollAdmin.js', then 'npm install' and then 'npm start'\n\n"
 
