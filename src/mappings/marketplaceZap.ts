import {
  Buy as BuyZapEvent,
  Sell as SellZapEvent,
  Swap as SwapZapEvent
} from '../types/NFTXMarketplaceZap/NFTXMarketplaceZap';
import { Minted } from '../types/NFTXVaultFactoryUpgradeable/NFTXVaultUpgradeable';

import {
  getSwap,
  getMint,
  getRedeem,
  getZapBuy,
  getZapSell,
  getZapSwap
} from './helpers';

export function handleBuyZap(event: BuyZapEvent): void {
  let txHash = event.transaction.hash;
  let redeem = getRedeem(txHash);
  let zapBuy = getZapBuy(txHash);

  redeem.type = "ZapBuy";
  redeem.save();

  try {
    let ethAmount = event.params.ethSpent;
    let vaultAction = redeem.id;
    zapBuy.ethAmount = ethAmount;
    zapBuy.vaultAction = vaultAction;
    zapBuy.save();
  } catch (error) {
    log.error("Error in handleBuyZap: {}", error.toString());
  }
}

export function handleSellZap(event: SellZapEvent): void {
  let txHash = event.transaction.hash;
  let mint = getMint(txHash);
  let zapSell = getZapSell(txHash);

  mint.type = "ZapSell";
  mint.save();

  try {
    let ethAmount = event.params.ethReceived;
    let vaultAction = mint.id;
    zapSell.ethAmount = ethAmount;
    zapSell.vaultAction = vaultAction;
    zapSell.save();
  } catch (error) {
    log.error("Error in handleSellZap: {}", error.toString());
  }
}

export function handleSwapZap(event: SwapZapEvent): void {
  let txHash = event.transaction.hash;
  let swap = getSwap(txHash);
  let zapSwap = getZapSwap(txHash);

  swap.type = "ZapSwap";
  swap.save();

  try {
    let ethAmount = event.params.ethSpent;
    let vaultAction = swap.id;
    zapSwap.ethAmount = ethAmount;
    zapSwap.vaultAction = vaultAction;
    zapSwap.save();
  } catch (error) {
    log.error("Error in handleSwapZap: {}", error.toString());
  }
}
