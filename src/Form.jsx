import { Terminal } from 'xterm';
import { createRoot } from 'react-dom/client';
import { useEffect } from 'react';

import '../node_modules/xterm/css/xterm.css';

import "./form.css";

function ImageBuilder() {
    useEffect(function () {
        const term = new Terminal();
        term.open(document.getElementById('terminal'));
        term.write('Build logs will be \x1B[1;3;31smtreamed\x1B[0m here ');
    }, []);

    return <div className="panel panel-default">
        <div className='panel-heading'>User Environment</div>
        <div className='panel-body'>
            <p>Use a mybinder.org compatible repository to build the environment</p>

            <div className='row'>
                <div className='col-md-8'>
                    <label>Repo</label>
                    <input className="form-control" type="text">
                    </input>
                </div>
                <div className='col-md-4'>
                    <label>Ref</label>
                    <input className="form-control" type="text">
                    </input>
                </div>
            </div>

            <div className="panel panel-default" id="build-image-panel">
                <div className="panel-heading" id="build-image-panel-header">
                    <span id='build-image-panel-title'>Build Logs</span>
                    <input type="button" id="build-image" className="btn btn-jupyter pull-right" value="Build image">
                    </input>
                </div>
                <div className="panel-body">
                    <div id="terminal"></div>
                </div>
            </div>

        </div>
    </div>
}

function ProfileOption({ profileSlug, optionName, displayName, choices }) {
    const formControlName = "profile-option-" + profileSlug + "-" + optionName;
    const defaultChoiceName = Object.keys(choices).find(choiceName => choices[choiceName].default) || Object.keys(choices)[0];

    return <div className='form-group'>
        <label className='col-sm-2 control-label' htmlFor={formControlName}>{displayName} </label>
        <div className='col-sm-10'>
            <select name={formControlName} className="form-control" defaultValue={defaultChoiceName}>
                {Object.keys(choices).map(choiceName => {
                    const choiceBody = choices[choiceName];
                    return <option key={choiceName} value={choiceName}>{choiceBody.display_name}</option>

                })}
            </select>
        </div>
    </div>

}
function ResourceSelector({ profile }) {
    const options = profile.profile_options;
    console.log(options);
    return <div className="panel panel-default">
        <div className='panel-heading'>Resolsjdafhakdhfsohjfurces</div>
        <div className='panel-body form-horizontal'>
            {Object.keys(options).map(optionName => {
                const optionBody = options[optionName];
                return <ProfileOption key={optionName} optionName={optionName} displayName={optionBody.display_name}
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
            <h1>THIS IS A NON-WORKING PROTOTYPE</h1>
            <p>
                The funky colors and large text are here to communicate that this is a <b>prototype</b>.
                It exists to help figure out how we can build complex UIs like this for the KubeSpawner
                profile selector page that are sustainable both for the kubespawner project as well as the
                people building the UI. These textboxes do nothing, and should not be taken as an indicator
                of how close any specific project is towards completion.
            </p>

            {/* We only support a single profile, and it must be marked as selected */}
            <input type="radio" className='hidden'
                name="profile"
                value={profile.slug}
                checked readOnly
            />

            <ImageBuilder />

            <ResourceSelector profile={profile} />
        </>
    );
}

const root = createRoot(document.getElementById('form'));
root.render(Form());
