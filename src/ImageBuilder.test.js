import { expect, test } from "@jest/globals";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import ProfileForm from "./ProfileForm";
import { SpawnerFormProvider } from "./state";

test("select repository by org/repo", async () => {
  fetch
    .mockResponseOnce("")
    .mockResponseOnce(JSON.stringify([{ name: "main" }, { name: "develop" }]));
  const user = userEvent.setup();

  render(
    <SpawnerFormProvider>
      <ProfileForm />
    </SpawnerFormProvider>,
  );
  const radio = screen.getByRole("radio", {
    name: "CPU only No GPU, only CPU",
  });
  await user.click(radio);

  const select = screen.getByLabelText("Image - dynamic image building");
  await user.click(select);

  await user.click(screen.getByText("Build your own image"));

  const repoField = screen.getByLabelText("Repository");
  await user.type(repoField, "org/repo");
  await user.click(document.body);

  const branchField = await screen.getByLabelText("Branch");
  await user.click(branchField);
  await user.click(screen.getByText("main"));
  expect(fetch.mock.calls[0][0]).toEqual(
    "https://api.github.com/repos/org/repo",
  );
});

test("select repository by https://github.com/org/repo", async () => {
  fetch
    .mockResponseOnce("")
    .mockResponseOnce(JSON.stringify([{ name: "main" }, { name: "develop" }]));
  const user = userEvent.setup();

  render(
    <SpawnerFormProvider>
      <ProfileForm />
    </SpawnerFormProvider>,
  );
  const radio = screen.getByRole("radio", {
    name: "CPU only No GPU, only CPU",
  });
  await user.click(radio);

  const select = screen.getByLabelText("Image - dynamic image building");
  await user.click(select);

  await user.click(screen.getByText("Build your own image"));

  const repoField = screen.getByLabelText("Repository");
  await user.type(repoField, "https://github.com/org/repo");
  await user.click(document.body);

  const branchField = await screen.getByLabelText("Branch");
  await user.click(branchField);
  await user.click(screen.getByText("main"));
  expect(fetch.mock.calls[0][0]).toEqual(
    "https://api.github.com/repos/org/repo",
  );
});

test("select repository by https://www.github.com/org/repo", async () => {
  fetch
    .mockResponseOnce("")
    .mockResponseOnce(JSON.stringify([{ name: "main" }, { name: "develop" }]));
  const user = userEvent.setup();

  render(
    <SpawnerFormProvider>
      <ProfileForm />
    </SpawnerFormProvider>,
  );
  const radio = screen.getByRole("radio", {
    name: "CPU only No GPU, only CPU",
  });
  await user.click(radio);

  const select = screen.getByLabelText("Image - dynamic image building");
  await user.click(select);

  await user.click(screen.getByText("Build your own image"));

  const repoField = screen.getByLabelText("Repository");
  await user.type(repoField, "https://www.github.com/org/repo");
  await user.click(document.body);

  const branchField = await screen.getByLabelText("Branch");
  await user.click(branchField);
  await user.click(screen.getByText("main"));
  expect(fetch.mock.calls[0][0]).toEqual(
    "https://api.github.com/repos/org/repo",
  );
});

test("select repository by github.com/org/repo", async () => {
  fetch
    .mockResponseOnce("")
    .mockResponseOnce(JSON.stringify([{ name: "main" }, { name: "develop" }]));
  const user = userEvent.setup();

  render(
    <SpawnerFormProvider>
      <ProfileForm />
    </SpawnerFormProvider>,
  );
  const radio = screen.getByRole("radio", {
    name: "CPU only No GPU, only CPU",
  });
  await user.click(radio);

  const select = screen.getByLabelText("Image - dynamic image building");
  await user.click(select);

  await user.click(screen.getByText("Build your own image"));

  const repoField = screen.getByLabelText("Repository");
  await user.type(repoField, "github.com/org/repo");
  await user.click(document.body);

  const branchField = await screen.getByLabelText("Branch");
  await user.click(branchField);
  await user.click(screen.getByText("main"));
  expect(fetch.mock.calls[0][0]).toEqual(
    "https://api.github.com/repos/org/repo",
  );
});

test("select repository by www.github.com/org/repo", async () => {
  fetch
    .mockResponseOnce("")
    .mockResponseOnce(JSON.stringify([{ name: "main" }, { name: "develop" }]));
  const user = userEvent.setup();

  render(
    <SpawnerFormProvider>
      <ProfileForm />
    </SpawnerFormProvider>,
  );
  const radio = screen.getByRole("radio", {
    name: "CPU only No GPU, only CPU",
  });
  await user.click(radio);

  const select = screen.getByLabelText("Image - dynamic image building");
  await user.click(select);

  await user.click(screen.getByText("Build your own image"));

  const repoField = screen.getByLabelText("Repository");
  await user.type(repoField, "www.github.com/org/repo");
  await user.click(document.body);

  const branchField = await screen.getByLabelText("Branch");
  await user.click(branchField);
  await user.click(screen.getByText("main"));
  expect(fetch.mock.calls[0][0]).toEqual(
    "https://api.github.com/repos/org/repo",
  );
});

test("invalid org/repo string (not matching pattern)", async () => {
  const user = userEvent.setup();

  render(
    <SpawnerFormProvider>
      <ProfileForm />
    </SpawnerFormProvider>,
  );
  const radio = screen.getByRole("radio", {
    name: "CPU only No GPU, only CPU",
  });
  await user.click(radio);

  const select = screen.getByLabelText("Image - dynamic image building");
  await user.click(select);

  await user.click(screen.getByText("Build your own image"));

  const repoField = screen.getByLabelText("Repository");
  await user.type(repoField, "org");
  await user.click(document.body);

  expect(
    screen.getByText(
      "Provide the repository as the format 'organization/repository'.",
    ),
  );
  expect(screen.queryByLabelText("Branch")).not.toBeInTheDocument();
});

test("invalid org/repo string (wrong base URL)", async () => {
  const user = userEvent.setup();

  render(
    <SpawnerFormProvider>
      <ProfileForm />
    </SpawnerFormProvider>,
  );
  const radio = screen.getByRole("radio", {
    name: "CPU only No GPU, only CPU",
  });
  await user.click(radio);

  const select = screen.getByLabelText("Image - dynamic image building");
  await user.click(select);

  await user.click(screen.getByText("Build your own image"));

  const repoField = screen.getByLabelText("Repository");
  await user.type(repoField, "example.com/org/repo");
  await user.click(document.body);

  expect(
    screen.getByText(
      "Provide the repository as the format 'organization/repository'.",
    ),
  );
  expect(screen.queryByLabelText("Branch")).not.toBeInTheDocument();
});

test("repo not found", async () => {
  fetch.mockResponseOnce("", { status: 400 });
  const user = userEvent.setup();

  render(
    <SpawnerFormProvider>
      <ProfileForm />
    </SpawnerFormProvider>,
  );
  const radio = screen.getByRole("radio", {
    name: "CPU only No GPU, only CPU",
  });
  await user.click(radio);

  const select = screen.getByLabelText("Image - dynamic image building");
  await user.click(select);

  await user.click(screen.getByText("Build your own image"));

  const repoField = screen.getByLabelText("Repository");
  await user.type(repoField, "https://github.com/org/repo");
  await user.click(document.body);

  expect(screen.queryByLabelText("Branch")).not.toBeInTheDocument();
});

test("no org/repo provided", async () => {
  const user = userEvent.setup();

  render(
    <SpawnerFormProvider>
      <ProfileForm />
    </SpawnerFormProvider>,
  );
  const radio = screen.getByRole("radio", {
    name: "CPU only No GPU, only CPU",
  });
  await user.click(radio);

  const select = screen.getByLabelText("Image - dynamic image building");
  await user.click(select);

  await user.click(screen.getByText("Build your own image"));
  await user.click(screen.getByRole("button", { name: "Build image" }));

  expect(
    screen.getByText(
      "Provide the repository as the format 'organization/repository'.",
    ),
  );
});

test("no branch selected", async () => {
  fetch
    .mockResponseOnce("")
    .mockResponseOnce(JSON.stringify([{ name: "main" }, { name: "develop" }]));
  const user = userEvent.setup();

  render(
    <SpawnerFormProvider>
      <ProfileForm />
    </SpawnerFormProvider>,
  );
  const radio = screen.getByRole("radio", {
    name: "CPU only No GPU, only CPU",
  });
  await user.click(radio);

  const select = screen.getByLabelText("Image - dynamic image building");
  await user.click(select);

  await user.click(screen.getByText("Build your own image"));

  const repoField = screen.getByLabelText("Repository");
  await user.type(repoField, "org/repo");
  await user.click(document.body);

  expect(screen.queryByLabelText("Branch")).toBeInTheDocument();
  await user.click(screen.getByRole("button", { name: "Build image" }));

  expect(screen.getByText("Select a branch."));
});
