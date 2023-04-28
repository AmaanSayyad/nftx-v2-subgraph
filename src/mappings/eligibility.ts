import {
  UniqueEligibilitiesSet as UniqueEligibilitiesSetEvent,
  RangeSet as RangeSetEvent,
  EligibilityModule as EligibilityModuleContract,
} from '../types/templates/EligibilityModule/EligibilityModule';

import { getEligibilityModule, updateEligibleTokenIds } from './helpers';

/**
 * Handles the UniqueEligibilitiesSet event
 * @param event - the UniqueEligibilitiesSet event object
 */
export function handleUniqueEligibilitiesSet(
  event: UniqueEligibilitiesSetEvent,
): void {
  try {
    const moduleAddress = event.address;
    let module = getEligibilityModule(moduleAddress);

    // Check if module exists. If not, create a new instance.
    if (!module) {
      module = new EligibilityModule();
      module.address = moduleAddress;
      module.finalizedOnDeploy = false;
      module.finalized = false;
      module.eligibleTokenIds = [];
      module.eligibleRange = [];
    }

    // Get the finalized state of the module
    const instance = EligibilityModuleContract.bind(moduleAddress);
    const finalizedFromInstance = instance.try_finalized();
    const finalized = finalizedFromInstance.reverted
      ? module.finalizedOnDeploy
      : finalizedFromInstance.value;

    // Update module properties
    module.finalized = finalized;
    module = updateEligibleTokenIds(
      module,
      event.params.tokenIds,
      event.params.isEligible,
    );

    // Save updated module instance
    module.save();
  } catch (error) {
    log.error(`Error handling UniqueEligibilitiesSet event: ${error}`);
  }
}

/**
 * Handles the RangeSet event
 * @param event - the RangeSet event object
 */
export function handleRangeSet(event: RangeSetEvent): void {
  try {
    const moduleAddress = event.address;
    let module = getEligibilityModule(moduleAddress);

    // Check if module exists. If not, create a new instance.
    if (!module) {
      module = new EligibilityModule();
      module.address = moduleAddress;
      module.finalizedOnDeploy = false;
      module.finalized = false;
      module.eligibleTokenIds = [];
      module.eligibleRange = [];
    }

    // Get the finalized state of the module
    const instance = EligibilityModuleContract.bind(moduleAddress);
    const finalizedFromInstance = instance.try_finalized();
    const finalized = finalizedFromInstance.reverted
      ? module.finalizedOnDeploy
      : finalizedFromInstance.value;

    // Update module properties
    module.finalized = finalized;
    module.eligibleRange = [event.params.rangeStart, event.params.rangeEnd];

    // Save updated module instance
    module.save();
  } catch (error) {
    log.error(`Error handling RangeSet event
