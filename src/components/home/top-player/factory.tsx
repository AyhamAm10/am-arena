import { Init } from "./init";
import type { InitTopPlayerState } from "./state/init";
import UiFactory from "./ui/ui-factory";

export type TopPlayerFactoryProps = InitTopPlayerState & {
  instanceId: string;
};

export function Factory(props: TopPlayerFactoryProps) {
  const { instanceId, byId } = props;
  return (
    <Init byId={byId}>
      <UiFactory instanceId={instanceId} />
    </Init>
  );
}
