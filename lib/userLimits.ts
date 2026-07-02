import { PLAN_CAPABILITIES, PlanName } from "./planCapabilities";
import { AddonKey } from "./addonCapabilities";

export type WorkspaceLike = {
  subscriptionPlan: PlanName;
  addons: AddonKey[];
  users: any[];
};

export function canAddUser(workspace: WorkspaceLike): boolean {
  const caps = PLAN_CAPABILITIES[workspace.subscriptionPlan];

  // Extra seats add‑on = unlimited users
  if (workspace.addons.includes("extraSeats")) {
    return true;
  }

  const currentCount = workspace.users.length;
  return currentCount < caps.maxUsers;
}
