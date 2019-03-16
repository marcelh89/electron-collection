import React from "react";
import {
    Menu,
    MenuItem,
    Button,
    MenuDivider,
    Popover,
    Position,
    EditableText,
    Intent,
    Alert,
    Label,
    Card,
    Icon,
    Input,
    Overlay
} from "@blueprintjs/core";

export default class ChatSettings extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            showSettings: false
        };
    }

    handlerSettingsInterraction() {
        //Show/Hide Popover
        this.setState({
            showSettings: !this.state.showSettings
        });
    }

    render() {
        let settingsContent = (
            <div className="centered-container">
                <h5 className="align-center">Settings</h5>{" "}
                <div>
                    <Label text="Logout of Chat" className="pt-label">
                        {" "}
                        <Button
                            text="Logout"
                            intent={Intent.DANGER}
                            onClick={this.props.triggerDisconnected()}
                        />
                    </Label>
                </div>
            </div>
        );

        const tetherOptions = {
            constraints: [
                {
                    attachment: "together",
                    to: "scrollParent"
                }
            ]
        };

        return (
            <div>
                {" "}
                {/*Main Container*/}{" "}
                <Popover
                    content={settingsContent}
                    isOpen={this.state.showSettings}
                    onInteraction={this.handlerSettingsInterraction.bind(this)}
                    position={Position.RIGHT_TOP}
                    useSmartArrowPositioning={false}
                    tetherOptions={tetherOptions}
                >
                    <Button text="Settings" intent={Intent.PRIMARY} />
                </Popover>
                {/*Icon Triggerer*/}{" "}
            </div>
        );
    }
}