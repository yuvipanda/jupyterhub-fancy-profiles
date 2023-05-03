
import { Terminal } from 'xterm';
import { useEffect, useState } from 'react';
import { BinderImage } from 'binderhub-client';

function buildImage(repo, ref, term) {
    const providerSpec = "gh/" + repo + "/" + ref;
    const image = new BinderImage(providerSpec, "https://mybinder.org/")
    image.onStateChange('*', (oldState, newState, data) => {
        term.write(data.message);
    })
    image.fetch();
}

export function ImageBuilder() {
    const [repo, setRepo] = useState("");
    const [ref, setRef] = useState("HEAD");
    const [term, setTerm] = useState(null);

    useEffect(function () {
        const term = new Terminal({
            convertEol: true,
            disableStdin: true
        });
        term.open(document.getElementById('terminal'));
        setTerm(term);
    }, []);

    return <div className="panel panel-default">
        <div className='panel-heading'>User Environment</div>
        <div className='panel-body'>
            <p>Use a mybinder.org compatible repository to build the environment</p>

            <div className='row'>
                <div className='col-md-8'>
                    <label>Repo</label>
                    <input className="form-control" type="text" value={repo} onChange={e => setRepo(e.target.value)}>
                    </input>
                </div>
                <div className='col-md-4'>
                    <label>Ref</label>
                    <input className="form-control" type="text" value={ref} onChange={e => setRef(e.target.value)}>
                    </input>
                </div>
            </div>

            <div className="panel panel-default" id="build-image-panel">
                <div className="panel-heading" id="build-image-panel-header">
                    <span id='build-image-panel-title'>Build Logs</span>
                    <input type="button" id="build-image" className="btn btn-jupyter pull-right" value="Build image"
                    onClick={e => buildImage(repo, ref, term)}
                    >
                    </input>
                </div>
                <div className="panel-body">
                    <div id="terminal"></div>
                </div>
            </div>

        </div>
    </div>
}