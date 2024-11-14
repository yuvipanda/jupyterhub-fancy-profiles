import { useEffect, useState, useRef, useContext } from "react";
import Select from "react-select";
import { SpawnerFormContext } from "./state";
import useRepositoryField from "./hooks/useRepositoryField";
import useRefField from "./hooks/useRefField";

async function buildImage(repo, ref, term, fitAddon) {
  const { BinderRepository } = await import("@jupyterhub/binderhub-client");
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
        return Promise.reject();
      }
      case "ready": {
        // Close the EventStream when the image has been built
        image.close();
        return Promise.resolve(data.imageName);
      }
      default: {
        console.log("Unknown phase in response from server");
        console.log(data);
        break;
      }
    }
  }
}

function ImageLogs({ setTerm, setFitAddon, name }) {
  const terminalId = `${name}--terminal`;
  useEffect(() => {
    async function setup() {
      const { Terminal } = await import("xterm");
      const { FitAddon } = await import("xterm-addon-fit");
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
      term.open(document.getElementById(terminalId));
      fitAddon.fit();
      setTerm(term);
      setFitAddon(fitAddon);
      term.write("Logs will appear here when image is being built");
    }
    setup();
  }, []);

  return (
    <div className="terminal-container">
      <div id={terminalId}></div>
    </div>
  );
}

export function ImageBuilder({ name, isActive }) {
  const {
    binderRepo,
    ref: repoRef,
    setCustomOption,
  } = useContext(SpawnerFormContext);
  const { repo, repoId, repoFieldProps, repoError, repoIsValidating } =
    useRepositoryField(binderRepo);
  const { ref, refError, refFieldProps, refIsLoading } = useRefField(
    repoId,
    repoRef,
  );
  const repoFieldRef = useRef();
  const branchFieldRef = useRef();

  const [customImage, setCustomImage] = useState("");
  const [customImageError, setCustomImageError] = useState(null);

  const [term, setTerm] = useState(null);
  const [fitAddon, setFitAddon] = useState(null);

  const [isBuildingImage, setIsBuildingImage] = useState(false);

  useEffect(() => {
    if (!isActive) setCustomImageError("");
  }, [isActive]);

  useEffect(() => {
    if (setCustomOption) {
      repoFieldRef.current.setAttribute("value", binderRepo);
      branchFieldRef.current.value = repoRef;
    }
  }, [binderRepo, repoRef, setCustomOption]);

  const handleBuildStart = async () => {
    if (!repo) {
      repoFieldRef.current.focus();
      repoFieldRef.current.blur();
      return;
    }

    if (!ref) {
      branchFieldRef.current.focus();
      branchFieldRef.current.blur();
      return;
    }

    setIsBuildingImage(true);
    buildImage(repoId, ref, term, fitAddon)
      .then((imageName) => {
        setCustomImage(imageName);
        term.write(
          "\nImage has been built! Click the start button to launch your server",
        );
      })
      .catch(() => console.log(`Error building image.`))
      .finally(() => setIsBuildingImage(false));
  };

  // We render everything, but only toggle visibility based on wether we are being
  // shown or hidden. This provides for more DOM stability, and also allows the image
  // to continue being built evn if the user moves away elsewhere. When hidden, we just
  // don't generate the hidden input that posts the built image out.
  return (
    <>
      <div className="profile-option-container">
        <div className="profile-option-label-container">Provider</div>
        <div className="profile-option-control-container">GitHub</div>
      </div>

      <div className="profile-option-container">
        <div className="profile-option-label-container">
          <label htmlFor="repo" className="form-label">
            Repository
          </label>
        </div>
        <div className="profile-option-control-container">
          <input
            className={`form-control ${repoError ? "is-invalid" : ""}`}
            id="repo"
            type="text"
            ref={repoFieldRef}
            {...repoFieldProps}
            aria-invalid={!!repoError}
          />
          {repoIsValidating && (
            <div className="profile-option-control-info">
              Validating repository...
            </div>
          )}
          {repoError && <div className="invalid-feedback">{repoError}</div>}
        </div>
      </div>

      <div className="profile-option-container">
        <div className="profile-option-label-container">
          <div className="form-label">Git Ref</div>
        </div>
        <div className="profile-option-control-container">
          <Select
            aria-label="Git Ref"
            ref={branchFieldRef}
            {...refFieldProps}
            aria-invalid={!!refError}
            isDisabled={!refFieldProps.options}
          />
          {refIsLoading && !refIsLoading && (
            <div className="profile-option-control-info">
              Loading Git ref options...
            </div>
          )}
          {refError && <div className="is-invalid">{refError}</div>}
        </div>
      </div>

      <div className="right-button">
        <button
          type="button"
          className="btn btn-jupyter"
          onClick={handleBuildStart}
          disabled={isBuildingImage}
        >
          Build image
        </button>
      </div>
      <input
        type="text"
        name={name}
        value={customImage}
        aria-invalid={isActive && !customImage}
        required={isActive}
        aria-hidden="true"
        style={{ display: "none" }}
        onInvalid={() =>
          setCustomImageError("Wait for the image build to complete.")
        }
        onChange={() => {}} // Hack to prevent a console error, while at the same time allowing for this field to be validatable, ie. not making it read-only
      />
      <div className="profile-option-container">
        <div className="profile-option-label-container">
          <b>Build Logs</b>
        </div>
        <div className="profile-option-control-container">
          <ImageLogs setFitAddon={setFitAddon} setTerm={setTerm} name={name} />
          {customImageError && (
            <div className="profile-option-control-error">
              {customImageError}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
