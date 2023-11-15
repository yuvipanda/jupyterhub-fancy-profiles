import { Terminal } from "xterm";
import { FitAddon } from "xterm-addon-fit";
import { useEffect, useState } from "react";
import { BinderRepository } from "@jupyterhub/binderhub-client";
import { SpawnerFormContext, CHOICE_TYPE } from "./state";
import { useContext } from "react";

async function buildImage(repo, ref, term, fitAddon, onImageBuilt) {
  const providerSpec = "gh/" + repo + "/" + ref;
  // FIXME: Assume the binder api is available in the same hostname, under /services/binder/
  const buildEndPointURL = new URL(
    "/services/binder/build/",
    window.location.origin,
  );
  const image = new BinderRepository(
    providerSpec,
    buildEndPointURL,
    null,
    true,
  );
  // Clear the last line written, so we start from scratch
  term.write("\x1b[2K\r");
  term.resize(66, 16);
  fitAddon.fit();
  for await (const data of image.fetch()) {
    // Write message to the log terminal if there is a message
    if (data.message !== undefined) {
      // Write out all messages to the terminal!
      term.write(data.message);
      // Resize our terminal to make sure it fits messages appropriately
      fitAddon.fit();
    } else {
      console.log(data);
    }

    switch (data.phase) {
      case "failed": {
        image.close();
        break;
      }
      case "ready": {
        // Close the EventStream when the image has been built
        image.close();
        onImageBuilt(data.imageName);
        break;
      }
      default: {
        console.log(data);
        break;
      }
    }
  }
}

function ImageLogs({ visible, setTerm, setFitAddon }) {
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
      <div
        className={`profile-option-label-container ${visible ? "" : "hidden"}`}
      >
        <label>Build Logs</label>
      </div>
      <div
        className={`profile-option-control-container ${
          visible ? "" : "hidden"
        }`}
      >
        <div className="terminal-container">
          <div id="terminal"></div>
        </div>
      </div>
    </>
  );
}
export function ImageBuilder({ visible, optionName }) {
  const [repo, setRepo] = useState("");
  const { setOptionValue } = useContext(SpawnerFormContext);

  // FIXME: Allow users to actually configure this
  const [ref, _] = useState("HEAD"); // eslint-disable-line no-unused-vars
  const [term, setTerm] = useState(null);
  const [fitAddon, setFitAddon] = useState(null);
  const [imageName, setImageName] = useState("");

  useEffect(() => {
    setOptionValue(optionName, CHOICE_TYPE.UNLISTED, imageName);
  }, [imageName]);

  useEffect(() => {
    if (visible) {
      // When the state of visibility changes, set option to be current imageName
      // This is empty string when we first start, and last built image otherwise
      // When we migrate *away* from this component, whatever we migrate to will
      // set this instead.
      setOptionValue(optionName, CHOICE_TYPE.UNLISTED, imageName);
    }
  }, [visible]);

  // We render everything, but only toggle visibility based on wether we are being
  // shown or hidden. This provides for more DOM stability, and also allows the image
  // to continue being built evn if the user moves away elsewhere. When hidden, we just
  // don't generate the hidden input that posts the built image out.
  return (
    <>
      <div
        className={`profile-option-label-container ${visible ? "" : "hidden"}`}
      >
        <label>GitHub Repository</label>
      </div>
      <div
        className={`profile-option-control-container ${
          visible ? "" : "hidden"
        }`}
      >
        <input
          type="text"
          value={repo}
          onChange={(e) => setRepo(e.target.value)}
        ></input>
      </div>
      <div
        className={`profile-option-control-container ${
          visible ? "" : "hidden"
        }`}
      >
        <input
          type="button"
          id="build-image"
          className="btn btn-jupyter pull-right"
          value="Build image"
          onClick={async () => {
            await buildImage(repo, ref, term, fitAddon, (imageName) => {
              setImageName(imageName);
              term.write(
                "\nImage has been built! Click the start button to launch your server",
              );
            });
          }}
        />
      </div>

      <ImageLogs
        visible={visible}
        setFitAddon={setFitAddon}
        setTerm={setTerm}
      />
    </>
  );
}
