
import { Terminal } from 'xterm';
import { useEffect, useState } from 'react';
import { BinderRepository } from '@jupyterhub/binderhub-client';

function buildImage(repo, ref, term, onImageBuilt) {
    const providerSpec = "gh/" + repo + "/" + ref;
    // FIXME: Assume the binder api is available in the same hostname, under /services/binder/
    let binderUrl = new URL(window.location.origin);
    binderUrl.pathname = '/services/binder/';
    const image = new BinderRepository(providerSpec, binderUrl.toString(), null, true)
    image.onStateChange('*', (oldState, newState, data) => {
        // Write out all messages to the terminal!
        term.write(data.message);
    })
    image.onStateChange('ready', (oldState, newState, data) => {
        // Close the EventStream when the image has been built
        image.close();
        onImageBuilt(data.imageName);
    });
    image.onStateChange('failed', (oldState, newState, data) => {
        // Close the image stream when stuff has failed
        image.close();
    });
    image.fetch();
}

function ImageLogs({expanded, setExpanded, setTerm}) {
    useEffect(function () {
        const term = new Terminal({
            convertEol: true,
            disableStdin: true
        });
        term.open(document.getElementById('terminal'));
        setTerm(term);
    }, []);

    return <div className="panel panel-default" id="build-image-panel">
        <div className="panel-heading" onClick={() => setExpanded((old) => !old)}>
            <span>Build Logs</span>
            <small id="logs-hide-toggle" className='pull-right'><a href="#">{expanded ? "click to hide" : "click to show"}</a></small>
        </div>
        <div className={"panel-body " + (expanded || "hidden")}>
            <div id="terminal"></div>
        </div>
    </div>

}
export function ImageBuilder({ inputName }) {
    const [repo, setRepo] = useState("");
    const [ref, setRef] = useState("HEAD");
    const [term, setTerm] = useState(null);
    const [imageName, setImageName] = useState("");
    const [logsVisible, setLogsVisible] = useState(false);

    return <div className="panel panel-default">
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
            <div className="row">
                <div className='col-md-8'>
                    {imageName && "Image has been built! Click the Start button to launch your server."}
                </div>
                <div className='col-md-4'>
                    <input type="button" id="build-image" className="btn btn-jupyter pull-right" value="Build image"
                        onClick={e => {
                            setLogsVisible(true);
                            buildImage(repo, ref, term, (imageName) => {
                                setImageName(imageName);
                                term.write("\nImage has been built! Click the start button to launch your server");
                            })
                        }}
                    />
                </div>
            </div>

            <ImageLogs setTerm={setTerm} expanded={logsVisible} setExpanded={setLogsVisible}/>
            {/* Hidden input that has the actual name of the image to launch */}
            <input name={inputName} className='hidden' type="hidden" value={imageName} />

        </div>
    </div>
}
