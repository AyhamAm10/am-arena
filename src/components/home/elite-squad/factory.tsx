import { Init } from "./init";
import { InitEliteSquadState } from "./state/init";
import UiFactory from "./ui/ui-factory";

export function Factory(props: InitEliteSquadState) {
  const { superTournaments, onJoinPress } = props;
  return (
    <Init superTournaments={superTournaments} onJoinPress={onJoinPress}>
      <UiFactory />
    </Init>
  );
}
