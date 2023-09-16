import { createRoot } from 'react-dom/client';
import { ImageBuilder } from './ImageBuilder';
import { useState } from 'react';

import '../node_modules/xterm/css/xterm.css';

import "./form.css";

function ProfileOption({ profileSlug, optionName, displayName, choices }) {
    const formControlName = "profile-option-" + profileSlug + "-" + optionName;
    const defaultChoiceName = Object.keys(choices).find(choiceName => choices[choiceName].default) || Object.keys(choices)[0];

    return <div className='form-group'>
        <label className='col-sm-2 control-label' htmlFor={formControlName}>{displayName} </label>
        <div className='col-sm-10'>
            <select name={formControlName} className="form-control" defaultValue={defaultChoiceName}
            >
                {Object.keys(choices).map(choiceName => {
                    const choiceBody = choices[choiceName];
                    return <option key={choiceName} value={choiceName}>{choiceBody.display_name}</option>

                })}
            </select>
        </div>
    </div>
}

function ImageOption({ profileSlug, optionName, displayName, choices }) {
    const formControlName = "profile-option-" + profileSlug + "-" + optionName;
    const defaultChoiceName = Object.keys(choices).find(choiceName => choices[choiceName].default) || Object.keys(choices)[0];
    const [showImageBuilder, setShowImageBuilder] = useState(false);
    const [showImageSpecifier, setShowImageSpecifier] = useState(false);
    const [specifiedImage, setSpecifiedImage] = useState("");
    const buildImageKey = "other--build";
    const specifyImageKey = "other--specify";
    const unlistedImageFormInputName = `profile-option-${profileSlug}--${optionName}--unlisted-choice`;

    return <>
        <div className='form-group'>
            <label className='col-sm-2 control-label' htmlFor={formControlName}>{displayName} </label>
            <div className='col-sm-10'>
                {/* When we send an explicit image with unlisted choice, we should *not* send a value for the image field itself
                    This will confuse KubeSpawner and give us a 5xx. So we render the name attribute *only* if we are sending an
                    image option from the listed choices, and let it be empty if not.
                    */}
                <select name={!(showImageSpecifier || showImageBuilder) && formControlName} className="form-control" defaultValue={defaultChoiceName}
                    onChange={(ev) => {
                        setShowImageBuilder(ev.target.value === buildImageKey);
                        setShowImageSpecifier(ev.target.value === specifyImageKey)
                    }}
                >
                    {Object.keys(choices).map(choiceName => {
                        const choiceBody = choices[choiceName];
                        return <option key={choiceName} value={choiceName}>{choiceBody.display_name}</option>

                    })}
                    <option key={specifyImageKey} value={specifyImageKey}>Specify your own image</option>
                    <option key={buildImageKey} value={buildImageKey}>Build your own image (from a GitHub repository)</option>
                </select>
            </div>

        </div>

        {showImageSpecifier && <div className='form-group'>
            <label className='col-sm-2 control-label'>Custom Image</label>
            <div className='col-sm-10'>
                {/* Save and restore the typed in value, so we don't lose it if the user selects another choice */}
                <input name={unlistedImageFormInputName}
                    defaultValue={specifiedImage}
                    className="form-control" onChange={ev => setSpecifiedImage(ev.target.value)}
                />

            </div>

        </div>
        }
        {showImageBuilder && <ImageBuilder inputName={unlistedImageFormInputName} />}
    </>
}
function ResourceSelector({ profile }) {
    const options = profile.profile_options;


    return <div className="panel panel-default">
        <div className='panel-heading'>Options</div>
        <div className='panel-body form-horizontal'>
            {Object.keys(options).map(optionName => {
                const OptionComponent = optionName === "image" ? ImageOption : ProfileOption;
                const optionBody = options[optionName];
                return <OptionComponent key={optionName} optionName={optionName} displayName={optionBody.display_name}
                    profileSlug={profile.slug} choices={optionBody.choices}
                />
            })}
        </div>
    </div>;
}

/**
 * Generates the *contents* of the form shown in the profile selection page
 *
 * A <form> tag and a submit button are already included by JupyterHub, and should not
 * be generated here.
 */
function Form() {
    const profileList = window.profileList;
    const profile = profileList[0];

    return (
        <>
            {/* We only support a single profile, and it must be marked as selected */}
            <input type="radio" className='hidden'
                name="profile"
                value={profile.slug}
                checked readOnly
            />

            <ResourceSelector profile={profile} />
        </>
    );
}

const root = createRoot(document.getElementById('form'));
root.render(Form());
