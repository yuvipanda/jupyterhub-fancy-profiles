import { Terminal } from "xterm";
import { FitAddon } from "xterm-addon-fit";
import { useEffect, useState } from "react";
import { BinderRepository } from "@jupyterhub/binderhub-client";

function buildImage(repo, ref, term, fitAddon, onImageBuilt) {
  const providerSpec = "gh/" + repo + "/" + ref;
  // FIXME: Assume the binder api is available in the same hostname, under /services/binder/
  let binderUrl = new URL(window.location.origin);
  binderUrl.pathname = "/services/binder/";
  const image = new BinderRepository(
    providerSpec,
    binderUrl.toString(),
    null,
    true,
  );
  // Clear the last line written, so we start from scratch
  term.write("\x1b[2K\r");
  term.resize(66, 16);
  fitAddon.fit();
  image.onStateChange("*", (oldState, newState, data) => {
    // Write out all messages to the terminal!
    term.write(data.message);
    // Resize our terminal to make sure it fits messages appropriately
    fitAddon.fit();
  });
  image.onStateChange("ready", (oldState, newState, data) => {
    // Close the EventStream when the image has been built
    image.close();
    onImageBuilt(data.imageName);
  });
  image.onStateChange("failed", () => {
    // Close the image stream when stuff has failed
    image.close();
  });
  image.fetch();
}

function ImageLogs({ setTerm, setFitAddon }) {
  useEffect(function () {
    const term = new Terminal({
      convertEol: true,
      disableStdin: true,
      // 60 cols is pretty small, but unfortunately we have very limited width
      // available in our form!
      cols: 66,
      rows: 1,
    });
    const fitAddon = new FitAddon();
    term.loadAddon(fitAddon);
    term.open(document.getElementById("terminal"));
    fitAddon.fit();
    setTerm(term);
    setFitAddon(fitAddon);
    term.write("Logs will appear here when image is being built");
  }, []);

  return (
    <>
      <div className="profile-option-label-container build-logs-label-container">
        <label>Build Logs</label>
      </div>
      <div className="profile-option-control-container">
        <div className="terminal-container">
          <div id="terminal"></div>
        </div>
      </div>
    </>
  );
}
export function ImageBuilder({ visible, setUnlistedImage }) {
  const [repo, setRepo] = useState("");

  // FIXME: Allow users to actually configure this
  const [ref, setRef] = useState("HEAD");
  const [term, setTerm] = useState(null);
  const [fitAddon, setFitAddon] = useState(null);

  return (
    visible && (
      <>
        <div className="profile-option-label-container">
          <label>GitHub Repository</label>
        </div>
        <div className="profile-option-control-container">
          <input
            type="text"
            value={repo}
            onChange={(e) => setRepo(e.target.value)}
          ></input>
        </div>
        <div className="profile-option-control-container">
          <input
            type="button"
            id="build-image"
            className="btn btn-jupyter pull-right"
            value="Build image"
            onClick={() => {
              buildImage(repo, ref, term, fitAddon, (imageName) => {
                setUnlistedImage(imageName);
                term.write(
                  "\nImage has been built! Click the start button to launch your server",
                );
              });
            }}
          />
        </div>

        <ImageLogs setFitAddon={setFitAddon} setTerm={setTerm} />
      </>
    )
  );
}
