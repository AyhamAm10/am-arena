import { Init } from "./init";
import { InitSuperSubState } from "./state/init";
import UiFactory from "./ui/ui-factory";

export function Factory(props: InitSuperSubState) {
  const { title, description, progress } = props;
  return (
    <Init title={title} description={description} progress={progress}>
      <UiFactory />
    </Init>
  );
}
