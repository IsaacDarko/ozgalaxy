import React from 'react'

export const shortenAddress = (address) => `${address.slice(0,8)}...${address.slice(address.length - 9)}`
