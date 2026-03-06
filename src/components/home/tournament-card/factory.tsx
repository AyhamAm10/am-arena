import { Init } from "./init";
import type { InitTournamentCardState } from "./state/init";
import UiFactory from "./ui/ui-factory";

export type TournamentCardFactoryProps = InitTournamentCardState & {
  instanceId: string;
};

export function Factory(props: TournamentCardFactoryProps) {
  const { instanceId, byId } = props;
  return (
    <Init byId={byId}>
      <UiFactory instanceId={instanceId} />
    </Init>
  );
}
