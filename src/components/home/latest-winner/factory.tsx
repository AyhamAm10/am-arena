import { Init } from "./init";
import { InitLatestWinnerState } from "./state/init";
import UiFactory from "./ui/ui-factory";

export function Factory(props: InitLatestWinnerState) {
  const { teamName, tournamentName, imageSource } = props;
  return (
    <Init
      teamName={teamName}
      tournamentName={tournamentName}
      imageSource={imageSource}
    >
      <UiFactory />
    </Init>
  );
}
