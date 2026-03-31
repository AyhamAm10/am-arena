import { Init } from "./init";
import type { NotificationItemInitState } from "./store/init";
import UiFactory from "./ui/ui-factory";

export type NotificationItemFactoryProps = NotificationItemInitState & {
  instanceId: string;
};

export function Factory(props: NotificationItemFactoryProps) {
  const { instanceId, byId } = props;
  return (
    <Init byId={byId} instanceId={instanceId}>
      <UiFactory instanceId={instanceId} />
    </Init>
  );
}
