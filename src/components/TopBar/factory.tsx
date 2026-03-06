import { Init } from "./init";
import { InitTopBarState } from "./store/init";
import UiFactory from "./ui/ui-factory";

export function Factory (props:InitTopBarState){

    const {type, avatarSource, level, levelProgress, coins} = props

    return(
        <Init type={type} avatarSource={avatarSource} level={level} levelProgress={levelProgress} coins={coins}>
            <UiFactory />
        </Init>
    )
}