import { log } from "@graphprotocol/graph-ts";
import { createDustReturned, getDustReturned, getMint, getRedeem, getSwap, getUser, getZapBuy, getZapSell, getZapSwap } from "./helpers";

interface ZapAction {
  type: string;
  ethAmount: BigInt;
  vaultAction: string;
}

function handleZapAction(event: ethereum.Event, type: string, ethAmount: BigInt, vaultAction: string, getAction: (txHash: Bytes) => any): void {
  const txHash = event.transaction.hash;
  const action = getAction(txHash);
  const zapAction = {
    type,
    ethAmount,
    vaultAction
  } as ZapAction;

  if (action) {
    action.type = type;
    action.save();
    zapAction.vaultAction = action.id;
    zapAction.save();
    log.info(`${type.toUpperCase()} : ${type.toUpperCase()}.ID = {}`, [action.id]);
    createDustReturned(txHash, action.id);
  } else {
    log.warning(`Warning : ${type} not found; TxHash = {}`, [txHash.toHexString()]);
  }
}

export function handleBuy(event: Buy): void {
  const redeem = getRedeem(event.transaction.hash, event.address);
  redeem.type = "ZapBuy";
  redeem.save();
  handleZapAction(event, "ZapBuy", event.params.ethSpent, redeem.id, getZapBuy);
}

export function handleSell(event: Sell): void {
  const mint = getMint(event.transaction.hash, event.address);
  mint.type = "ZapSell";
  mint.save();
  handleZapAction(event, "ZapSell", event.params.ethReceived, mint.id, getZapSell);
}

export function handleSwap(event: Swap): void {
  const swap = getSwap(event.transaction.hash, event.address);
  swap.type = "ZapSwap";
  swap.save();
  handleZapAction(event, "ZapSwap", event.params.ethSpent, swap.id, getZapSwap);
}

export function handleDustReturned(event: DustReturned): void {
  const txHash = event.transaction.hash;
  const dustReturned = getDustReturned(txHash);
  if (dustReturned) {
    dustReturned.ethAmount = event.params.ethAmount;
    dustReturned.vTokenAmount = event.params.vTokenAmount;
    dustReturned.to = getUser(event.params.to).id;
    dustReturned.save();
  } else {
    log.warning(`Warning : DustReturned not found; Tx
