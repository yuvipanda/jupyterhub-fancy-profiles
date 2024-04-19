import ResourceSelect from "./ResourceSelect";

export function ProfileOptions({ config, profile }) {
  return (
    <div className="form-grid">
      {Object.entries(config).map(([key, option]) => {
        return <ResourceSelect key={key} id={key} profile={profile} config={option} />
      })}
    </div>
  );
}
