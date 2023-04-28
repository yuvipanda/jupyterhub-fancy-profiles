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

// FIXME: This should come *dynamically* from profile_list
function ResourceSelector() {
    return <div className="panel panel-default">
        <div className='panel-heading'>Resources</div>
        <div className='panel-body form-horizontal'>
            <div className='form-group'>
                <label className='col-sm-2 control-label'>Memory</label>
                <div className='col-sm-10'>
                    <select className='form-control'>
                        <option>2G</option>
                        <option>4G</option>
                        <option>8G</option>
                    </select>
                </div>
            </div>

            <div className='form-group'>
                <label className='col-sm-2 control-label'>CPU</label>
                <div className='col-sm-10'>
                    <select className='form-control'>
                        <option>2</option>
                        <option>4</option>
                        <option>8</option>
                    </select>
                </div>
            </div>
        </div>
    </div>;
}

function Form() {
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

            <form>
                <ImageBuilder />

                <ResourceSelector />
            </form>
        </>
    );
}

const root = createRoot(document.getElementById('form'));
root.render(Form());
